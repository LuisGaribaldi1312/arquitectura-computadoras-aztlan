/**
 * SERVICIO DE AUTENTICACIÓN Y CONTROL DE ACCESO ESTRICTO (RBAC)
 * Asignatura: Arquitectura de Computadoras - Universidad Aztlán
 * Profesor Titular: Ing. Luis Garibaldi
 */

const AuthService = {
  CURRENT_USER_KEY: "AZTLAN_CURRENT_USER_SESSION",
  authListeners: [],

  init() {
    const raw = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!raw) {
      // Por defecto, iniciar con la sesión del Profesor Titular
      const defaultUser = Database.getDefaultUsers()[0];
      this.setCurrentUser(defaultUser);
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      const defaultUser = Database.getDefaultUsers()[0];
      this.setCurrentUser(defaultUser);
      return defaultUser;
    }
  },

  getCurrentUser() {
    const raw = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!raw) return this.init();
    try {
      return JSON.parse(raw);
    } catch {
      return this.init();
    }
  },

  setCurrentUser(user) {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    this.notify(user);
  },

  // Validación de inicio de sesión con contraseña
  login(email, password) {
    const data = Database.getData();
    const user = data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: "El correo electrónico no pertenece al dominio @aztlan.edu.mx" };
    }
    if (user.password !== password) {
      return { success: false, message: "Contraseña institucional incorrecta." };
    }
    this.setCurrentUser(user);
    return { success: true, user: user };
  },

  // Cambio de usuario con validación de seguridad
  switchUser(targetUserId, providedPassword = null) {
    const data = Database.getData();
    const targetUser = data.users.find(u => u.id === targetUserId);
    if (!targetUser) return { success: false, message: "Usuario no encontrado." };

    const currentUser = this.getCurrentUser();

    // Si un alumno intenta cambiar a la cuenta de Super Administrador, exigir contraseña
    if (targetUser.role === "admin" && currentUser.role !== "admin") {
      if (!providedPassword) {
        return { 
          success: false, 
          needsPassword: true, 
          message: "Acceso protegido: Ingresa la contraseña del Super Administrador (Ing. Luis Garibaldi)." 
        };
      }
      if (providedPassword !== targetUser.password) {
        return { 
          success: false, 
          needsPassword: true, 
          message: "Contraseña de Super Administrador incorrecta." 
        };
      }
    }

    this.setCurrentUser(targetUser);
    return { success: true, user: targetUser };
  },

  logout() {
    // Si sale de sesión, regresar al login o usuario alumno por defecto
    const students = Database.getDefaultUsers().filter(u => u.role === "student");
    this.setCurrentUser(students[0]);
    return students[0];
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "admin";
  },

  isStudent() {
    const user = this.getCurrentUser();
    return user && user.role === "student";
  },

  // Reglas de permisos estrictos del sistema (RBAC)
  getPermissions() {
    const isAdmin = this.isAdmin();
    return {
      canViewTeacherDashboard: isAdmin,
      canModifyGrades: isAdmin,
      canEditTeacherFeedback: isAdmin,
      canPrintOfficialActs: isAdmin,
      canManageUsers: isAdmin,
      canImportDatabase: isAdmin,
      canExportDatabase: true, // Alumnos pueden respaldar sus propios progresos
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
