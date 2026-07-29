const SUPABASE_URL = 'https://isqitoojzjbsddedyfxs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3iw5wMvKlA5_BgqDxwwf8Q_op-MnUs9';

// Usa el objeto global window.supabase
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);