/**
 * MOTOR DE SINCRONIZACIÓN Y REPLICACIÓN P2P (PEER-TO-PEER) EN TIEMPO REAL
 * Asignatura: Arquitectura de Computadoras - Universidad Aztlán
 * Profesor Titular: Ing. Luis Garibaldi
 */

const P2PSyncEngine = {
  channelName: "aztlan_arq_p2p_channel",
  broadcastChannel: null,
  peerConnection: null,
  dataChannel: null,
  status: "idle", // 'idle' | 'connected' | 'syncing' | 'error'
  peersCount: 1,
  lastSyncTimestamp: null,
  listeners: [],

  init() {
    // 1. Inicialización de sincronización por BroadcastChannel (para pestañas/ventanas concurrentes)
    try {
      if (typeof BroadcastChannel !== "undefined") {
        this.broadcastChannel = new BroadcastChannel(this.channelName);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingP2PMessage(event.data);
        };
      }
    } catch (e) {
      console.warn("BroadcastChannel no soportado en este entorno", e);
    }

    // Escuchar cambios locales de la base de datos para difundirlos por P2P
    Database.subscribe((updatedDb) => {
      this.broadcastLocalState(updatedDb);
    });

    this.lastSyncTimestamp = new Date();
    this.status = "connected";
    this.notifyStatus();
  },

  // Manejo de mensajes P2P recibidos
  handleIncomingP2PMessage(msg) {
    if (!msg || !msg.type) return;

    if (msg.type === "SYNC_STATE") {
      console.log("⚡ Mensaje P2P recibido: Sincronización de estado", msg.sender);
      const local = Database.getData();
      // Fusionar progresos si la marca de tiempo entrante es válida
      if (msg.payload && msg.payload.progress) {
        let changed = false;
        Object.keys(msg.payload.progress).forEach((studentId) => {
          const remoteSt = msg.payload.progress[studentId];
          const localSt = local.progress[studentId] || Database.getDefaultStudentProgress(studentId);

          // Combinar lecturas
          remoteSt.readTopics?.forEach((t) => {
            if (!localSt.readTopics.includes(t)) {
              localSt.readTopics.push(t);
              changed = true;
            }
          });

          // Combinar ejercicios completados
          remoteSt.completedExercises?.forEach((ex) => {
            if (!localSt.completedExercises.includes(ex)) {
              localSt.completedExercises.push(ex);
              changed = true;
            }
          });

          // Combinar calificaciones
          if (remoteSt.scores) {
            Object.keys(remoteSt.scores).forEach((exId) => {
              const rScore = remoteSt.scores[exId];
              const lScore = localSt.scores[exId] || 0;
              if (rScore > lScore) {
                localSt.scores[exId] = rScore;
                changed = true;
              }
            });
          }

          // Combinar observaciones del profesor
          if (remoteSt.generalFeedback) {
            localSt.generalFeedback = remoteSt.generalFeedback;
          }
          if (remoteSt.manualGrades) {
            localSt.manualGrades = { ...localSt.manualGrades, ...remoteSt.manualGrades };
          }
        });

        if (changed) {
          local.lastUpdated = new Date().toISOString();
          localStorage.setItem(Database.DB_KEY, JSON.stringify(local));
          Database.notify(local);
        }
      }

      this.lastSyncTimestamp = new Date();
      this.status = "connected";
      this.notifyStatus();
    } else if (msg.type === "PEER_PING") {
      this.peersCount++;
      this.notifyStatus();
    }
  },

  // Difundir estado local a la red P2P
  broadcastLocalState(dbData) {
    const msg = {
      type: "SYNC_STATE",
      sender: AuthService.getCurrentUser()?.email || "anonymous",
      timestamp: new Date().toISOString(),
      payload: dbData
    };

    // Vía BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch (e) {
        console.warn("Fallo al difundir por BroadcastChannel", e);
      }
    }

    // Vía WebRTC DataChannel si está activo
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      try {
        this.dataChannel.send(JSON.stringify(msg));
      } catch (e) {
        console.warn("Fallo al enviar por WebRTC DataChannel", e);
      }
    }

    this.lastSyncTimestamp = new Date();
    this.notifyStatus();
  },

  // Crear oferta WebRTC P2P (Rol: Anfitrión / Profesor)
  async createWebRtcOffer() {
    const config = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    };
    this.peerConnection = new RTCPeerConnection(config);

    this.dataChannel = this.peerConnection.createDataChannel("aztlan_arq_sync");
    this.setupDataChannelEvents();

    return new Promise((resolve, reject) => {
      this.peerConnection.onicecandidate = (event) => {
        if (!event.candidate) {
          // Candidatos ICE completos: retornar SDP comprimido en Base64
          const offerStr = JSON.stringify(this.peerConnection.localDescription);
          resolve(btoa(encodeURIComponent(offerStr)));
        }
      };

      this.peerConnection.createOffer()
        .then(offer => this.peerConnection.setLocalDescription(offer))
        .catch(err => reject(err));
    });
  },

  // Aceptar oferta WebRTC y generar respuesta (Rol: Alumno)
  async acceptWebRtcOffer(offerBase64) {
    try {
      const offerJson = decodeURIComponent(atob(offerBase64));
      const offer = JSON.parse(offerJson);

      const config = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      };
      this.peerConnection = new RTCPeerConnection(config);

      this.peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.setupDataChannelEvents();
      };

      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      return new Promise((resolve) => {
        this.peerConnection.onicecandidate = (event) => {
          if (!event.candidate) {
            const answerStr = JSON.stringify(this.peerConnection.localDescription);
            resolve(btoa(encodeURIComponent(answerStr)));
          }
        };
      });
    } catch (e) {
      throw new Error("Código de oferta P2P inválido: " + e.message);
    }
  },

  // Finalizar enlace con la respuesta WebRTC (Rol: Profesor)
  async finalizeWebRtcConnection(answerBase64) {
    try {
      const answerJson = decodeURIComponent(atob(answerBase64));
      const answer = JSON.parse(answerJson);
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      return true;
    } catch (e) {
      throw new Error("Código de respuesta P2P inválido: " + e.message);
    }
  },

  setupDataChannelEvents() {
    if (!this.dataChannel) return;
    this.dataChannel.onopen = () => {
      console.log("🔌 Canal de Datos WebRTC P2P Conectado con Éxito");
      this.status = "connected";
      this.peersCount = 2;
      this.notifyStatus();
      // Enviar de inmediato el estado actual al conectarse
      this.broadcastLocalState(Database.getData());
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        this.handleIncomingP2PMessage(msg);
      } catch (e) {
        console.error("Error al procesar mensaje WebRTC", e);
      }
    };

    this.dataChannel.onclose = () => {
      this.status = "idle";
      this.notifyStatus();
    };
  },

  onStatusChange(fn) {
    this.listeners.push(fn);
  },

  notifyStatus() {
    const info = {
      status: this.status,
      peersCount: this.peersCount,
      lastSync: this.lastSyncTimestamp ? this.lastSyncTimestamp.toLocaleTimeString() : "--"
    };
    this.listeners.forEach(fn => fn(info));
  }
};
