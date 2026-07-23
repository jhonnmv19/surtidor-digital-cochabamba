import { supabase } from '../config/supabase.js';

export const VentaModel = {
  ventasMock: [
    { id: 'V-1092', placa: '4059-FGR', cliente: 'Juan Pérez', combustible: 'Gasolina Especial', litros: '35.0 L', total: 'Bs 130.90', pago: 'QR', hora: '10:42 AM' },
    { id: 'V-1091', placa: '2831-ABC', cliente: 'María López', combustible: 'Diésel Oil', litros: '120.0 L', total: 'Bs 446.40', pago: 'Efectivo', hora: '10:38 AM' },
    { id: 'V-1090', placa: '1029-XYZ', cliente: 'Carlos Ruiz', combustible: 'GNV', litros: '18.5 L', total: 'Bs 30.71', pago: 'Efectivo', hora: '10:25 AM' },
    { id: 'V-1089', placa: '5541-BBB', cliente: 'Trans. Cochabamba', combustible: 'Diésel Oil', litros: '250.0 L', total: 'Bs 930.00', pago: 'Tarjeta', hora: '10:11 AM' }
  ],

  async getUltimasVentas() {
    const { data, error } = await supabase.from('ventas').select('*').order('created_at', { ascending: false }).limit(5);
    if (error || !data || data.length === 0) return this.ventasMock;
    return data;
  }
};