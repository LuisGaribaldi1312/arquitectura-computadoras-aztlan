/**
 * BASE DE DATOS Y GESTOR DE PERSISTENCIA LOCAL / TIEMPO REAL
 * Asignatura: Arquitectura de Computadoras - Universidad Aztlán
 * Profesor Titular: Ing. Luis Garibaldi
 */

const Database = {
  DB_KEY: "AZTLAN_ARQ_COMP_DB_v3",
  listeners: [],

  // Inicialización de la base de datos con usuarios y recuperación segura de avances
  init() {
    let raw = localStorage.getItem(this.DB_KEY);
    let state = null;
    if (!raw) {
      state = this.getDefaultState();
    } else {
      try {
        state = JSON.parse(raw);
      } catch (e) {
        state = this.getDefaultState();
      }
    }

    // Asegurar que existan todos los usuarios requeridos
    const defaultUsers = this.getDefaultUsers();
    defaultUsers.forEach(u => {
      if (!state.users.find(x => x.email === u.email)) {
        state.users.push(u);
      }
    });

    // FUSIONAR AVANCES EN VIVO DE LOS ALUMNOS (Garantiza ver inmediatamente los avances reales)
    const initialLive = this.getInitialLiveProgress();
    this.mergeProgressObjects(state.progress, initialLive);

    // RECUPERAR Y PRESERVAR AVANCES PREVIOS (v1, v2) SI EXISTEN (¡NUNCA BORRAR AVANCES!)
    try {
      ["AZTLAN_ARQ_COMP_DB_v2", "AZTLAN_ARQ_COMP_DB_v1"].forEach(oldKey => {
        const oldRaw = localStorage.getItem(oldKey);
        if (oldRaw) {
          const oldDb = JSON.parse(oldRaw);
          if (oldDb && oldDb.progress) {
            this.mergeProgressObjects(state.progress, oldDb.progress);
          }
        }
      });
    } catch (err) {
      console.warn("Aviso recuperación de versiones previas:", err);
    }

    this.save(state);
    return state;
  },

  // Fusión aditiva segura de progresos de alumnos (NUNCA elimina ni reduce avance)
  mergeProgressObjects(targetProgress, incomingProgress) {
    if (!incomingProgress) return false;
    let changed = false;

    Object.keys(incomingProgress).forEach(stId => {
      if (!targetProgress[stId]) {
        targetProgress[stId] = this.getDefaultStudentProgress(stId);
      }
      const target = targetProgress[stId];
      const incoming = incomingProgress[stId];
      if (!incoming) return;

      // 1. Lecturas (Unión estricta)
      if (Array.isArray(incoming.readTopics)) {
        incoming.readTopics.forEach(tId => {
          if (!target.readTopics.includes(tId)) {
            target.readTopics.push(tId);
            changed = true;
          }
        });
      }

      // 2. Ejercicios completados (Unión estricta)
      if (Array.isArray(incoming.completedExercises)) {
        incoming.completedExercises.forEach(exId => {
          if (!target.completedExercises.includes(exId)) {
            target.completedExercises.push(exId);
            changed = true;
          }
        });
      }

      // 3. Calificaciones (Siempre la puntuación más alta conseguida)
      if (incoming.scores && typeof incoming.scores === "object") {
        if (!target.scores) target.scores = {};
        Object.keys(incoming.scores).forEach(exId => {
          const inScore = Number(incoming.scores[exId]) || 0;
          const currScore = Number(target.scores[exId]) || 0;
          if (inScore > currScore) {
            target.scores[exId] = inScore;
            changed = true;
          }
        });
      }

      // 4. Intentos
      if (incoming.exerciseAttempts && typeof incoming.exerciseAttempts === "object") {
        if (!target.exerciseAttempts) target.exerciseAttempts = {};
        Object.keys(incoming.exerciseAttempts).forEach(exId => {
          target.exerciseAttempts[exId] = Math.max(target.exerciseAttempts[exId] || 0, Number(incoming.exerciseAttempts[exId]) || 0);
        });
      }

      // 5. Timestamps
      if (incoming.timestamps && typeof incoming.timestamps === "object") {
        target.timestamps = { ...(target.timestamps || {}), ...incoming.timestamps };
      }

      // 6. Desbloqueo manual
      if (Array.isArray(incoming.manuallyUnlockedTopics)) {
        if (!target.manuallyUnlockedTopics) target.manuallyUnlockedTopics = [];
        incoming.manuallyUnlockedTopics.forEach(u => {
          if (!target.manuallyUnlockedTopics.includes(u)) {
            target.manuallyUnlockedTopics.push(u);
            changed = true;
          }
        });
      }

      // 7. Última actividad
      if (incoming.lastActivity) {
        if (!target.lastActivity || new Date(incoming.lastActivity) > new Date(target.lastActivity)) {
          target.lastActivity = incoming.lastActivity;
        }
      }
    });

    return changed;
  },

  // Método público para incorporar actualizaciones entrantes de la red o nube
  mergeIncomingProgress(incomingProgress) {
    const data = this.getData();
    const changed = this.mergeProgressObjects(data.progress, incomingProgress);
    if (changed) {
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.DB_KEY, JSON.stringify(data));
      this.notify(data);
    }
    return changed;
  },

  getDefaultUsers() {
    return [
      {
        id: "usr_admin",
        name: "Ing. Luis Garibaldi",
        email: "luis.garibaldi@aztlan.edu.mx",
        password: "ProfGaribaldi#2026",
        role: "admin", // Super Administrador y Profesor
        title: "Profesor Titular y Super Administrador",
        avatar: "👨‍🏫"
      },
      {
        id: "usr_mario",
        name: "Mario Leyva",
        email: "mario.leyva@aztlan.edu.mx",
        password: "MarioLeyva#2026",
        role: "student",
        title: "Alumno de Ingeniería en Sistemas Computacionales",
        avatar: "👨‍🎓"
      },
      {
        id: "usr_isaias",
        name: "Isaías López",
        email: "isaias.lopez@aztlan.edu.mx",
        password: "IsaiasLopez#2026",
        role: "student",
        title: "Alumno de Ingeniería en Sistemas Computacionales",
        avatar: "👨‍💻"
      }
    ];
  },

  getDefaultStudentProgress(userId) {
    return {
      userId: userId,
      readTopics: [],
      completedExercises: [],
      scores: {},
      exerciseAttempts: {},
      timestamps: {},
      teacherFeedback: {},
      manualGrades: {
        investigacion: 0,
        reportes: 0,
        proyectos: 0,
        examenesParciales: 0,
        examenFinal: 0
      },
      lastActivity: new Date().toISOString()
    };
  },

  // Avances reales y activos de los estudiantes en la plataforma
  getInitialLiveProgress() {
    return {
      "usr_mario": {
        "userId": "usr_mario",
        "readTopics": [
          "u1_1_1",
          "u1_1_2",
          "u1_2_1",
          "u1_2_2",
          "u1_2_3",
          "u1_2_4"
        ],
        "completedExercises": [
          "sim_von_neumann_harvard",
          "sim_pipeline_hazards",
          "sim_multiprocessing_numa",
          "sim_cpu_datapath",
          "sim_cache_memory",
          "sim_bus_arbitration"
        ],
        "scores": {
          "sim_von_neumann_harvard": 100,
          "sim_pipeline_hazards": 100,
          "sim_multiprocessing_numa": 100,
          "sim_cpu_datapath": 100,
          "sim_cache_memory": 100,
          "sim_bus_arbitration": 100
        },
        "exerciseAttempts": {
          "sim_von_neumann_harvard": 1,
          "sim_pipeline_hazards": 2,
          "sim_multiprocessing_numa": 1,
          "sim_cpu_datapath": 1,
          "sim_cache_memory": 2,
          "sim_bus_arbitration": 2
        },
        "timestamps": {
          "sim_von_neumann_harvard": "2026-11-21T14:30:00.000Z",
          "sim_pipeline_hazards": "2026-11-21T14:45:00.000Z",
          "sim_multiprocessing_numa": "2026-11-21T15:00:00.000Z",
          "sim_cpu_datapath": "2026-11-21T15:10:00.000Z",
          "sim_cache_memory": "2026-11-21T15:20:00.000Z",
          "sim_bus_arbitration": "2026-11-21T15:35:00.000Z"
        },
        "teacherFeedback": {},
        "manualGrades": {
          "investigacion": 6,
          "reportes": 3,
          "proyectos": 6,
          "examenesParciales": 6,
          "examenFinal": 0
        },
        "generalFeedback": "Excelente avance continuo de Mario Leyva: 6 temas completados al 100% hasta el laboratorio de Buses Daisy-Chain.",
        "lastActivity": new Date().toISOString()
      },
      "usr_isaias": {
        "userId": "usr_isaias",
        "readTopics": [
          "u1_1_1",
          "u1_1_2",
          "u1_2_1"
        ],
        "completedExercises": [
          "sim_von_neumann_harvard",
          "sim_pipeline_hazards"
        ],
        "scores": {
          "sim_von_neumann_harvard": 100,
          "sim_pipeline_hazards": 100,
          "sim_multiprocessing_numa": 85
        },
        "exerciseAttempts": {
          "sim_von_neumann_harvard": 1,
          "sim_pipeline_hazards": 2,
          "sim_multiprocessing_numa": 1
        },
        "timestamps": {
          "sim_von_neumann_harvard": "2026-11-21T14:15:00.000Z",
          "sim_pipeline_hazards": "2026-11-21T14:35:00.000Z",
          "sim_multiprocessing_numa": "2026-11-21T15:10:00.000Z"
        },
        "teacherFeedback": {},
        "manualGrades": {
          "investigacion": 2,
          "reportes": 1,
          "proyectos": 2,
          "examenesParciales": 2,
          "examenFinal": 0
        },
        "generalFeedback": "Buen ritmo de trabajo, completando temas de la Unidad 1.",
        "lastActivity": new Date().toISOString()
      }
    };
  },

  getDefaultState() {
    const users = this.getDefaultUsers();
    const studentsProgress = this.getInitialLiveProgress();

    return {
      version: 3,
      lastUpdated: new Date().toISOString(),
      users: users,
      progress: studentsProgress,
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          userId: "usr_mario",
          action: "EXERCISE_COMPLETE",
          topicId: "u1_2_4",
          description: "Mario Leyva completó al 100% el tema 1.2.4 y acreditó con 100 pts el Laboratorio de Buses Daisy-Chain."
        }
      ]
    };
  },

  getData() {
    const raw = localStorage.getItem(this.DB_KEY);
    if (!raw) return this.init();
    try {
      return JSON.parse(raw);
    } catch {
      return this.init();
    }
  },

  save(data) {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.DB_KEY, JSON.stringify(data));
    this.notify(data);
  },

  // Registrar callback para cambios en tiempo real
  subscribe(fn) {
    this.listeners.push(fn);
  },

  notify(data) {
    this.listeners.forEach(fn => fn(data));
  },

  // Verificación de acreditación del 100% de un tema (Lectura + Laboratorio Práctico)
  isTopicCompleted(userId, topicId) {
    const prog = this.getStudentProgress(userId);
    const topic = CURRICULUM_DATA.find(t => t.id === topicId);
    if (!topic) return false;

    const isRead = prog.readTopics?.includes(topicId) || false;
    const isExDone = (prog.completedExercises?.includes(topic.exerciseId) || false) && ((prog.scores?.[topic.exerciseId] || 0) >= 100);

    return isRead && isExDone;
  },

  // Verificación de desbloqueo secuencial (Solo desbloquea si el tema anterior está al 100%)
  isTopicUnlocked(userId, topicId) {
    const user = AuthService.getCurrentUser();
    // El Super Administrador (Profesor) puede acceder e inspeccionar cualquier tema
    if (user && user.role === "admin") return true;

    const topicIndex = CURRICULUM_DATA.findIndex(t => t.id === topicId);
    if (topicIndex === -1) return false;

    // El primer tema (1.1.1) siempre está desbloqueado para iniciar
    if (topicIndex === 0) return true;

    const prog = this.getStudentProgress(userId);
    if (prog.manuallyUnlockedTopics?.includes('all') || prog.manuallyUnlockedTopics?.includes(topicId)) return true;

    // Un tema se desbloquea únicamente si el tema inmediatamente anterior está 100% completado
    const prevTopic = CURRICULUM_DATA[topicIndex - 1];
    return this.isTopicCompleted(userId, prevTopic.id);
  },

  // Obtener estado detallado del tema: 'completed', 'unlocked', 'locked'
  getTopicStatus(userId, topicId) {
    if (this.isTopicCompleted(userId, topicId)) return "completed";
    if (this.isTopicUnlocked(userId, topicId)) return "unlocked";
    return "locked";
  },

  // Obtener el siguiente tema en la secuencia curricular
  getNextTopic(topicId) {
    const idx = CURRICULUM_DATA.findIndex(t => t.id === topicId);
    if (idx >= 0 && idx < CURRICULUM_DATA.length - 1) {
      return CURRICULUM_DATA[idx + 1];
    }
    return null;
  },

  // Desbloqueo docente manual
  setTopicManualUnlock(studentId, topicId, status = true) {
    const data = this.getData();
    if (!data.progress[studentId]) {
      data.progress[studentId] = this.getDefaultStudentProgress(studentId);
    }
    const st = data.progress[studentId];
    if (!st.manuallyUnlockedTopics) st.manuallyUnlockedTopics = [];
    if (topicId === 'all') {
      st.manuallyUnlockedTopics = status ? ['all'] : [];
    } else {
      if (status && !st.manuallyUnlockedTopics.includes(topicId)) {
        st.manuallyUnlockedTopics.push(topicId);
      } else if (!status) {
        st.manuallyUnlockedTopics = st.manuallyUnlockedTopics.filter(t => t !== topicId && t !== 'all');
      }
    }
    data.auditLog.unshift({
      timestamp: new Date().toISOString(),
      userId: 'usr_garibaldi',
      action: status ? 'MANUAL_UNLOCK' : 'MANUAL_LOCK',
      topicId: topicId,
      description: "El Super Administrador Ing. Luis Garibaldi actualizó desbloqueo del tema " + topicId + " para el alumno."
    });
    this.save(data);
  },

  // Reiniciar avance a cero de un estudiante específico (Mario Leyva o Isaías López)
  resetStudentProgress(userId) {
    const data = this.getData();
    data.progress[userId] = this.getDefaultStudentProgress(userId);
    const user = data.users.find(u => u.id === userId);
    const studentName = user ? user.name : userId;
    
    data.auditLog.unshift({
      timestamp: new Date().toISOString(),
      userId: "usr_garibaldi",
      action: "RESET_STUDENT_PROGRESS",
      description: "El Super Administrador Ing. Luis Garibaldi reinició al 0% todo el progreso del alumno " + studentName + "."
    });
    this.save(data);
    if (typeof P2PSyncEngine !== 'undefined') {
      P2PSyncEngine.broadcastLocalState(data);
    }
  },

  // Reiniciar avance a cero de todos los alumnos de la plataforma
  resetAllStudentsProgress() {
    const data = this.getData();
    data.users.filter(u => u.role === "student").forEach(st => {
      data.progress[st.id] = this.getDefaultStudentProgress(st.id);
    });
    
    data.auditLog.unshift({
      timestamp: new Date().toISOString(),
      userId: "usr_garibaldi",
      action: "RESET_ALL_STUDENTS",
      description: "El Super Administrador Ing. Luis Garibaldi reinició al 0% el avance de todos los estudiantes para inicio de ciclo."
    });
    this.save(data);
    if (typeof P2PSyncEngine !== 'undefined') {
      P2PSyncEngine.broadcastLocalState(data);
    }
  },

  // Obtener progreso individual del estudiante
  getStudentProgress(userId) {
    const data = this.getData();
    if (!data.progress[userId]) {
      data.progress[userId] = this.getDefaultStudentProgress(userId);
      this.save(data);
    }
    return data.progress[userId];
  },

  // Registrar lectura de tema
  markTopicAsRead(userId, topicId) {
    const data = this.getData();
    if (!data.progress[userId]) {
      data.progress[userId] = this.getDefaultStudentProgress(userId);
    }
    const st = data.progress[userId];
    if (!st.readTopics.includes(topicId)) {
      st.readTopics.push(topicId);
      st.lastActivity = new Date().toISOString();
      data.auditLog.unshift({
        timestamp: new Date().toISOString(),
        userId: userId,
        action: "READ_TOPIC",
        topicId: topicId,
        description: `El estudiante leyó y completó el tema ${topicId}.`
      });
      this.save(data);
    }
  },

  // Registrar calificación de ejercicio
  recordExerciseScore(userId, exerciseId, score) {
    const data = this.getData();
    if (!data.progress[userId]) {
      data.progress[userId] = this.getDefaultStudentProgress(userId);
    }
    const st = data.progress[userId];
    st.scores[exerciseId] = Math.max(st.scores[exerciseId] || 0, score);
    st.exerciseAttempts[exerciseId] = (st.exerciseAttempts[exerciseId] || 0) + 1;
    st.timestamps[exerciseId] = new Date().toISOString();
    st.lastActivity = new Date().toISOString();

    if (!st.completedExercises.includes(exerciseId)) {
      st.completedExercises.push(exerciseId);
    }

    data.auditLog.unshift({
      timestamp: new Date().toISOString(),
      userId: userId,
      action: "COMPLETE_EXERCISE",
      exerciseId: exerciseId,
      score: score,
      description: `Completó el ejercicio ${exerciseId} con ${score}/100 pts.`
    });

    this.save(data);
  },

  // Guardar feedback del profesor o notas manuales
  updateTeacherFeedback(studentId, feedbackText, manualGrades) {
    const data = this.getData();
    if (!data.progress[studentId]) {
      data.progress[studentId] = this.getDefaultStudentProgress(studentId);
    }
    const st = data.progress[studentId];
    if (feedbackText !== undefined) {
      st.generalFeedback = feedbackText;
    }
    if (manualGrades) {
      st.manualGrades = { ...st.manualGrades, ...manualGrades };
    }
    data.auditLog.unshift({
      timestamp: new Date().toISOString(),
      action: "TEACHER_UPDATE",
      studentId: studentId,
      description: "El Profesor Luis Garibaldi actualizó calificaciones y observaciones."
    });
    this.save(data);
  },

  // Cálculo del porcentaje global de avance para un estudiante
  calculateGlobalProgress(studentProgress) {
    if (!studentProgress) return { totalPercent: 0, readPercent: 0, exPercent: 0, scoreAverage: 0 };
    const totalTopics = CURRICULUM_DATA.length; // 20 subtemas en total
    const readCount = studentProgress.readTopics ? studentProgress.readTopics.length : 0;
    const completedExCount = studentProgress.completedExercises ? studentProgress.completedExercises.length : 0;

    const readPercent = Math.min(100, Math.round((readCount / totalTopics) * 100));
    const exPercent = Math.min(100, Math.round((completedExCount / totalTopics) * 100));

    // Ponderación: 35% lectura de teoría, 65% solución de ejercicios prácticos
    const totalPercent = Math.min(100, Math.round((readPercent * 0.35) + (exPercent * 0.65)));

    // Promedio de puntuación en ejercicios completados
    const scores = Object.values(studentProgress.scores || {});
    const scoreSum = scores.reduce((acc, curr) => acc + curr, 0);
    const scoreAverage = scores.length > 0 ? Math.round(scoreSum / scores.length) : 0;

    // Cálculo según la Rúbrica Oficial de Universidad Aztlán (100% total)
    // - Investigación: 20%
    // - Reportes de lectura: 10%
    // - Proyectos: 20%
    // - Exámenes parciales: 20%
    // - Examen final: 30%
    const gradeReportes = (readPercent / 100) * 10;
    const gradeInvestigacion = (exPercent / 100) * 20;
    const gradeProyectos = (studentProgress.manualGrades?.proyectos || (exPercent >= 70 ? 20 : Math.round(exPercent * 0.2)));
    const gradeParciales = (studentProgress.manualGrades?.examenesParciales || (scoreAverage >= 70 ? 18 : 12));
    const gradeFinal = (studentProgress.manualGrades?.examenFinal || (totalPercent >= 80 ? 28 : Math.round(totalPercent * 0.28)));

    const finalRubricGrade = Math.min(100, Math.round(
      gradeReportes + gradeInvestigacion + gradeProyectos + gradeParciales + gradeFinal
    ));

    return {
      totalPercent,
      readPercent,
      readCount,
      exPercent,
      completedExCount,
      totalTopics,
      scoreAverage,
      finalRubricGrade,
      rubricBreakdown: {
        reportes: Math.round(gradeReportes),
        investigacion: Math.round(gradeInvestigacion),
        proyectos: gradeProyectos,
        parciales: gradeParciales,
        final: gradeFinal
      }
    };
  },

  // Exportar toda la base de datos a archivo JSON
  exportToJson() {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  },

  // Importar y fusionar base de datos desde JSON
  importFromJson(jsonString) {
    try {
      const incoming = JSON.parse(jsonString);
      if (!incoming.progress || !incoming.users) {
        throw new Error("Estructura JSON inválida para la base de datos del curso.");
      }
      this.save(incoming);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
