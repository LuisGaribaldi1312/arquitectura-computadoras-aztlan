/**
 * Vercel Serverless Function: API de Sincronización en Tiempo Real
 * Portal de Arquitectura de Computadoras - Universidad Aztlán
 */

const SEED_PROGRESS = {
  "usr_mario": {
    "userId": "usr_mario",
    "readTopics": ["u1_1_1", "u1_1_2", "u1_2_1", "u1_2_2", "u1_2_3", "u1_2_4"],
    "completedExercises": ["sim_von_neumann_harvard", "sim_pipeline_hazards", "sim_multiprocessing_numa", "sim_cpu_datapath", "sim_cache_memory", "sim_bus_arbitration"],
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
    "manualGrades": { "investigacion": 6, "reportes": 3, "proyectos": 6, "examenesParciales": 6, "examenFinal": 0 },
    "generalFeedback": "Excelente avance continuo de Mario Leyva: 6 temas completados al 100% hasta el laboratorio de Buses Daisy-Chain.",
    "lastActivity": "2026-11-21T15:35:00.000Z"
  },
  "usr_isaias": {
    "userId": "usr_isaias",
    "readTopics": ["u1_1_1", "u1_1_2", "u1_2_1"],
    "completedExercises": ["sim_von_neumann_harvard", "sim_pipeline_hazards"],
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
    "manualGrades": { "investigacion": 2, "reportes": 1, "proyectos": 2, "examenesParciales": 2, "examenFinal": 0 },
    "generalFeedback": "Buen ritmo de trabajo, completando temas de la Unidad 1.",
    "lastActivity": "2026-11-21T15:10:00.000Z"
  }
};

let memoryDb = {
  version: 3,
  lastUpdated: new Date().toISOString(),
  progress: { ...SEED_PROGRESS }
};

function mergeProgress(currentProgress, incomingProgress) {
  if (!incomingProgress) return currentProgress;
  const merged = { ...currentProgress };

  for (const [stId, stData] of Object.entries(incomingProgress)) {
    if (!merged[stId]) {
      merged[stId] = {
        userId: stId,
        readTopics: [],
        completedExercises: [],
        scores: {},
        exerciseAttempts: {},
        timestamps: {},
        teacherFeedback: {},
        manualGrades: { investigacion: 0, reportes: 0, proyectos: 0, examenesParciales: 0, examenFinal: 0 },
        lastActivity: null
      };
    }
    const target = merged[stId];

    // 1. Lecturas
    const incomingReads = stData.readTopics || [];
    incomingReads.forEach(t => {
      if (!target.readTopics.includes(t)) target.readTopics.push(t);
    });

    // 2. Ejercicios completados
    const incomingEx = stData.completedExercises || [];
    incomingEx.forEach(ex => {
      if (!target.completedExercises.includes(ex)) target.completedExercises.push(ex);
    });

    // 3. Puntuaciones máximas
    if (stData.scores) {
      if (!target.scores) target.scores = {};
      for (const [exId, score] of Object.entries(stData.scores)) {
        target.scores[exId] = Math.max(target.scores[exId] || 0, Number(score) || 0);
      }
    }

    // 4. Intentos
    if (stData.exerciseAttempts) {
      if (!target.exerciseAttempts) target.exerciseAttempts = {};
      for (const [exId, att] of Object.entries(stData.exerciseAttempts)) {
        target.exerciseAttempts[exId] = Math.max(target.exerciseAttempts[exId] || 0, Number(att) || 0);
      }
    }

    // 5. Timestamps
    if (stData.timestamps) {
      target.timestamps = { ...(target.timestamps || {}), ...stData.timestamps };
    }

    // 6. Desbloqueo manual
    if (stData.manuallyUnlockedTopics) {
      if (!target.manuallyUnlockedTopics) target.manuallyUnlockedTopics = [];
      stData.manuallyUnlockedTopics.forEach(u => {
        if (!target.manuallyUnlockedTopics.includes(u)) target.manuallyUnlockedTopics.push(u);
      });
    }

    if (stData.lastActivity) {
      if (!target.lastActivity || new Date(stData.lastActivity) > new Date(target.lastActivity)) {
        target.lastActivity = stData.lastActivity;
      }
    }
  }

  return merged;
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      progress: memoryDb.progress,
      lastUpdated: memoryDb.lastUpdated
    });
  }

  if (req.method === 'POST') {
    try {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      let incomingProg = payload.progress;
      if (!incomingProg && payload.studentId && payload.studentProgress) {
        incomingProg = { [payload.studentId]: payload.studentProgress };
      }

      memoryDb.progress = mergeProgress(memoryDb.progress, incomingProg);
      memoryDb.lastUpdated = new Date().toISOString();

      return res.status(200).json({
        success: true,
        progress: memoryDb.progress,
        lastUpdated: memoryDb.lastUpdated
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  res.status(405).json({ error: 'Method Not Allowed' });
};
