// controllers/authController.js
export const AuthController = {
  isAuthenticated() {
    return localStorage.getItem('scada_session') === 'true';
  },

  async login(email, password) {
    // Si usas Supabase Auth:
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    // if (error) return false;

    // Si es simulación local:
    localStorage.setItem('scada_session', 'true');
    return true;
  },

  logout() {
    localStorage.removeItem('scada_session');
  }
};