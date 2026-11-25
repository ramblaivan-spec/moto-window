export const NOMBRE = "Crank";
export const SITIO = "https://crank-elx.pages.dev";

// Datos del responsable para los textos legales.
// Rellenar antes de abrir el registro al público. Mientras estén vacíos,
// las páginas legales se marcan como borrador y no se indexan.
export const LEGAL = {
  titular: "", // nombre y apellidos o razón social
  nif: "", // NIF/DNI
  domicilio: "", // dirección postal
  email: "", // correo de contacto para privacidad y soporte
  actualizado: "25 de noviembre de 2026",
};

export const LEGAL_COMPLETO = Boolean(LEGAL.titular && LEGAL.nif && LEGAL.domicilio && LEGAL.email);
