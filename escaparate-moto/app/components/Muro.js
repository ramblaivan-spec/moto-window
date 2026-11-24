"use client";

import { useMemo, useState } from "react";
import { secciones } from "../data/fichas";
import Rejilla from "./Rejilla";

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function Muro({ posts, onAbrir, nota }) {
  const [busqueda, setBusqueda] = useState("");
  const [seccionId, setSeccionId] = useState("");

  const seccion = secciones.find((x) => x.id === seccionId) || null;

  const resultados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return posts.filter((p) => {
      if (seccion && !seccion.tipos.includes(p.tipo)) return false;
      if (!q) return true;
      const texto = normalizar(
        [p.titulo, p.marca, p.modelo, p.motoDe || "", p.estilo || "", p.tipo, p.autor || ""].join(" ")
      );
      return texto.includes(q);
    });
  }, [posts, seccion, busqueda]);

  const hayFiltros = busqueda || seccionId;

  function limpiar() {
    setBusqueda("");
    setSeccionId("");
  }

  return (
    <section>
      <div className="buscador">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar moto, accesorio, prenda, marca o usuario"
          aria-label="Buscar"
        />
      </div>

      <div className="secciones" role="group" aria-label="Secciones">
        <button type="button" className="chip" aria-pressed={seccionId === ""} onClick={() => setSeccionId("")}>
          Todo
        </button>
        {secciones.map((x) => (
          <button
            key={x.id}
            type="button"
            className="chip"
            aria-pressed={seccionId === x.id}
            onClick={() => setSeccionId(seccionId === x.id ? "" : x.id)}
          >
            {x.nombre}
          </button>
        ))}
      </div>

      <p className="contador">
        {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
        {hayFiltros && (
          <button type="button" className="limpiar" onClick={limpiar}>
            Quitar filtros
          </button>
        )}
      </p>

      {nota && <p className="nota">{nota}</p>}

      {resultados.length === 0 ? (
        <p className="vacio">No hay nada con esa búsqueda. Prueba con otra palabra.</p>
      ) : (
        <Rejilla posts={resultados} onAbrir={onAbrir} />
      )}
    </section>
  );
}
