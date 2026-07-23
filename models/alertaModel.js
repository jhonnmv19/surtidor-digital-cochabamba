import { supabase } from '../config/supabase.js';

export const AlertaModel = {
  alertasMock: [
    { id: 1, titulo: 'Tanque GE Bajo', detalle: 'Nivel crítico 12%', hora: '08:45 AM', tipo: 'critical' },
    { id: 2, titulo: 'Surtidor #3 Mantenimiento', detalle: 'Requiere revisión', hora: '07:30 AM', tipo: 'warning' },
    { id: 3, titulo: 'Tanque GNV al 25%', detalle: 'Nivel bajo detectado', hora: '06:15 AM', tipo: 'info' }
  ],

  async getAlertasActivas() {
    const { data, error } = await supabase.from('alertas').select('*').eq('resuelta', false);
    if (error || !data || data.length === 0) return this.alertasMock;
    return data;
  }
};