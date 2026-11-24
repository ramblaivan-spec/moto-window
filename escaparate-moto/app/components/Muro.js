"use client";

import { useMemo, useState } from "react";
import { fichas, estilos, tendencias } from "../data/fichas";

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function Silueta() {
  return (
    <svg viewBox="0 0 200 110" aria-hidden="true" className="silueta">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="36" cy="78" r="24" />
        <circle cx="166" cy="78" r="24" />
        <path d="M36 78 L70 42 H108 L128 56 L166 78 M70 42 L84 78 H116 L128 56 M58 38 H80 M126 40 L142 30 H156 M108 42 L100 30 H78 L70 42" />
      </g>
    </svg>
  );
}

export default function Muro() {
  const [busqueda, setBusqueda] = useState("");
  const [estilo, setEstilo] = useState("");
  const [tendencia, setTendencia] = useState("");

  const resultados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return fichas.filter((f) => {
      if (estilo && f.estilo !== estilo) return false;
      if (tendencia && !f.tendencias.includes(tendencia)) return false;
      if (q) {
        const texto = normalizar(
          [f.titulo, f.estilo, f.motos, f.tendencias.join(" ")].join(" ")
        );
        if (!texto.includes(q)) return false;
      }
      return true;
    });
  }, [busqueda, estilo, tendencia]);

  const hayFiltros = busqueda || estilo || tendencia;

  function limpiar() {
    setBusqueda("");
    setEstilo("");
    setTendencia("");
  }

  return (
    <section>
      <div className="buscador">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar estilo, moto o tendencia"
          aria-label="Buscar"
        />
      </div>

      <div className="filtros" role="group" aria-label="Filtrar por estilo">
        <button
          type="button"
          className="chip"
          aria-pressed={estilo === ""}
          onClick={() => setEstilo("")}
        >
          Todos
        </button>
        {estilos.map((e) => (
          <button
            key={e}
            type="button"
            className="chip"
            aria-pressed={estilo === e}
            onClick={() => setEstilo(estilo === e ? "" : e)}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="filtros" role="group" aria-label="Filtrar por tendencia">
        {tendencias.map((t) => (
          <button
            key={t}
            type="button"
            className="chip chip-suave"
            aria-pressed={tendencia === t}
            onClick={() => setTendencia(tendencia === t ? "" : t)}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="contador">
        {resultados.length}{" "}
        {resultados.length === 1 ? "resultado" : "resultados"}
        {hayFiltros && (
          <button type="button" className="limpiar" onClick={limpiar}>
            Quitar filtros
          </button>
        )}
      </p>

      {resultados.length === 0 ? (
        <p className="vacio">
          No hay nada con esos filtros. Prueba a quitar alguno.
        </p>
      ) : (
        <div className="muro">
          {resultados.map((f) => (
            <article key={f.id} className="tarjeta">
              <div
                className={`imagen tono-${f.tono}`}
                style={{ aspectRatio: `1 / ${f.alto}` }}
              >
                <Silueta />
              </div>
              <div className="pie">
                <b>{f.titulo}</b>
                <span>{f.estilo}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
