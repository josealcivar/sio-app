import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// En modo prueba puede no haber credenciales. Solo creamos el cliente si existen,
// así la app no revienta al arrancar sin Supabase.
export const supabase = (url && key) ? createClient(url, key) : (null as any)