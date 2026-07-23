// Importación directa desde CDN compatible con ES Modules del navegador
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://isqitoojzjbsddedyfxs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3iw5wMvKlA5_BgqDxwwf8Q_op-MnUs9';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);