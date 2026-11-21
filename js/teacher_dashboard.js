/**
 * PANEL DE CONTROL DOCENTE Y SUPER ADMINISTRADOR
 * Asignatura: Arquitectura de Computadoras - Universidad Aztlán
 * Profesor Titular: Ing. Luis Garibaldi
 */

const TeacherDashboard = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = Database.getData();
    const students = data.users.filter(u => u.role === "student");

    // Calcular estadísticas globales
    let sumProgress = 0;
    let sumExercises = 0;
    const studentCardsHtml = students.map(student => {
      const prog = Database.getStudentProgress(student.id);
      const metrics = Database.calculateGlobalProgress(prog);
      sumProgress += metrics.totalPercent;
      sumExercises += metrics.completedExCount;

      // Calcular estado de temas secuenciales
      let completedTopicsCount = 0;
      let activeCurrentTopic = null;
      CURRICULUM_DATA.forEach(t => {
        const isComp = Database.isTopicCompleted(student.id, t.id);
        if (isComp) {
          completedTopicsCount++;
        } else if (!activeCurrentTopic && Database.isTopicUnlocked(student.id, t.id)) {
          activeCurrentTopic = t;
        }
      });
      if (!activeCurrentTopic && completedTopicsCount === CURRICULUM_DATA.length) {
        activeCurrentTopic = { code: "FINAL", title: "Todos los temas completados" };
      } else if (!activeCurrentTopic) {
        activeCurrentTopic = CURRICULUM_DATA[0];
      }

      const isAllUnlocked = prog.manuallyUnlockedTopics?.includes("all");

      return `
        <div class="student-card" id="card_${student.id}">
          <div class="student-card-header">
            <div class="student-avatar-badge">${student.avatar}</div>
            <div class="student-info-main">
              <h4>${student.name}</h4>
              <span class="student-email">${student.email}</span>
              <span class="student-role-tag">${student.title}</span>
            </div>
            <div class="student-grade-badge">
              <span class="lbl-grade">Nota Rúbrica</span>
              <strong class="grade-number">${metrics.finalRubricGrade} / 100</strong>
            </div>
          </div>

          <!-- Medidor Principal de Avance Global -->
          <div class="progress-section">
            <div class="progress-labels">
              <span>Avance Global de la Plataforma:</span>
              <strong class="text-primary">${metrics.totalPercent}%</strong>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${metrics.totalPercent}%;"></div>
            </div>
          </div>

          <!-- Métricas Detalladas -->
          <div class="student-kpis-grid">
            <div class="kpi-mini">
              <span class="kpi-label">Temas 100% Completados:</span>
              <strong class="text-success">${completedTopicsCount} de 20 temas</strong>
            </div>
            <div class="kpi-mini">
              <span class="kpi-label">Tema en Curso Actual:</span>
              <strong class="text-primary">${activeCurrentTopic ? activeCurrentTopic.code : 'U1.1.1'}</strong>
            </div>
            <div class="kpi-mini">
              <span class="kpi-label">Estado de Bloqueo:</span>
              <span>${isAllUnlocked ? '<span class="badge badge-warning">🔓 Desbloqueo Total Manual</span>' : '<span class="badge badge-info">🔒 Secuencial Estricto</span>'}</span>
            </div>
            <div class="kpi-mini">
              <span class="kpi-label">Promedio Ejercicios:</span>
              <strong class="text-success">${metrics.scoreAverage} pts</strong>
            </div>
            <div class="kpi-mini">
              <span class="kpi-label">Última Actividad:</span>
              <span>${prog.lastActivity ? new Date(prog.lastActivity).toLocaleDateString() : 'Sin actividad'}</span>
            </div>
          </div>

          <!-- Desglose por Rúbrica Universidad Aztlán -->
          <div class="rubric-summary-box">
            <h6>Desglose Rúbrica Oficial Universidad Aztlán (100%):</h6>
            <div class="rubric-pills-row">
              <span class="r-pill">Investigación (20%): <strong>${metrics.rubricBreakdown.investigacion}/20</strong></span>
              <span class="r-pill">Reportes Lectura (10%): <strong>${metrics.rubricBreakdown.reportes}/10</strong></span>
              <span class="r-pill">Proyectos (20%): <strong>${metrics.rubricBreakdown.proyectos}/20</strong></span>
              <span class="r-pill">Parciales (20%): <strong>${metrics.rubricBreakdown.parciales}/20</strong></span>
              <span class="r-pill">Examen Final (30%): <strong>${metrics.rubricBreakdown.final}/30</strong></span>
            </div>
          </div>

          <!-- Observaciones / Feedback del Profesor -->
          <div class="teacher-feedback-preview">
            <strong>Observación Docente:</strong>
            <p class="feedback-text">${prog.generalFeedback || 'Sin observaciones registradas por el docente.'}</p>
          </div>

          <div class="student-card-actions">
            <button class="btn btn-primary btn-sm btn-eval-student" data-id="${student.id}">
              <i class="icon">✏️</i> Evaluar y Calificar Alumno
            </button>
            <button class="btn btn-secondary btn-sm btn-view-details" data-id="${student.id}">
              <i class="icon">🔍</i> Bitácora de 20 Temas y Bloqueos
            </button>
            <button class="btn ${isAllUnlocked ? 'btn-outline-secondary' : 'btn-outline-warning'} btn-sm btn-toggle-unlock-all" data-id="${student.id}">
              <i class="icon">${isAllUnlocked ? '🔒' : '🔓'}</i> ${isAllUnlocked ? 'Restablecer Bloqueo' : 'Desbloquear Todo'}
            </button>
            <button class="btn btn-outline-danger btn-sm btn-reset-student" data-id="${student.id}" title="Reiniciar a 0% el avance de este alumno">
              <i class="icon">🔄</i> Reiniciar a 0%
            </button>
          </div>
        </div>
      `;
    }).join("");

    const avgProgress = students.length > 0 ? Math.round(sumProgress / students.length) : 0;

    container.innerHTML = `
      <div class="teacher-dashboard-wrapper">
        <!-- Banner Institucional -->
        <div class="teacher-welcome-banner">
          <div class="banner-text">
            <h2>Panel de Control Docente & Calificaciones</h2>
            <p><strong>Universidad Aztlán</strong> &bull; Arquitectura de Computadoras (Clave 636) &bull; Profesor Titular: <strong>Ing. Luis Garibaldi</strong></p>
          </div>
          <div class="banner-quick-actions">
            <button class="btn btn-outline-light" id="btn_export_grades_pdf">
              <i class="icon">🖨️</i> Generar Acta Oficial de Calificaciones
            </button>
            <button class="btn btn-outline-success" id="btn_force_sync_now" title="Sincronizar de inmediato con la nube y los alumnos">
              <i class="icon">⚡</i> Sincronizar en Vivo Ahora
            </button>
            <button class="btn btn-outline-light" id="btn_p2p_room_modal">
              <i class="icon">🌐</i> Estado de Red y Nube
            </button>
            <button class="btn btn-outline-danger" id="btn_reset_all_students" title="Reiniciar el avance de todos los alumnos a 0%">
              <i class="icon">🔄</i> Reiniciar Avances a 0%
            </button>
          </div>
        </div>

        <!-- Tarjetas de Resumen General -->
        <div class="dashboard-kpis-bar">
          <div class="kpi-card-box">
            <div class="kpi-icon">👥</div>
            <div class="kpi-data">
              <span class="kpi-num">${students.length}</span>
              <span class="kpi-desc">Alumnos Matriculados</span>
            </div>
          </div>
          <div class="kpi-card-box">
            <div class="kpi-icon">📊</div>
            <div class="kpi-data">
              <span class="kpi-num">${avgProgress}%</span>
              <span class="kpi-desc">Avance Promedio General</span>
            </div>
          </div>
          <div class="kpi-card-box">
            <div class="kpi-icon">✅</div>
            <div class="kpi-data">
              <span class="kpi-num">${sumExercises}</span>
              <span class="kpi-desc">Ejercicios Completados</span>
            </div>
          </div>
          <div class="kpi-card-box">
            <div class="kpi-icon">⚡</div>
            <div class="kpi-data">
              <span class="kpi-num text-success">P2P Activo</span>
              <span class="kpi-desc">Sincronización en Tiempo Real</span>
            </div>
          </div>
        </div>

        <!-- Lista de Estudiantes -->
        <div class="students-section-header">
          <h3>Seguimiento y Evaluación Individual de Alumnos</h3>
          <span class="badge badge-info">Actualización automática por base de datos y replicación P2P</span>
        </div>
        <div class="students-cards-container">
          ${studentCardsHtml}
        </div>

        <!-- Bitácora de Auditoría en Tiempo Real -->
        <div class="audit-log-section">
          <h4>Bitácora de Eventos y Actividad en Vivo:</h4>
          <div class="audit-list-box" id="audit_log_list">
            ${data.auditLog.slice(0, 8).map(item => `
              <div class="audit-item">
                <span class="audit-time">${new Date(item.timestamp).toLocaleTimeString()}</span>
                <span class="audit-desc">${item.description}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Modal de Calificación y Ajuste Manual -->
      <div id="eval_modal" class="modal-backdrop" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-header">
            <h4 id="eval_modal_title">Calificar Alumno</h4>
            <button class="modal-close-btn" id="btn_close_eval_modal">&times;</button>
          </div>
          <div class="modal-body" id="eval_modal_body">
            <!-- Formulario dinámico inyectado -->
          </div>
        </div>
      </div>
    `;

    // Vincular botones de evaluación individual
    container.querySelectorAll(".btn-eval-student").forEach(btn => {
      btn.addEventListener("click", () => {
        const studentId = btn.dataset.id;
        TeacherDashboard.openEvaluationModal(studentId);
      });
    });

    // Vincular bitácora detallada de desbloqueo de 20 temas
    container.querySelectorAll(".btn-view-details").forEach(btn => {
      btn.addEventListener("click", () => {
        const studentId = btn.dataset.id;
        TeacherDashboard.openStudentDetailsModal(studentId);
      });
    });

    // Botón de desbloqueo rápido para el profesor (Super Admin)
    container.querySelectorAll(".btn-toggle-unlock-all").forEach(btn => {
      btn.addEventListener("click", () => {
        const studentId = btn.dataset.id;
        const student = Database.getData().users.find(u => u.id === studentId);
        const prog = Database.getStudentProgress(studentId);
        const isAll = prog.manuallyUnlockedTopics?.includes("all");
        if (!isAll) {
          if (confirm(`¿Deseas desbloquear manualmente todos los 20 temas para ${student.name}? El alumno podrá ver y practicar cualquier tema sin esperar la secuencia.`)) {
            Database.setTopicManualUnlock(studentId, "all", true);
            App.showToast(`Todos los temas han sido desbloqueados para ${student.name}.`);
            TeacherDashboard.render("main_content_view");
          }
        } else {
          if (confirm(`¿Restablecer el bloqueo secuencial estricto para ${student.name}? Los temas volverán a requerir el 100% del tema anterior.`)) {
            Database.setTopicManualUnlock(studentId, "all", false);
            App.showToast(`Bloqueo secuencial restablecido para ${student.name}.`);
            TeacherDashboard.render("main_content_view");
          }
        }
      });
    });

    // Vincular botón de acta oficial imprimible
    const btnActa = document.getElementById("btn_export_grades_pdf");
    if (btnActa) {
      btnActa.addEventListener("click", () => {
        TeacherDashboard.openOfficialGradeSheet();
      });
    }

    // Botón para reiniciar avance individual a 0%
    container.querySelectorAll(".btn-reset-student").forEach(btn => {
      btn.addEventListener("click", () => {
        const studentId = btn.dataset.id;
        const student = Database.getData().users.find(u => u.id === studentId);
        if (confirm(`¿Estás seguro de reiniciar todo el avance y calificaciones de ${student.name} a CERO (0%)? Esta acción dejará su cuenta limpia para iniciar el curso.`)) {
          Database.resetStudentProgress(studentId);
          App.showToast(`Avance de ${student.name} reiniciado a 0% exitosamente.`);
          TeacherDashboard.render("main_content_view");
        }
      });
    });

    // Botón para reiniciar avance de todos los alumnos a 0%
    const btnResetAll = document.getElementById("btn_reset_all_students");
    if (btnResetAll) {
      btnResetAll.addEventListener("click", () => {
        if (confirm("¿Estás seguro de reiniciar a CERO (0%) el avance de TODOS los alumnos de la plataforma? Todos los temas volverán a bloquearse secuencialmente desde el tema 1.")) {
          Database.resetAllStudentsProgress();
          App.showToast("Todos los avances de los alumnos se han reiniciado al 0%.");
          TeacherDashboard.render("main_content_view");
        }
      });
    }

    // Botón para forzar sincronización en vivo
    const btnForceSync = document.getElementById("btn_force_sync_now");
    if (btnForceSync) {
      btnForceSync.addEventListener("click", () => {
        P2PSyncEngine.forceSyncNow();
      });
    }

    // Modal P2P
    const btnP2p = document.getElementById("btn_p2p_room_modal");
    if (btnP2p) {
      btnP2p.addEventListener("click", () => {
        TeacherDashboard.openP2PModal();
      });
    }
  },

  // Modal detallado con bitácora de los 20 temas y su estado de desbloqueo
  openStudentDetailsModal(studentId) {
    const modal = document.getElementById("eval_modal");
    const title = document.getElementById("eval_modal_title");
    const body = document.getElementById("eval_modal_body");
    const data = Database.getData();
    const student = data.users.find(u => u.id === studentId);
    const prog = Database.getStudentProgress(studentId);

    title.textContent = `Bitácora de Progreso y Desbloqueo: ${student.name}`;

    const topicsRowsHtml = CURRICULUM_DATA.map((t, idx) => {
      const status = Database.getTopicStatus(studentId, t.id);
      const isRead = prog.readTopics?.includes(t.id) || false;
      const isExDone = (prog.completedExercises?.includes(t.exerciseId) || false) && ((prog.scores?.[t.exerciseId] || 0) >= 100);
      const score = prog.scores?.[t.exerciseId] || 0;

      let statusBadge = "";
      if (status === "completed") {
        statusBadge = '<span class="badge badge-success">✓ 100% Completado</span>';
      } else if (status === "unlocked") {
        statusBadge = '<span class="badge badge-primary">🔓 En Curso</span>';
      } else {
        statusBadge = '<span class="badge badge-secondary">🔒 Bloqueado</span>';
      }

      return `
        <tr>
          <td><strong>#${idx + 1}</strong></td>
          <td><span class="unit-pill">U${t.unit} &bull; ${t.code}</span></td>
          <td><strong>${t.title}</strong></td>
          <td>${isRead ? '<span class="text-success">✓ Acreditada</span>' : '<span class="text-muted">○ Pendiente</span>'}</td>
          <td>${isExDone ? `<strong class="text-success">✓ ${score}/100 pts</strong>` : (score > 0 ? `<span class="text-warning">${score}/100 pts</span>` : '<span class="text-muted">0 pts</span>')}</td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-xs ${status === 'locked' ? 'btn-outline-success' : 'btn-outline-danger'} btn-toggle-single-unlock" data-topic="${t.id}" data-current="${status}">
              ${status === 'locked' ? 'Desbloquear' : 'Bloquear'}
            </button>
          </td>
        </tr>
      `;
    }).join("");

    body.innerHTML = `
      <div class="student-details-modal-box">
        <div class="sd-header-summary">
          <p>Supervisión detallada de cada uno de los 20 temas de <strong>${student.name}</strong> (${student.email}):</p>
        </div>
        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
          <table class="table table-dark table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Código</th>
                <th>Tema Curricular</th>
                <th>Lectura</th>
                <th>Laboratorio</th>
                <th>Estado</th>
                <th>Control Super Admin</th>
              </tr>
            </thead>
            <tbody>
              ${topicsRowsHtml}
            </tbody>
          </table>
        </div>
        <div class="modal-footer-actions" style="margin-top: 15px;">
          <button type="button" class="btn btn-secondary" id="btn_close_details_modal">Cerrar</button>
        </div>
      </div>
    `;

    modal.style.display = "flex";
    document.getElementById("btn_close_eval_modal").onclick = () => { modal.style.display = "none"; };
    document.getElementById("btn_close_details_modal").onclick = () => { modal.style.display = "none"; };

    body.querySelectorAll(".btn-toggle-single-unlock").forEach(btn => {
      btn.addEventListener("click", () => {
        const topicId = btn.dataset.topic;
        const current = btn.dataset.current;
        const shouldUnlock = current === "locked";
        Database.setTopicManualUnlock(studentId, topicId, shouldUnlock);
        TeacherDashboard.openStudentDetailsModal(studentId);
      });
    });
  },

  // Modal para calificar y retroalimentar al alumno
  openEvaluationModal(studentId) {
    const modal = document.getElementById("eval_modal");
    const title = document.getElementById("eval_modal_title");
    const body = document.getElementById("eval_modal_body");
    const data = Database.getData();
    const student = data.users.find(u => u.id === studentId);
    const prog = Database.getStudentProgress(studentId);
    const metrics = Database.calculateGlobalProgress(prog);

    title.textContent = `Evaluación Docente: ${student.name} (${student.email})`;

    body.innerHTML = `
      <form id="form_eval_student">
        <div class="form-group-rubric">
          <h5>Ajuste de Calificaciones de la Rúbrica Universidad Aztlán:</h5>
          <div class="form-row-2col">
            <label>Investigación y Prácticas (20% máx):
              <input type="number" id="inp_grade_inv" min="0" max="20" value="${metrics.rubricBreakdown.investigacion}" class="form-control">
            </label>
            <label>Reportes de Lectura (10% máx):
              <input type="number" id="inp_grade_rep" min="0" max="10" value="${metrics.rubricBreakdown.reportes}" class="form-control">
            </label>
          </div>
          <div class="form-row-2col">
            <label>Proyectos y Ensamble (20% máx):
              <input type="number" id="inp_grade_proy" min="0" max="20" value="${metrics.rubricBreakdown.proyectos}" class="form-control">
            </label>
            <label>Exámenes Parciales (20% máx):
              <input type="number" id="inp_grade_parc" min="0" max="20" value="${metrics.rubricBreakdown.parciales}" class="form-control">
            </label>
          </div>
          <div class="form-row-2col">
            <label>Examen Final Integrador (30% máx):
              <input type="number" id="inp_grade_fin" min="0" max="30" value="${metrics.rubricBreakdown.final}" class="form-control">
            </label>
          </div>
        </div>

        <div class="form-group">
          <label><strong>Retroalimentación y Observaciones del Profesor Titular (Ing. Luis Garibaldi):</strong></label>
          <textarea id="txt_eval_feedback" class="form-control" rows="4" placeholder="Escribe observaciones de desempeño para que el alumno las consulte en su portal...">${prog.generalFeedback || ''}</textarea>
        </div>

        <div class="modal-footer-actions">
          <button type="button" class="btn btn-secondary" id="btn_cancel_eval">Cancelar</button>
          <button type="submit" class="btn btn-success">Guardar y Sincronizar Calificaciones</button>
        </div>
      </form>
    `;

    modal.style.display = "flex";

    document.getElementById("btn_close_eval_modal").onclick = () => { modal.style.display = "none"; };
    document.getElementById("btn_cancel_eval").onclick = () => { modal.style.display = "none"; };

    document.getElementById("form_eval_student").onsubmit = (e) => {
      e.preventDefault();
      const newGrades = {
        investigacion: parseInt(document.getElementById("inp_grade_inv").value) || 0,
        reportes: parseInt(document.getElementById("inp_grade_rep").value) || 0,
        proyectos: parseInt(document.getElementById("inp_grade_proy").value) || 0,
        examenesParciales: parseInt(document.getElementById("inp_grade_parc").value) || 0,
        examenFinal: parseInt(document.getElementById("inp_grade_fin").value) || 0
      };
      const feedback = document.getElementById("txt_eval_feedback").value.trim();

      Database.updateTeacherFeedback(studentId, feedback, newGrades);
      modal.style.display = "none";
      TeacherDashboard.render("teacher_dashboard_container");
      alert(`Calificaciones y observaciones de ${student.name} guardadas y sincronizadas exitosamente.`);
    };
  },

  // Generador de Acta Oficial Imprimible de Universidad Aztlán
  openOfficialGradeSheet() {
    const data = Database.getData();
    const students = data.users.filter(u => u.role === "student");

    const printWin = window.open("", "_blank");
    if (!printWin) {
      alert("Por favor permite ventanas emergentes para visualizar el Acta Oficial de Calificaciones.");
      return;
    }

    let rowsHtml = students.map((st, i) => {
      const prog = Database.getStudentProgress(st.id);
      const metrics = Database.calculateGlobalProgress(prog);
      return `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${st.name}</strong></td>
          <td>${st.email}</td>
          <td>${metrics.totalPercent}%</td>
          <td>${metrics.rubricBreakdown.reportes}/10</td>
          <td>${metrics.rubricBreakdown.investigacion}/20</td>
          <td>${metrics.rubricBreakdown.proyectos}/20</td>
          <td>${metrics.rubricBreakdown.parciales}/20</td>
          <td>${metrics.rubricBreakdown.final}/30</td>
          <td><strong style="font-size: 1.1em; color: #1e3a8a;">${metrics.finalRubricGrade}</strong></td>
          <td>${metrics.finalRubricGrade >= 70 ? 'ACREDITADO' : 'NO ACREDITADO'}</td>
        </tr>
      `;
    }).join("");

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Acta Oficial de Calificaciones - Universidad Aztlán</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; }
          .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 25px; }
          .header h1 { margin: 0; color: #1e3a8a; font-size: 24px; text-transform: uppercase; }
          .header h2 { margin: 5px 0; color: #d97706; font-size: 18px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: center; font-size: 13px; }
          th { background: #f1f5f9; color: #0f172a; font-weight: 600; }
          .signature-box { margin-top: 60px; display: flex; justify-content: space-around; }
          .signature-line { width: 280px; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>UNIVERSIDAD AZTLÁN</h1>
          <h2>ACTA OFICIAL DE EVALUACIÓN Y ACREDITACIÓN</h2>
          <p>Ciclo: Sexto Cuatrimestre &bull; Clave de Asignatura: 636 &bull; Modalidad Sabatina</p>
        </div>
        <div class="meta-grid">
          <div>
            <strong>Asignatura:</strong> Arquitectura de Computadoras<br>
            <strong>Profesor Titular:</strong> Ing. Luis Garibaldi<br>
            <strong>Institución:</strong> Universidad Aztlán
          </div>
          <div style="text-align: right;">
            <strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString()}<br>
            <strong>Criterio de Acreditación:</strong> Evaluación Continua 100%<br>
            <strong>Estado del Acta:</strong> Cierre de Periodo
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre del Alumno</th>
              <th>Correo Institucional</th>
              <th>Avance</th>
              <th>Lectura (10%)</th>
              <th>Investigación (20%)</th>
              <th>Proyectos (20%)</th>
              <th>Parciales (20%)</th>
              <th>Final (30%)</th>
              <th>Calificación</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <div class="signature-box">
          <div class="signature-line">
            <strong>Ing. Luis Garibaldi</strong><br>
            Profesor Titular y Super Administrador<br>
            Universidad Aztlán
          </div>
          <div class="signature-line">
            <strong>Coordinación Académica</strong><br>
            Ingeniería en Sistemas Computacionales<br>
            Universidad Aztlán
          </div>
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => { printWin.print(); }, 500);
  },

  // Modal para la Sala P2P
  openP2PModal() {
    const modal = document.getElementById("eval_modal");
    const title = document.getElementById("eval_modal_title");
    const body = document.getElementById("eval_modal_body");

    title.textContent = "Centro de Control P2P en Tiempo Real";

    body.innerHTML = `
      <div class="p2p-panel-box">
        <p>El portal cuenta con <strong>doble motor de sincronización P2P</strong>:</p>
        <ol>
          <li><strong>Replicación Local Automática (BroadcastChannel):</strong> Sincroniza instantáneamente sin configuración todas las pestañas y ventanas de este equipo en 0 ms.</li>
          <li><strong>Red P2P Directa (WebRTC):</strong> Permite enlazar directamente la computadora del profesor con las laptops de Mario Leyva e Isaías López a través de la red local o Internet.</li>
        </ol>

        <div class="p2p-actions-row">
          <button class="btn btn-primary" id="btn_generate_offer">Generar Código de Enlace P2P (Profesor / Anfitrión)</button>
          <button class="btn btn-secondary" id="btn_join_offer">Unirse a Código P2P (Alumno)</button>
        </div>

        <div id="p2p_code_container" style="margin-top: 15px;"></div>
      </div>
    `;

    modal.style.display = "flex";
    document.getElementById("btn_close_eval_modal").onclick = () => { modal.style.display = "none"; };

    document.getElementById("btn_generate_offer").onclick = async () => {
      const codeBox = document.getElementById("p2p_code_container");
      codeBox.innerHTML = "<p>Generando código seguro de sesión WebRTC...</p>";
      try {
        const token = await P2PSyncEngine.createWebRtcOffer();
        codeBox.innerHTML = `
          <div class="form-group">
            <label><strong>Código de Enlace P2P para Compartir con los Alumnos:</strong></label>
            <textarea class="form-control" rows="3" readonly id="txt_token_offer">${token}</textarea>
            <button class="btn btn-sm btn-primary" style="margin-top: 5px;" onclick="navigator.clipboard.writeText(document.getElementById('txt_token_offer').value); alert('Código copiado al portapapeles.');">Copiar Código</button>
          </div>
          <div class="form-group" style="margin-top: 15px;">
            <label>Pega aquí el código de respuesta que te devuelva el alumno:</label>
            <textarea class="form-control" rows="2" id="txt_token_answer" placeholder="Pega el código de respuesta del alumno..."></textarea>
            <button class="btn btn-sm btn-success" style="margin-top: 5px;" id="btn_finish_p2p">Conectar y Sincronizar en Vivo</button>
          </div>
        `;
        document.getElementById("btn_finish_p2p").onclick = async () => {
          const ans = document.getElementById("txt_token_answer").value.trim();
          if (ans) {
            await P2PSyncEngine.finalizeWebRtcConnection(ans);
            alert("¡Conexión P2P establecida exitosamente! Todos los cambios se sincronizan en vivo.");
            modal.style.display = "none";
          }
        };
      } catch (err) {
        codeBox.innerHTML = `<div class="alert alert-danger">Error WebRTC: ${err.message}</div>`;
      }
    };

    document.getElementById("btn_join_offer").onclick = () => {
      const codeBox = document.getElementById("p2p_code_container");
      codeBox.innerHTML = `
        <div class="form-group">
          <label>Pega el código de enlace que te compartió el Profesor Luis Garibaldi:</label>
          <textarea class="form-control" rows="3" id="txt_input_offer"></textarea>
          <button class="btn btn-sm btn-primary" style="margin-top: 5px;" id="btn_process_offer">Aceptar y Generar Código de Respuesta</button>
        </div>
        <div id="p2p_answer_area"></div>
      `;
      document.getElementById("btn_process_offer").onclick = async () => {
        const off = document.getElementById("txt_input_offer").value.trim();
        if (off) {
          try {
            const answerToken = await P2PSyncEngine.acceptWebRtcOffer(off);
            document.getElementById("p2p_answer_area").innerHTML = `
              <div class="form-group" style="margin-top: 15px;">
                <label>Envía este código de respuesta de vuelta a tu profesor:</label>
                <textarea class="form-control" rows="3" readonly id="txt_res_answer">${answerToken}</textarea>
                <button class="btn btn-sm btn-success" style="margin-top: 5px;" onclick="navigator.clipboard.writeText(document.getElementById('txt_res_answer').value); alert('Código de respuesta copiado.');">Copiar Código de Respuesta</button>
              </div>
            `;
          } catch (e) {
            alert(e.message);
          }
        }
      };
    };
  }
};
