import { supabase } from "./supabase";

// Registra un evento de uso (analítica mínima, sin cookies).
// Nunca lanza errores ni bloquea la app: si falla, se ignora.
export function registrar(evento, userId = null, unaVezPorSesion = false) {
  try {
    if (!supabase || typeof window === "undefined") return;
    const clave = "ev_" + evento;
    if (unaVezPorSesion) {
      try {
        if (window.sessionStorage.getItem(clave)) return;
      } catch (e) {
        /* sin almacenamiento: se registra igualmente */
      }
    }
    Promise.resolve(
      supabase
        .from("eventos")
        .insert({ evento, user_id: userId, ruta: window.location.pathname.slice(0, 200) })
    )
      .then(({ error }) => {
        if (!error && unaVezPorSesion) {
          try {
            window.sessionStorage.setItem(clave, "1");
          } catch (e) {
            /* ignorar */
          }
        }
      })
      .catch(() => {});
  } catch (e) {
    /* ignorar */
  }
}
