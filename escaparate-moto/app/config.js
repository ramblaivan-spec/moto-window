export const NOMBRE = "Crank";
export const SITIO = "https://crank-elx.pages.dev";

// Datos del responsable para los textos legales.
// Rellenar antes de abrir el registro al público. Mientras estén vacíos,
// las páginas legales se marcan como borrador y no se indexan.
export const LEGAL = {
  titular: "Crank project", // nombre del responsable (persona o proyecto)
  nif: "", // opcional: solo si hay actividad económica
  domicilio: "", // opcional: solo si hay actividad económica
  email: "crank.contact@proton.me", // contacto para privacidad y soporte
  actualizado: "25 de noviembre de 2026",
};

export const LEGAL_COMPLETO = Boolean(LEGAL.titular && LEGAL.email);
