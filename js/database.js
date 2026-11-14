/**
 * BASE DE DATOS Y GESTOR DE PERSISTENCIA LOCAL / TIEMPO REAL
 * Asignatura: Arquitectura de Computadoras - Universidad Aztlán
 * Profesor Titular: Ing. Luis Garibaldi
 */

const Database = {
  DB_KEY: "AZTLAN_ARQ_COMP_DB_v2",
  listeners: [],

  // Inicialización de la base de datos con usuarios y datos predeterminados
  init() {
    let raw = localStorage.getItem(this.DB_KEY);
    if (!raw) {
      const defaultState = this.getDefaultState();
      this.save(defaultState);
      return defaultState;
    }
    try {
      const parsed = JSON.parse(raw);
      // Asegurar que existan todos los usuarios requeridos
      const defaultUsers = this.getDefaultUsers();
      defaultUsers.forEach(u => {
        if (!parsed.users.find(x => x.email === u.email)) {
          parsed.users.push(u);
        }
      });
      this.save(parsed);
      return parsed;
    } catch (e) {
      console.error("Error al parsear base de datos, restaurando predeterminada", e);
      const defaultState = this.getDefaultState();
      this.save(defaultState);
      return defaultState;
    }
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

  getDefaultState() {
    const users = this.getDefaultUsers();
    const studentsProgress = {
      "usr_mario": this.getDefaultStudentProgress("usr_mario"),
      "usr_isaias": this.getDefaultStudentProgress("usr_isaias")
    };

    // Pre-cargar algo de progreso realista en Mario Leyva para que el profesor vea datos al entrar
    studentsProgress["usr_mario"].readTopics = ["u1_1_1", "u1_1_2", "u1_2_1"];
    studentsProgress["usr_mario"].completedExercises = ["sim_von_neumann_harvard", "sim_pipeline_hazards"];
    studentsProgress["usr_mario"].scores = {
      "sim_von_neumann_harvard": 100,
      "sim_pipeline_hazards": 100
    };
    studentsProgress["usr_mario"].exerciseAttempts = {
      "sim_von_neumann_harvard": 1,
      "sim_pipeline_hazards": 2
    };

    return {
      version: 2,
      lastUpdated: new Date().toISOString(),
      users: users,
      progress: studentsProgress,
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          action: "INITIALIZE_PLATFORM",
          description: "Plataforma de Arquitectura de Computadoras desplegada para Universidad Aztlán."
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

  // Obtener progreso de un estudiante
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
