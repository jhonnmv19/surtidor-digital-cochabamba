// controllers/authController.js

export const AuthController = {
  // Verifica si el usuario inició sesión
  isAuthenticated() {
    return localStorage.getItem('scada_logged_in') === 'true';
  },

  // Iniciar sesión
  login() {
    localStorage.setItem('scada_logged_in', 'true');
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('scada_logged_in');
  }
};