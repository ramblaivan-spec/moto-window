import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si faltan las claves, la web sigue funcionando con las fichas de ejemplo.
export const supabase = url && clave ? createClient(url, clave) : null;
