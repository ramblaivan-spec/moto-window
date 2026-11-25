"use client";

import { useState } from "react";

// Guía mínima para quien aún no tiene ninguna moto en su garaje.
export default function Bienvenida({ onAnadir }) {
  const [oculta, setOculta] = useState(false);
  if (oculta) return null;
  return (
    <section className="bienvenida" aria-label="Bienvenida">
      <h2>Bienvenido a Crank</h2>
      <p>Empieza por tu garaje: añade tu primera moto y podrás compartirlo con quien quieras.</p>
      <div className="bienvenida-acciones">
        <button type="button" className="accion" onClick={onAnadir}>
          Añadir mi primera moto
        </button>
        <button type="button" className="limpiar" onClick={() => setOculta(true)}>
          Ahora no
        </button>
      </div>
    </section>
  );
}
