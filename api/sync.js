/**
 * Vercel Serverless Function: API de Sincronización en Tiempo Real
 * Portal de Arquitectura de Computadoras - Universidad Aztlán
 */

// Memoria compartida en la instancia del runtime
let memoryDb = {
  version: 3,
  lastUpdated: new Date().toISOString(),
  progress: {}
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
