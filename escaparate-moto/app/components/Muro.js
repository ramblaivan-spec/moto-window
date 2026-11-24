"use client";

import { useMemo, useState } from "react";
import { estilos, tendencias } from "../data/fichas";
import Rejilla from "./Rejilla";

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function Muro({ posts, onAbrir, nota }) {
  const [busqueda, setBusqueda] = useState("");
  const [estilo, setEstilo] = useState("");
  const [tendencia, setTendencia] = useState("");

  const resultados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return posts.filter((p) => {
      if (estilo && p.estilo !== estilo) return false;
      if (tendencia && !p.tendencias.includes(tendencia)) return false;
      if (q) {
        const texto = normalizar(
          [p.titulo, p.estilo, p.moto, p.tendencias.join(" "), p.autor || ""].join(" ")
        );
        if (!texto.includes(q)) return false;
      }
      return true;
    });
  }, [posts, busqueda, estilo, tendencia]);

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
          placeholder="Buscar estilo, moto, tendencia o usuario"
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

      {nota && <p className="nota">{nota}</p>}

      {resultados.length === 0 ? (
        <p className="vacio">
          No hay nada con esos filtros. Prueba a quitar alguno.
        </p>
      ) : (
        <Rejilla posts={resultados} onAbrir={onAbrir} />
      )}
    </section>
  );
}
