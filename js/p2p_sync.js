/**
 * MOTOR DE SINCRONIZACIÓN EN TIEMPO REAL MULTI-NIVEL
 * (Nube MQTT + API Central /api/sync + BroadcastChannel Local)
 * Asignatura: Arquitectura de Computadoras - Universidad Aztlán
 * Profesor Titular & Super Administrador: Ing. Luis Garibaldi
 */

const P2PSyncEngine = {
  channelName: "aztlan_arq_p2p_channel",
  mqttTopicPrefix: "universidad_aztlan/arq_comp_636",
  broadcastChannel: null,
  mqttClient: null,
  status: "idle", // 'connected' | 'syncing' | 'error' | 'idle'
  connectedSources: [],
  lastSyncTimestamp: null,
  pollTimer: null,
  listeners: [],

  init() {
    this.lastSyncTimestamp = new Date();

    // 1. Iniciar canal de difusión local entre pestañas (BroadcastChannel)
    try {
      if (typeof BroadcastChannel !== "undefined") {
        this.broadcastChannel = new BroadcastChannel(this.channelName);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingMessage(event.data, "BroadcastChannel");
        };
        this.connectedSources.push("Pestañas Locales");
      }
    } catch (e) {
      console.warn("BroadcastChannel no disponible:", e);
    }

    // 2. Iniciar conexión en tiempo real a la Nube (MQTT sobre WebSockets)
    this.initMqttCloudSync();

    // 3. Iniciar sincronización periódica con el Servidor Central (/api/sync)
    this.initServerPolling();

    // 4. Suscribirse a cambios locales de base de datos para difundirlos automáticamente
    Database.subscribe((updatedDb) => {
      this.broadcastLocalState(updatedDb);
    });

    this.status = "connected";
    this.notifyStatus();

    // Sincronizar de inmediato al arrancar
    setTimeout(() => {
      this.syncWithServerApi();
      this.publishMyStudentStateIfApplicable();
    }, 1000);
  },

  // =========================================================================
  // 1. CAPA NUBE: MQTT SOBRE WEBSOCKETS (Sincronización en vivo entre cualquier PC)
  // =========================================================================
  initMqttCloudSync() {
    if (typeof mqtt === "undefined") {
      console.warn("Librería MQTT no cargada, continuando con API y BroadcastChannel.");
      return;
    }

    const clientId = "aztlan_" + Math.random().toString(16).substring(2, 10);
    const brokerUrl = "wss://broker.emqx.io:8084/mqtt";

    try {
      this.mqttClient = mqtt.connect(brokerUrl, {
        clientId: clientId,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 4000
      });

      this.mqttClient.on("connect", () => {
        console.log("⚡ Conectado a la Nube de Sincronización en Tiempo Real (MQTT)");
        if (!this.connectedSources.includes("Nube en Vivo")) {
          this.connectedSources.push("Nube en Vivo");
        }
        this.status = "connected";
        this.notifyStatus();

        // Suscribirse al canal general y a los canales individuales de alumnos
        this.mqttClient.subscribe(this.mqttTopicPrefix + "/sync_all", { qos: 1 });
        this.mqttClient.subscribe(this.mqttTopicPrefix + "/student/+", { qos: 1 });

        // Publicar de inmediato el estado actual retenido
        this.publishMyStudentStateIfApplicable();
      });

      this.mqttClient.on("message", (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          this.handleIncomingMessage(payload, "Nube MQTT");
        } catch (err) {
          console.warn("Mensaje MQTT no legible:", err);
        }
      });

      this.mqttClient.on("error", (err) => {
        console.warn("Aviso conexión MQTT:", err);
      });
    } catch (e) {
      console.warn("No se pudo iniciar MQTT:", e);
    }
  },

  publishMyStudentStateIfApplicable() {
    const user = AuthService.getCurrentUser();
    const data = Database.getData();
    if (!user) return;

    if (user.role === "student" && this.mqttClient && this.mqttClient.connected) {
      const myProgress = data.progress[user.id];
      if (myProgress) {
        const payload = {
          type: "STUDENT_PROGRESS_UPDATE",
          studentId: user.id,
          progress: { [user.id]: myProgress },
          sender: user.email,
          timestamp: new Date().toISOString()
        };
        // Publicar con retain=true para que el profesor lo reciba al instante en que abra su sesión
        this.mqttClient.publish(
          this.mqttTopicPrefix + "/student/" + user.id,
          JSON.stringify(payload),
          { qos: 1, retain: true }
        );
      }
    }
  },

  // =========================================================================
  // 2. CAPA SERVIDOR: API REST /api/sync (Local, LAN y Vercel)
  // =========================================================================
  initServerPolling() {
    // Sincronizar periódicamente cada 3.5 segundos en segundo plano
    this.pollTimer = setInterval(() => {
      this.syncWithServerApi();
    }, 3500);
  },

  async syncWithServerApi() {
    try {
      // 1. GET para consultar si hay avances de otros alumnos en el servidor
      const res = await fetch("/api/sync", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" }
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.progress) {
          const changed = Database.mergeIncomingProgress(data.progress);
          if (changed) {
            console.log("⚡ Avances de alumnos sincronizados desde el Servidor Central");
            this.lastSyncTimestamp = new Date();
            this.notifyStatus();
          }
          if (!this.connectedSources.includes("Servidor Central")) {
            this.connectedSources.push("Servidor Central");
          }
        }
      }
    } catch (e) {
      // Entorno puramente estático o servidor apagado
    }
  },

  async pushToServerApi(progressData) {
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: progressData })
      });
      if (res.ok) {
        const result = await res.json();
        if (result && result.progress) {
          Database.mergeIncomingProgress(result.progress);
        }
      }
    } catch (e) {
      // Servidor local no disponible, la nube MQTT y localStorage respaldan los datos
    }
  },

  // =========================================================================
  // 3. PROCESAMIENTO CENTRAL DE MENSAJES Y DIFUSIÓN
  // =========================================================================
  handleIncomingMessage(msg, sourceName) {
    if (!msg) return;

    const currentEmail = AuthService.getCurrentUser()?.email;
    // Evitar procesar nuestros propios ecos
    if (msg.sender && currentEmail && msg.sender.toLowerCase() === currentEmail.toLowerCase()) {
      return;
    }

    if (msg.progress || (msg.payload && msg.payload.progress)) {
      const incomingProg = msg.progress || msg.payload.progress;
      const changed = Database.mergeIncomingProgress(incomingProg);
      if (changed) {
        console.log(`⚡ Sincronización en vivo recibida vía [${sourceName}]:`, msg.sender || "Alumno");
        this.lastSyncTimestamp = new Date();
        this.status = "connected";
        this.notifyStatus();
      }
    }
  },

  // Difundir estado local a todas las capas (BroadcastChannel, MQTT y /api/sync)
  broadcastLocalState(dbData) {
    const user = AuthService.getCurrentUser();
    const payload = {
      type: "SYNC_STATE",
      sender: user?.email || "anonymous",
      timestamp: new Date().toISOString(),
      progress: dbData.progress
    };

    // 1. BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {}
    }

    // 2. Nube MQTT
    if (this.mqttClient && this.mqttClient.connected) {
      try {
        if (user && user.role === "student") {
          // Publicación retenida para este estudiante
          this.mqttClient.publish(
            this.mqttTopicPrefix + "/student/" + user.id,
            JSON.stringify(payload),
            { qos: 1, retain: true }
          );
        }
        // Publicación al canal general
        this.mqttClient.publish(
          this.mqttTopicPrefix + "/sync_all",
          JSON.stringify(payload),
          { qos: 1 }
        );
      } catch (e) {
        console.warn("Fallo publicando en MQTT:", e);
      }
    }

    // 3. API Central del Servidor
    this.pushToServerApi(dbData.progress);

    this.lastSyncTimestamp = new Date();
    this.notifyStatus();
  },

  // Forzar sincronización manual inmediata
  async forceSyncNow() {
    this.status = "syncing";
    this.notifyStatus();

    const localData = Database.getData();
    this.broadcastLocalState(localData);
    await this.syncWithServerApi();

    this.status = "connected";
    this.lastSyncTimestamp = new Date();
    this.notifyStatus();

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("✓ Sincronización en tiempo real completada. Avances de alumnos actualizados.");
    }
  },

  onStatusChange(fn) {
    this.listeners.push(fn);
  },

  notifyStatus() {
    const info = {
      status: this.status,
      sources: this.connectedSources,
      lastSync: this.lastSyncTimestamp ? this.lastSyncTimestamp.toLocaleTimeString() : "Conectando..."
    };
    this.listeners.forEach(fn => fn(info));
  }
};
