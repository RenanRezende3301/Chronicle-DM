export const DATA_BACKEND =
  String(import.meta.env.VITE_DATA_BACKEND || 'legacy').toLowerCase() ===
  'supabase'
    ? 'supabase'
    : 'legacy'

export const usesSupabaseBackend = DATA_BACKEND === 'supabase'

export const AUTH_BACKEND =
  String(import.meta.env.VITE_AUTH_BACKEND || 'supabase').toLowerCase() ===
  'legacy'
    ? 'legacy'
    : 'supabase'

export const usesSupabaseAuth = AUTH_BACKEND === 'supabase'
