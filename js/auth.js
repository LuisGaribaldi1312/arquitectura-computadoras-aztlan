/**
 * SERVICIO DE AUTENTICACIÓN INSTITUCIONAL Y CONTROL DE ACCESO (RBAC)
 * Centro de Estudios: Universidad Aztlán
 * Asignatura: Arquitectura de Computadoras (Clave 636)
 * Profesor Titular & Super Administrador: Ing. Luis Garibaldi
 */

const AuthService = {
  CURRENT_USER_KEY: "AZTLAN_CURRENT_USER_SESSION_v3",
  authListeners: [],

  init() {
    const raw = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!raw) {
      // Sin sesión iniciada: debe mostrar pantalla de login
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(this.CURRENT_USER_KEY);
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  getCurrentUser() {
    const raw = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
    this.notify(user);
  },

  // Inicio de sesión formal con correo institucional y contraseña
  login(email, password) {
    const data = Database.getData();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, message: "Por favor ingresa tanto tu correo institucional como tu contraseña." };
    }

    if (!cleanEmail.endsWith("@aztlan.edu.mx")) {
      return { success: false, message: "Acceso denegado: El correo debe pertenecer al dominio oficial @aztlan.edu.mx." };
    }

    const user = data.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: "Usuario no registrado en la lista de matrícula de la Universidad Aztlán." };
    }

    if (user.password !== cleanPass) {
      return { success: false, message: "Contraseña incorrecta. Verifica mayúsculas y caracteres especiales." };
    }

    // Registrar en auditoría
    data.auditLog.unshift({
      timestamp: new Date().toISOString(),
      userId: user.id,
      action: "LOGIN_SUCCESS",
      description: `Inicio de sesión exitoso como ${user.name} (${user.role === 'admin' ? 'Super Administrador' : 'Alumno'}).`
    });
    Database.save(data);

    this.setCurrentUser(user);
    return { success: true, user: user };
  },

  // Cierre formal de sesión
  logout() {
    const user = this.getCurrentUser();
    if (user) {
      const data = Database.getData();
      data.auditLog.unshift({
        timestamp: new Date().toISOString(),
        userId: user.id,
        action: "LOGOUT",
        description: `Sesión finalizada por ${user.name}.`
      });
      Database.save(data);
    }
    this.setCurrentUser(null);
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "admin";
  },

  isStudent() {
    const user = this.getCurrentUser();
    return user && user.role === "student";
  },

  // Matriz de permisos RBAC estricta
  getPermissions() {
    const isAdmin = this.isAdmin();
    return {
      canViewTeacherDashboard: isAdmin,
      canModifyGrades: isAdmin,
      canEditTeacherFeedback: isAdmin,
      canPrintOfficialActs: isAdmin,
      canManageUsers: isAdmin,
      canImportDatabase: isAdmin,
      canExportDatabase: true, // Alumnos pueden exportar su propio avance
      canViewAllStudentsProgress: isAdmin,
      canHostP2PRoom: isAdmin,
      canSolveExercises: true,
      canReadTheory: true,
      canViewOwnProgress: true
    };
  },

  onAuthChange(fn) {
    this.authListeners.push(fn);
  },

  notify(user) {
    this.authListeners.forEach(fn => fn(user));
  }
};
