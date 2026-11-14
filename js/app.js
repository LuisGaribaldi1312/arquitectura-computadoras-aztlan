/**
 * APLICACIÓN PRINCIPAL Y CONTROLADOR DE LA INTERFAZ DE USUARIO
 * Centro de Estudios: Universidad Aztlán
 * Asignatura: Arquitectura de Computadoras (Clave 636)
 * Profesor Titular & Super Administrador: Ing. Luis Garibaldi
 */

const App = {
  activeTab: "tab_units",
  selectedTopicId: "u1_1_1",
  selectedUnitFilter: "all",

  init() {
    // 1. Inicializar Base de Datos, P2P y Autenticación
    Database.init();
    AuthService.init();
    P2PSyncEngine.init();

    // 2. Renderizar Interfaz según estado de sesión
    this.renderState();

    // 3. Suscribirse a eventos de datos y P2P
    Database.subscribe(() => {
      if (AuthService.isAuthenticated()) {
        this.refreshCurrentView();
      }
    });

    P2PSyncEngine.onStatusChange((info) => {
      this.updateP2PStatusBadge(info);
    });

    AuthService.onAuthChange((user) => {
      if (user) {
        // Si el usuario es el Super Administrador, dirigir por defecto al Panel Docente
        if (user.role === "admin") {
          this.activeTab = "tab_teacher_dashboard";
        } else {
          this.activeTab = "tab_units";
        }
      }
      this.renderState();
    });
  },

  renderState() {
    const isAuth = AuthService.isAuthenticated();
    const navEl = document.getElementById("main_nav_tabs");
    const contentArea = document.getElementById("main_content_view");

    this.renderHeader();

    if (!isAuth) {
      if (navEl) navEl.style.display = "none";
      if (contentArea) this.renderLoginView(contentArea);
    } else {
      if (navEl) navEl.style.display = "flex";
      this.renderNav();
      this.switchTab(this.activeTab);
    }
  },

  // RENDERIZADO DEL ENCABEZADO
  renderHeader() {
    const user = AuthService.getCurrentUser();
    const headerUserEl = document.getElementById("header_user_profile");
    if (!headerUserEl) return;

    if (!user) {
      headerUserEl.innerHTML = `
        <div class="user-pill-tag guest-pill">
          <span class="avatar">🔒</span>
          <div class="user-meta">
            <span class="user-name">Portal Institucional</span>
            <span class="user-role">Autenticación Requerida</span>
          </div>
        </div>
      `;
      return;
    }

    const isAdmin = user.role === "admin";

    headerUserEl.innerHTML = `
      <div class="user-pill-tag ${isAdmin ? 'admin-pill' : 'student-pill'}">
        <span class="avatar">${user.avatar}</span>
        <div class="user-meta">
          <span class="user-name">${user.name}</span>
          <span class="user-role">${isAdmin ? 'Super Administrador (100% Permisos)' : 'Alumno (@aztlan.edu.mx)'}</span>
        </div>
      </div>
      <button class="btn btn-outline-danger btn-sm" id="btn_logout_header" title="Cerrar Sesión Segura">
        <i class="icon">🚪</i> Cerrar Sesión
      </button>
    `;

    document.getElementById("btn_logout_header")?.addEventListener("click", () => {
      if (confirm(`¿Deseas cerrar la sesión de ${user.name}?`)) {
        AuthService.logout();
        this.showToast("Sesión cerrada correctamente.");
      }
    });
  },

  // RENDERIZADO DE LA PANTALLA DE INICIO DE SESIÓN INSTITUCIONAL
  renderLoginView(container) {
    container.innerHTML = `
      <div class="login-view-wrapper">
        <div class="login-card-container">
          <div class="login-header-banner">
            <div class="login-logo-box">UA</div>
            <h2>UNIVERSIDAD AZTLÁN</h2>
            <p class="login-sub">Portal de Arquitectura de Computadoras &bull; Clave 636</p>
            <span class="login-badge-sem">Acceso Restringido a Usuarios Autorizados</span>
          </div>

          <form id="form_login_portal" class="login-form-box">
            <div id="login_error_alert" class="alert alert-danger" style="display: none;"></div>

            <div class="form-group">
              <label for="login_email">Correo Institucional (@aztlan.edu.mx):</label>
              <div class="input-with-icon">
                <span class="input-icon">📧</span>
                <input type="email" id="login_email" class="form-control" placeholder="ejemplo@aztlan.edu.mx" autocomplete="username" required autofocus>
              </div>
            </div>

            <div class="form-group">
              <label for="login_password">Contraseña Institucional:</label>
              <div class="input-with-icon">
                <span class="input-icon">🔑</span>
                <input type="password" id="login_password" class="form-control" placeholder="••••••••••••" autocomplete="current-password" required>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn_submit_login">
              <i class="icon">🔓</i> Iniciar Sesión en el Portal
            </button>
          </form>

          <div class="login-security-notice">
            <p><i class="icon">🛡️</i> Acceso protegido. Sistema de autenticación con control de acceso basado en roles (RBAC) para el cuerpo docente y alumnado de la Universidad Aztlán.</p>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById("form_login_portal");
    const errBox = document.getElementById("login_error_alert");
    const emailInp = document.getElementById("login_email");
    const passInp = document.getElementById("login_password");

    form.onsubmit = (e) => {
      e.preventDefault();
      errBox.style.display = "none";

      const res = AuthService.login(emailInp.value, passInp.value);
      if (res.success) {
        App.showToast(`¡Bienvenido al portal, ${res.user.name}!`);
      } else {
        errBox.textContent = res.message;
        errBox.style.display = "block";
      }
    };
  },

  // RENDERIZADO DE LA BARRA DE NAVEGACIÓN SEGÚN PERMISOS (RBAC)
  renderNav() {
    const user = AuthService.getCurrentUser();
    const perms = AuthService.getPermissions();
    const navEl = document.getElementById("main_nav_tabs");
    if (!navEl) return;

    navEl.innerHTML = `
      ${perms.canViewTeacherDashboard ? `
        <button class="nav-tab-btn admin-highlight ${this.activeTab === 'tab_teacher_dashboard' ? 'active' : ''}" data-tab="tab_teacher_dashboard">
          <i class="icon">👨‍🏫</i> Panel Docente & Calificaciones (Super Admin)
        </button>
      ` : ''}
      <button class="nav-tab-btn ${this.activeTab === 'tab_units' ? 'active' : ''}" data-tab="tab_units">
        <i class="icon">📚</i> Temario y Unidades
      </button>
      <button class="nav-tab-btn ${this.activeTab === 'tab_simulators' ? 'active' : ''}" data-tab="tab_simulators">
        <i class="icon">🔬</i> Laboratorio de Simuladores
      </button>
      <button class="nav-tab-btn ${this.activeTab === 'tab_student_progress' ? 'active' : ''}" data-tab="tab_student_progress">
        <i class="icon">📈</i> ${perms.canViewTeacherDashboard ? 'Vista Previa Alumno' : 'Mi Avance Académico & Rúbrica'}
      </button>
      <button class="nav-tab-btn ${this.activeTab === 'tab_p2p_sync' ? 'active' : ''}" data-tab="tab_p2p_sync">
        <i class="icon">⚡</i> Sincronización P2P
      </button>
    `;

    navEl.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.switchTab(btn.dataset.tab);
      });
    });
  },

  switchTab(tabId) {
    const perms = AuthService.getPermissions();

    // Protección estricta: Alumno no puede entrar al panel docente
    if (tabId === "tab_teacher_dashboard" && !perms.canViewTeacherDashboard) {
      alert("Acceso denegado: Esta sección es exclusiva para el Super Administrador y Profesor Titular (Ing. Luis Garibaldi).");
      this.activeTab = "tab_units";
      this.renderNav();
      return;
    }

    this.activeTab = tabId;
    this.renderNav();

    const contentArea = document.getElementById("main_content_view");
    if (!contentArea) return;

    switch (tabId) {
      case "tab_units":
        this.renderUnitsView(contentArea);
        break;
      case "tab_simulators":
        this.renderSimulatorsHubView(contentArea);
        break;
      case "tab_student_progress":
        this.renderStudentProgressView(contentArea);
        break;
      case "tab_teacher_dashboard":
        contentArea.innerHTML = `<div id="teacher_dashboard_container"></div>`;
        TeacherDashboard.render("teacher_dashboard_container");
        break;
      case "tab_p2p_sync":
        this.renderP2PSyncView(contentArea);
        break;
    }
  },

  refreshCurrentView() {
    this.switchTab(this.activeTab);
  },

  // VISTA 1: TEMARIO Y UNIDADES
  renderUnitsView(container) {
    const user = AuthService.getCurrentUser();
    const studentProg = Database.getStudentProgress(user.id);
    const activeTopic = CURRICULUM_DATA.find(t => t.id === this.selectedTopicId) || CURRICULUM_DATA[0];
    const isTopicRead = studentProg.readTopics?.includes(activeTopic.id) || false;

    let unitsListHtml = "";
    for (let u = 1; u <= 4; u++) {
      const unitTopics = CURRICULUM_DATA.filter(t => t.unit === u);
      const unitTitles = {
        1: "Unidad 1: Arquitecturas de Cómputo",
        2: "Unidad 2: Estructura y Funcionamiento del CPU",
        3: "Unidad 3: Selección de Componentes y Ensamble",
        4: "Unidad 4: Procesamiento Paralelo"
      };

      unitsListHtml += `
        <div class="unit-group">
          <div class="unit-group-title">${unitTitles[u]}</div>
          <div class="unit-topic-links">
            ${unitTopics.map(t => {
              const isRead = studentProg.readTopics?.includes(t.id);
              const isExDone = studentProg.completedExercises?.includes(t.exerciseId);
              const isCurrent = t.id === activeTopic.id;
              return `
                <a href="javascript:void(0)" class="topic-nav-link ${isCurrent ? 'active' : ''}" data-topic="${t.id}">
                  <span class="topic-code">${t.code}</span>
                  <span class="topic-text">${t.title}</span>
                  <span class="status-dots">
                    <span class="dot ${isRead ? 'dot-read' : ''}" title="Lectura"></span>
                    <span class="dot ${isExDone ? 'dot-done' : ''}" title="Práctica"></span>
                  </span>
                </a>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="units-layout-grid">
        <aside class="units-sidebar">
          <div class="sidebar-search-box">
            <input type="text" id="txt_search_topics" placeholder="Buscar tema o concepto real..." class="form-control">
          </div>
          <div class="topics-accordion" id="accordion_topics">
            ${unitsListHtml}
          </div>
        </aside>

        <main class="topic-main-content">
          <div class="topic-article-header">
            <div class="topic-badges-row">
              <span class="badge badge-primary">${activeTopic.unitTitle}</span>
              <span class="badge badge-info">${activeTopic.code} ${activeTopic.badge}</span>
              <span class="badge badge-light">⏱️ Lectura estimada: ${activeTopic.readTime}</span>
              <span class="badge badge-warning">Caso Práctico en Silicio Real</span>
            </div>
            <h2>${activeTopic.title}</h2>
            <p class="topic-lead">${activeTopic.summary}</p>
          </div>

          <article class="theory-article-body">
            ${activeTopic.theory}
          </article>

          <div class="reading-confirmation-box ${isTopicRead ? 'confirmed' : ''}">
            <div class="reading-text">
              <strong>${isTopicRead ? '✓ Contenido Teórico y Caso Real Estudiado' : 'Registro de Lectura y Comprensión'}</strong>
              <p>${isTopicRead ? 'Has acreditado la revisión de este contenido. Tu avance se sincroniza con el Panel Docente.' : 'Al finalizar la lectura comprensiva de la teoría y ejemplos prácticos, pulsa para acreditar tu 10% de Reportes de Lectura.'}</p>
            </div>
            <button class="btn ${isTopicRead ? 'btn-secondary' : 'btn-success'}" id="btn_confirm_read" ${isTopicRead ? 'disabled' : ''}>
              ${isTopicRead ? 'Lectura Acreditada ✓' : 'Marcar como Leído y Estudiado'}
            </button>
          </div>

          <section class="topic-exercise-section">
            <div class="exercise-section-header">
              <h3><i class="icon">🔬</i> Laboratorio Práctico de Aplicación Real: ${activeTopic.exerciseTitle}</h3>
              <p>${activeTopic.exerciseInstructions}</p>
            </div>
            <div id="exercise_container_${activeTopic.id}" class="exercise-host-container"></div>
          </section>
        </main>
      </div>
    `;

    container.querySelectorAll(".topic-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        this.selectedTopicId = link.dataset.topic;
        this.renderUnitsView(container);
      });
    });

    const btnRead = document.getElementById("btn_confirm_read");
    if (btnRead && !isTopicRead) {
      btnRead.addEventListener("click", () => {
        Database.markTopicAsRead(user.id, activeTopic.id);
        this.showToast(`¡Lectura de ${activeTopic.code} registrada con éxito!`);
        this.renderUnitsView(container);
      });
    }

    SimulatorEngine.render(
      `exercise_container_${activeTopic.id}`,
      activeTopic.exerciseId,
      studentProg,
      (exId, score) => {
        Database.recordExerciseScore(user.id, exId, score);
        App.showToast(`¡Excelente! Ejercicio calificado con ${score}/100 pts. Progreso guardado.`);
      }
    );

    const txtSearch = document.getElementById("txt_search_topics");
    if (txtSearch) {
      txtSearch.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        container.querySelectorAll(".topic-nav-link").forEach(lnk => {
          const text = lnk.textContent.toLowerCase();
          lnk.style.display = text.includes(query) ? "flex" : "none";
        });
      });
    }
  },

  // VISTA 2: LABORATORIO DE SIMULADORES
  renderSimulatorsHubView(container) {
    const user = AuthService.getCurrentUser();
    const studentProg = Database.getStudentProgress(user.id);

    const cardsHtml = CURRICULUM_DATA.map(t => {
      const isDone = studentProg.completedExercises?.includes(t.exerciseId);
      const score = studentProg.scores?.[t.exerciseId] || 0;
      return `
        <div class="sim-hub-card ${isDone ? 'sim-done' : ''}">
          <div class="sim-hub-header">
            <span class="badge ${isDone ? 'badge-success' : 'badge-warning'}">
              ${isDone ? `✓ Aprobado (${score} pts)` : 'Pendiente'}
            </span>
            <span class="unit-pill">U${t.unit} &bull; ${t.code}</span>
          </div>
          <h4>${t.exerciseTitle}</h4>
          <p>${t.summary}</p>
          <div class="sim-hub-footer">
            <button class="btn btn-primary btn-sm btn-launch-sim" data-topic="${t.id}">
              <i class="icon">🚀</i> Abrir Simulador Interactivo
            </button>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="simulators-hub-wrapper">
        <div class="hub-hero">
          <h2>Laboratorio de 20 Simuladores de Aplicación en la Vida Real</h2>
          <p>Ejercicios interactivos basados en arquitecturas de silicio comercial: microprocesadores Intel Core, AMD Ryzen, Apple Silicon, memoria DDR5, GPUs NVIDIA con Tensor Cores y redes de supercómputo.</p>
        </div>
        <div class="sim-hub-grid">
          ${cardsHtml}
        </div>
      </div>
    `;

    container.querySelectorAll(".btn-launch-sim").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedTopicId = btn.dataset.topic;
        this.switchTab("tab_units");
      });
    });
  },

  // VISTA 3: MI AVANCE ACADÉMICO (VISTA ALUMNO)
  renderStudentProgressView(container) {
    const user = AuthService.getCurrentUser();
    const prog = Database.getStudentProgress(user.id);
    const metrics = Database.calculateGlobalProgress(prog);

    container.innerHTML = `
      <div class="student-profile-wrapper">
        <div class="profile-hero-card">
          <div class="profile-user-header">
            <div class="avatar-large">${user.avatar}</div>
            <div class="user-details">
              <h2>${user.name}</h2>
              <span class="profile-email">${user.email}</span>
              <p>${user.title} &bull; Universidad Aztlán</p>
            </div>
            <div class="profile-grade-display">
              <span class="grade-title">Calificación Global Ponderada</span>
              <h1 class="grade-huge">${metrics.finalRubricGrade} <small>/ 100</small></h1>
              <span class="grade-status ${metrics.finalRubricGrade >= 70 ? 'text-success' : 'text-warning'}">
                ${metrics.finalRubricGrade >= 70 ? '✓ ESTATUS: ACREDITADO' : '⏳ ESTATUS: EN PROGRESO'}
              </span>
            </div>
          </div>

          <div class="global-progress-block">
            <div class="prog-labels">
              <span><strong>Avance Total de la Materia:</strong></span>
              <strong class="text-primary">${metrics.totalPercent}%</strong>
            </div>
            <div class="progress-bar-container large">
              <div class="progress-bar-fill" style="width: ${metrics.totalPercent}%;"></div>
            </div>
          </div>
        </div>

        <div class="rubric-grid-cards">
          <div class="rubric-card">
            <h4>1. Investigación y Prácticas (20%)</h4>
            <div class="rc-number">${metrics.rubricBreakdown.investigacion} / 20 pts</div>
            <p>Calculado sobre la realización de los 20 laboratorios interactivos.</p>
          </div>
          <div class="rubric-card">
            <h4>2. Reportes de Lectura (10%)</h4>
            <div class="rc-number">${metrics.rubricBreakdown.reportes} / 10 pts</div>
            <p>Revisión teórica y conceptual de las 4 unidades temarias.</p>
          </div>
          <div class="rubric-card">
            <h4>3. Proyectos y Ensamble (20%)</h4>
            <div class="rc-number">${metrics.rubricBreakdown.proyectos} / 20 pts</div>
            <p>Ensamble virtual y compatibilidad de hardware.</p>
          </div>
          <div class="rubric-card">
            <h4>4. Exámenes Parciales (20%)</h4>
            <div class="rc-number">${metrics.rubricBreakdown.parciales} / 20 pts</div>
            <p>Evaluaciones continuas acumulativas.</p>
          </div>
          <div class="rubric-card">
            <h4>5. Examen Final Integrador (30%)</h4>
            <div class="rc-number">${metrics.rubricBreakdown.final} / 30 pts</div>
            <p>Evaluación integradora de Arquitecturas y Paralelismo.</p>
          </div>
        </div>

        <div class="teacher-notes-card">
          <h4>Retroalimentación de tu Profesor Titular:</h4>
          <blockquote class="teacher-quote">
            "${prog.generalFeedback || 'Continúa trabajando en tus ejercicios prácticos y lecturas para completar el 100% de tu avance.'}"
            <footer>— Ing. Luis Garibaldi, Profesor Titular y Super Administrador</footer>
          </blockquote>
        </div>
      </div>
    `;
  },

  // VISTA 4: CENTRO DE SINCRONIZACIÓN P2P
  renderP2PSyncView(container) {
    const user = AuthService.getCurrentUser();
    const perms = AuthService.getPermissions();
    const data = Database.getData();

    container.innerHTML = `
      <div class="p2p-sync-view-wrapper">
        <div class="p2p-view-header">
          <h2>Motor de Sincronización P2P en Tiempo Real</h2>
          <p>Replicación descentralizada de base de datos entre el profesor y los alumnos mediante <strong>BroadcastChannel</strong> y <strong>WebRTC</strong>.</p>
        </div>

        <div class="p2p-status-panel">
          <div class="status-indicator-box">
            <span class="status-dot-pulse online"></span>
            <div>
              <h4>Canal de Red: Sincronizado en Vivo</h4>
              <p>Cualquier ejercicio o lectura completada se replica instantáneamente al Panel del Profesor.</p>
            </div>
          </div>
          ${perms.canHostP2PRoom ? `
            <button class="btn btn-primary" id="btn_launch_p2p_wizard">Abrir Asistente P2P (Super Admin)</button>
          ` : `
            <button class="btn btn-secondary" id="btn_student_p2p_sync">Verificar Conexión P2P con el Profesor</button>
          `}
        </div>

        ${perms.canImportDatabase ? `
          <div class="db-management-grid">
            <div class="db-card">
              <h4>Copia de Seguridad Institucional</h4>
              <p>Descarga la base de datos completa con calificaciones de todos los alumnos.</p>
              <button class="btn btn-success" id="btn_export_db">
                <i class="icon">💾</i> Exportar Base de Datos (.json)
              </button>
            </div>
            <div class="db-card">
              <h4>Restaurar Base de Datos</h4>
              <p>Restaura respaldos previos en JSON (exclusivo para Super Administrador).</p>
              <input type="file" id="file_import_db" accept=".json" style="display: none;">
              <button class="btn btn-secondary" id="btn_trigger_file">
                <i class="icon">📂</i> Cargar Respaldo JSON
              </button>
            </div>
          </div>
        ` : `
          <div class="db-card" style="margin-top: 20px;">
            <h4>Respaldo de tu Progreso Personal</h4>
            <p>Puedes descargar un archivo de respaldo con tus avances y ejercicios resueltos.</p>
            <button class="btn btn-primary" id="btn_export_db">
              <i class="icon">💾</i> Descargar Mi Respaldo (.json)
            </button>
          </div>
        `}
      </div>
    `;

    if (perms.canHostP2PRoom) {
      document.getElementById("btn_launch_p2p_wizard").onclick = () => {
        TeacherDashboard.openP2PModal();
      };
      const fileInput = document.getElementById("file_import_db");
      document.getElementById("btn_trigger_file").onclick = () => { fileInput.click(); };
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const res = Database.importFromJson(ev.target.result);
            if (res.success) {
              alert("¡Base de datos institucional importada y sincronizada correctamente!");
              App.refreshCurrentView();
            } else {
              alert("Error al importar: " + res.error);
            }
          };
          reader.readAsText(file);
        }
      };
    } else {
      const btnCheck = document.getElementById("btn_student_p2p_sync");
      if (btnCheck) {
        btnCheck.onclick = () => {
          P2PSyncEngine.broadcastLocalState(Database.getData());
          alert("✓ Tu progreso y calificaciones han sido transmitidos y sincronizados con la sesión de tu profesor.");
        };
      }
    }

    document.getElementById("btn_export_db").onclick = () => {
      const json = Database.exportToJson();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AZTLAN_ARQ_COMP_RESPALDO_${user.name.replace(/\s+/g, '_')}.json`;
      a.click();
    };
  },

  updateP2PStatusBadge(info) {
    const badge = document.getElementById("p2p_header_indicator");
    if (!badge) return;
    badge.innerHTML = `
      <span class="p2p-live-dot ${info.status === 'connected' ? 'online' : 'syncing'}"></span>
      <span class="p2p-text">P2P Sincronizado (${info.lastSync})</span>
    `;
  },

  showToast(message) {
    let toast = document.getElementById("app_toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app_toast";
      toast.className = "app-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  App.init();
});
