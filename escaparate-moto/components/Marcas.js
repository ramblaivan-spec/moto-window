"use client";

import { useMemo, useState } from "react";
import { secciones } from "../data/fichas";
import { marcasInfo } from "../data/marcasInfo";
import Rejilla from "./Rejilla";
import "./marcas.css";

function normalizar(t) {
  return (t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function Marcas({ posts, siguiendo, onMarca, onSeguir }) {
  const [q, setQ] = useState("");

  const cuentas = useMemo(() => {
    const c = {};
    posts.forEach((p) => {
      const k = normalizar(p.marca);
      if (k) c[k] = (c[k] || 0) + 1;
    });
    return c;
  }, [posts]);

  const buscar = normalizar(q.trim());

  const gruposSeguidos = useMemo(() => {
    const usadas = new Set();
    const res = [];
    secciones.forEach((sec) =>
      sec.grupos.forEach((g) => {
        const lista = g.marcas.filter((m) => siguiendo.has(m));
        lista.forEach((m) => usadas.add(m));
        if (lista.length) res.push({ nombre: g.nombre, marcas: lista });
      })
    );
    const otras = [...siguiendo].filter((m) => !usadas.has(m)).sort((a, b) => a.localeCompare(b, "es"));
    if (otras.length) res.push({ nombre: "Otras", marcas: otras });
    return res;
  }, [siguiendo]);

  return (
    <section>
      <h2 className="titulo-vista">Marcas</h2>
      <div className="buscador">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar marca"
          aria-label="Buscar marca"
        />
      </div>

      {siguiendo.size > 0 && (
        <div className="siguiendo-bloque">
          <h3 className="titulo-siguiendo">Marcas que sigues</h3>
          {gruposSeguidos.map((g) => (
            <div key={g.nombre} className="grupo-marcas">
              <h3>{g.nombre}</h3>
              <div className="lista-marcas">
                {g.marcas.map((m) => (
                  <span key={m} className="marca-item siguiendo">
                    <button type="button" className="marca-nombre" onClick={() => onMarca(m)}>
                      {m}
                    </button>
                    <button
                      type="button"
                      className="marca-quitar"
                      aria-label={`Dejar de seguir ${m}`}
                      onClick={() => onSeguir(m)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {secciones.map((s) =>
        s.grupos.map((g) => {
          const lista = g.marcas.filter((m) => !buscar || normalizar(m).includes(buscar));
          if (lista.length === 0) return null;
          return (
            <div key={s.id + g.nombre} className="grupo-marcas">
              <h3>{g.nombre}</h3>
              <div className="lista-marcas">
                {lista.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="marca-item"
                    onClick={() => onMarca(m)}
                  >
                    {m}
                    {siguiendo.has(m) && <i> · sigues</i>}
                    {cuentas[normalizar(m)] ? <em>{cuentas[normalizar(m)]}</em> : null}
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}

export function PaginaMarca({ nombre, posts, siguiendo, onSeguir, onAbrir, onVolver }) {
  const info = marcasInfo[nombre];
  return (
    <section>
      <button type="button" className="volver" onClick={onVolver}>
        ← Marcas
      </button>
      <h2 className="titulo-vista">{nombre}</h2>

      {info ? (
        <div className="ficha-marca">
          <p>{info.texto}</p>
          {info.origen && <p className="nota">Origen: {info.origen}</p>}
          {info.web && (
            <a href={info.web} target="_blank" rel="noopener noreferrer" className="enlace-tienda">
              Web oficial
            </a>
          )}
        </div>
      ) : (
        <p className="nota">Ficha en preparación.</p>
      )}

      <p>
        <button type="button" className="seguir" aria-pressed={siguiendo} onClick={onSeguir}>
          {siguiendo ? "Siguiendo" : "Seguir marca"}
        </button>
      </p>

      {posts.length === 0 ? (
        <p className="vacio">Todavía nadie ha subido nada de esta marca.</p>
      ) : (
        <Rejilla posts={posts} onAbrir={onAbrir} />
      )}
    </section>
  );
}
