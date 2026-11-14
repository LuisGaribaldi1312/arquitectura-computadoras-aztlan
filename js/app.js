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
              const status = Database.getTopicStatus(user.id, t.id);
              const isCurrent = t.id === activeTopic.id;
              const isRead = studentProg.readTopics?.includes(t.id);
              const isExDone = (studentProg.completedExercises?.includes(t.exerciseId) || false) && ((studentProg.scores?.[t.exerciseId] || 0) >= 100);

              let statusIcon = "🔒";
              let statusClass = "topic-locked";
              if (status === "completed") {
                statusIcon = "✓";
                statusClass = "topic-completed";
              } else if (status === "unlocked") {
                statusIcon = "🔓";
                statusClass = "topic-unlocked";
              }

              return `
                <a href="javascript:void(0)" class="topic-nav-link ${isCurrent ? 'active' : ''} ${statusClass}" data-topic="${t.id}" data-status="${status}">
                  <span class="topic-code">${t.code}</span>
                  <span class="topic-text">${t.title}</span>
                  <span class="topic-lock-pill" title="${status === 'completed' ? '100% Completado' : (status === 'unlocked' ? 'En Curso' : 'Bloqueado')}">
                    ${statusIcon}
                  </span>
                </a>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    const isCurrentCompleted = Database.isTopicCompleted(user.id, activeTopic.id);
    const isExDone = (studentProg.completedExercises?.includes(activeTopic.exerciseId) || false) && ((studentProg.scores?.[activeTopic.exerciseId] || 0) >= 100);
    const nextTopic = Database.getNextTopic(activeTopic.id);

    container.innerHTML = `
      <div class="units-layout-grid">
        <aside class="units-sidebar">
          <div class="sidebar-search-box">
            <input type="text" id="txt_search_topics" placeholder="Buscar tema o concepto real..." class="form-control">
          </div>
          <div class="sidebar-lock-legend">
            <span><strong class="text-success">✓</strong> Completado 100%</span> |
            <span><strong class="text-primary">🔓</strong> En Curso</span> |
            <span><strong class="text-muted">🔒</strong> Bloqueado</span>
          </div>
          <div class="topics-accordion" id="accordion_topics">
            ${unitsListHtml}
          </div>
        </aside>

        <main class="topic-main-content">
          <!-- Banner de Progreso y Desbloqueo del Tema Actual -->
          <div class="topic-mastery-banner ${isCurrentCompleted ? 'mastery-complete' : 'mastery-in-progress'}">
            <div class="mastery-info">
              <h4>Requisitos de Acreditación del Tema ${activeTopic.code}:</h4>
              <div class="mastery-steps-row">
                <span class="m-step ${isTopicRead ? 'step-done' : 'step-pending'}">
                  ${isTopicRead ? '✓ 1. Lectura y Teoría (Acreditado)' : '⏳ 1. Lectura y Teoría (Pendiente de confirmar)'}
                </span>
                <span class="m-step ${isExDone ? 'step-done' : 'step-pending'}">
                  ${isExDone ? '✓ 2. Laboratorio Práctico (100 / 100 pts)' : '⏳ 2. Laboratorio Práctico (Pendiente de resolver)'}
                </span>
              </div>
            </div>
            <div class="mastery-badge-box">
              <span class="badge ${isCurrentCompleted ? 'badge-success' : 'badge-warning'}">
                ${isCurrentCompleted ? '✓ TEMA 100% COMPLETADO' : '⏳ TEMA EN CURSO'}
              </span>
              ${isCurrentCompleted && nextTopic ? `
                <button class="btn btn-primary btn-sm" id="btn_quick_next_topic" style="margin-top: 6px;">
                  Siguiente Tema (${nextTopic.code}) &rarr;
                </button>
              ` : ''}
            </div>
          </div>

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
              <strong>${isTopicRead ? '✓ Contenido Teórico y Caso Real Estudiado al 100%' : 'Registro de Lectura y Comprensión'}</strong>
              <p>${isTopicRead ? 'Has acreditado la lectura. Ahora resuelve el laboratorio práctico para completar el 100% de este tema y desbloquear el siguiente.' : 'Al finalizar la lectura comprensiva de la teoría y ejemplos prácticos, pulsa para acreditar tu lectura.'}</p>
            </div>
            <button class="btn ${isTopicRead ? 'btn-secondary' : 'btn-success'}" id="btn_confirm_read" ${isTopicRead ? 'disabled' : ''}>
              ${isTopicRead ? 'Lectura Acreditada ✓' : 'Marcar como Leído y Estudiado (100%)'}
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

      <!-- Modal de Desbloqueo Automático del Siguiente Tema -->
      <div id="unlock_modal" class="modal-backdrop" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-header">
            <h4 class="text-success"><i class="icon">🎉</i> ¡Tema Completado al 100%!</h4>
            <button class="modal-close-btn" id="btn_close_unlock_modal">&times;</button>
          </div>
          <div class="modal-body" id="unlock_modal_body">
            <!-- Contenido dinámico del desbloqueo -->
          </div>
        </div>
      </div>
    `;

    // Vincular navegación de temas en el sidebar
    container.querySelectorAll(".topic-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        const topicId = link.dataset.topic;
        const status = link.dataset.status;

        if (status === "locked") {
          const tIdx = CURRICULUM_DATA.findIndex(x => x.id === topicId);
          const prev = tIdx > 0 ? CURRICULUM_DATA[tIdx - 1] : null;
          alert(`🔒 CONTENIDO BLOQUEADO:\nPara acceder a ${link.querySelector(".topic-code").textContent} ${link.querySelector(".topic-text").textContent}, primero debes completar al 100% tanto la lectura como el laboratorio del tema previo (${prev ? prev.code + " " + prev.title : ""}).`);
          return;
        }

        this.selectedTopicId = topicId;
        this.renderUnitsView(container);
      });
    });

    const btnNextQuick = document.getElementById("btn_quick_next_topic");
    if (btnNextQuick && nextTopic) {
      btnNextQuick.onclick = () => {
        this.selectedTopicId = nextTopic.id;
        this.renderUnitsView(container);
      };
    }

    const btnRead = document.getElementById("btn_confirm_read");
    if (btnRead && !isTopicRead) {
      btnRead.addEventListener("click", () => {
        Database.markTopicAsRead(user.id, activeTopic.id);
        this.showToast(`¡Lectura de ${activeTopic.code} acreditada al 100%!`);
        this.checkAutoUnlock(activeTopic.id);
        this.renderUnitsView(container);
      });
    }

    SimulatorEngine.render(
      `exercise_container_${activeTopic.id}`,
      activeTopic.exerciseId,
      studentProg,
      (exId, score) => {
        Database.recordExerciseScore(user.id, exId, score);
        App.showToast(`¡Excelente! Laboratorio acreditado con ${score}/100 pts.`);
        this.checkAutoUnlock(activeTopic.id);
        this.renderUnitsView(container);
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

  // VERIFICACIÓN Y APERTURA DE MODAL DE DESBLOQUEO AUTOMÁTICO
  checkAutoUnlock(topicId) {
    const user = AuthService.getCurrentUser();
    const isCompleted = Database.isTopicCompleted(user.id, topicId);
    if (!isCompleted) return;

    const nextTopic = Database.getNextTopic(topicId);
    if (!nextTopic) {
      this.showToast("🏆 ¡Felicidades! Has completado el 100% de todo el temario de Arquitectura de Computadoras.");
      return;
    }

    const modal = document.getElementById("unlock_modal");
    const body = document.getElementById("unlock_modal_body");
    if (!modal || !body) return;

    const current = CURRICULUM_DATA.find(t => t.id === topicId);

    body.innerHTML = `
      <div class="unlock-success-box text-center">
        <div class="unlock-icon">🔓</div>
        <h3>¡Has completado el Tema ${current.code} al 100%!</h3>
        <p>Has acreditado tanto la <strong>lectura teórica</strong> como el <strong>laboratorio práctico</strong> con calificación perfecta de 100 pts.</p>
        
        <div class="unlocked-next-card">
          <span class="badge badge-success">✓ DESBLOQUEADO EN AUTOMÁTICO</span>
          <h4>${nextTopic.code}: ${nextTopic.title}</h4>
          <p>${nextTopic.summary}</p>
        </div>

        <button class="btn btn-primary btn-lg btn-block" id="btn_advance_next_modal" style="margin-top: 20px;">
          Avanzar al Siguiente Tema (${nextTopic.code}) &rarr;
        </button>
      </div>
    `;

    modal.style.display = "flex";

    document.getElementById("btn_close_unlock_modal").onclick = () => { modal.style.display = "none"; };
    document.getElementById("btn_advance_next_modal").onclick = () => {
      modal.style.display = "none";
      this.selectedTopicId = nextTopic.id;
      this.renderUnitsView(document.getElementById("main_content_view"));
    };
  },

  // VISTA 2: LABORATORIO DE SIMULADORES
  renderSimulatorsHubView(container) {
    const user = AuthService.getCurrentUser();
    const studentProg = Database.getStudentProgress(user.id);

    const cardsHtml = CURRICULUM_DATA.map(t => {
      const status = Database.getTopicStatus(user.id, t.id);
      const isDone = (studentProg.completedExercises?.includes(t.exerciseId) || false) && ((studentProg.scores?.[t.exerciseId] || 0) >= 100);
      const score = studentProg.scores?.[t.exerciseId] || 0;
      const isLocked = status === "locked";

      let badgeHtml = "";
      if (status === "completed") {
        badgeHtml = `<span class="badge badge-success">✓ 100% Completado (${score} pts)</span>`;
      } else if (status === "unlocked") {
        badgeHtml = `<span class="badge badge-primary">🔓 En Curso (${score > 0 ? score + ' pts' : 'Pendiente'})</span>`;
      } else {
        badgeHtml = `<span class="badge badge-secondary">🔒 Bloqueado</span>`;
      }

      return `
        <div class="sim-hub-card ${isDone ? 'sim-done' : ''} ${isLocked ? 'sim-locked' : ''}">
          <div class="sim-hub-header">
            ${badgeHtml}
            <span class="unit-pill">U${t.unit} &bull; ${t.code}</span>
          </div>
          <h4>${t.exerciseTitle}</h4>
          <p>${t.summary}</p>
          <div class="sim-hub-footer">
            ${isLocked ? `
              <button class="btn btn-secondary btn-sm btn-locked-sim" data-topic="${t.id}" title="Completa el tema anterior para desbloquear">
                <i class="icon">🔒</i> Bloqueado
              </button>
            ` : `
              <button class="btn btn-primary btn-sm btn-launch-sim" data-topic="${t.id}">
                <i class="icon">🚀</i> ${isDone ? 'Repetir Práctica' : 'Abrir Simulador'}
              </button>
            `}
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

    container.querySelectorAll(".btn-locked-sim").forEach(btn => {
      btn.addEventListener("click", () => {
        const topicId = btn.dataset.topic;
        const tIdx = CURRICULUM_DATA.findIndex(x => x.id === topicId);
        const prev = tIdx > 0 ? CURRICULUM_DATA[tIdx - 1] : null;
        alert(`🔒 SIMULADOR BLOQUEADO:
Para desbloquear este laboratorio interactivo, primero debes completar al 100% tanto la lectura como el simulador del tema previo (${prev ? prev.code + ' ' + prev.title : ''}).`);
      });
    });
  },

  // VISTA 3: MI AVANCE ACADÉMICO (VISTA ALUMNO)
  renderStudentProgressView(container) {
    const user = AuthService.getCurrentUser();
    const prog = Database.getStudentProgress(user.id);
    const metrics = Database.calculateGlobalProgress(prog);

    // Contadores del Roadmap
    let completedCount = 0;
    let unlockedCount = 0;
    let lockedCount = 0;

    const roadmapCardsHtml = CURRICULUM_DATA.map((t, idx) => {
      const status = Database.getTopicStatus(user.id, t.id);
      const isRead = prog.readTopics?.includes(t.id) || false;
      const isExDone = (prog.completedExercises?.includes(t.exerciseId) || false) && ((prog.scores?.[t.exerciseId] || 0) >= 100);
      const score = prog.scores?.[t.exerciseId] || 0;

      let statusBadge = "";
      let nodeClass = "";
      if (status === "completed") {
        completedCount++;
        nodeClass = "node-completed";
        statusBadge = `<span class="badge badge-success">✓ 100% Completado</span>`;
      } else if (status === "unlocked") {
        unlockedCount++;
        nodeClass = "node-unlocked";
        statusBadge = `<span class="badge badge-primary">🔓 En Curso</span>`;
      } else {
        lockedCount++;
        nodeClass = "node-locked";
        statusBadge = `<span class="badge badge-secondary">🔒 Bloqueado</span>`;
      }

      return `
        <div class="roadmap-card ${nodeClass}">
          <div class="rm-header">
            <span class="rm-step-index">#${idx + 1}</span>
            <span class="rm-code">${t.code}</span>
            ${statusBadge}
          </div>
          <h5>${t.title}</h5>
          <div class="rm-checks">
            <div class="rm-check-item ${isRead ? 'checked' : ''}">
              <span>${isRead ? '✓' : '○'} 1. Lectura teórica</span>
            </div>
            <div class="rm-check-item ${isExDone ? 'checked' : ''}">
              <span>${isExDone ? '✓' : '○'} 2. Laboratorio (${score}/100 pts)</span>
            </div>
          </div>
          <div class="rm-action">
            ${status !== 'locked' ? `
              <button class="btn btn-primary btn-sm btn-roadmap-go" data-topic="${t.id}">
                ${status === 'completed' ? 'Repasar Tema' : 'Continuar Tema'} &rarr;
              </button>
            ` : `
              <span class="rm-locked-msg"><i class="icon">🔒</i> Bloqueado</span>
            `}
          </div>
        </div>
      `;
    }).join("");

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

        <!-- Barra de Estado del Desbloqueo Secuencial -->
        <div class="unlock-status-overview-card">
          <div class="uso-header">
            <h3><i class="icon">🗺️</i> Ruta de Desbloqueo Secuencial del Temario (20 Temas)</h3>
            <p>El portal implementa una progresión pedagógica estricta: cada tema se desbloquea en automático únicamente cuando el anterior alcanza el <strong>100% de lectura</strong> y <strong>100/100 en el laboratorio</strong>.</p>
          </div>
          <div class="uso-stats-pills">
            <div class="uso-pill pill-completed">
              <span class="u-num">${completedCount}</span>
              <span class="u-lbl">Temas Completados al 100%</span>
            </div>
            <div class="uso-pill pill-unlocked">
              <span class="u-num">${unlockedCount}</span>
              <span class="u-lbl">Temas en Curso / Desbloqueados</span>
            </div>
            <div class="uso-pill pill-locked">
              <span class="u-num">${lockedCount}</span>
              <span class="u-lbl">Temas Restantes Bloqueados</span>
            </div>
          </div>

          <div class="roadmap-grid-container">
            ${roadmapCardsHtml}
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
            "${prog.generalFeedback || 'Continúa completando tus lecturas y laboratorios tema por tema para desbloquear la totalidad del curso.'}"
            <footer>— Ing. Luis Garibaldi, Profesor Titular y Super Administrador</footer>
          </blockquote>
        </div>
      </div>
    `;

    container.querySelectorAll(".btn-roadmap-go").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedTopicId = btn.dataset.topic;
        this.switchTab("tab_units");
      });
    });
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
