"use client";

import { useEffect } from "react";

export default function Modal({ titulo, onCerrar, ancha, children }) {
  useEffect(() => {
    function tecla(e) {
      if (e.key === "Escape") onCerrar();
    }
    document.addEventListener("keydown", tecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = "";
    };
  }, [onCerrar]);

  return (
    <div
      className="fondo"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div
        className={`hoja${ancha ? " hoja-ancha" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <button type="button" className="cerrar" onClick={onCerrar}>
          Cerrar
        </button>
        {children}
      </div>
    </div>
  );
}
