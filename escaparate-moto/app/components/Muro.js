"use client";

import { useMemo, useState } from "react";
import { tipos, estilos, gruposMarcas, colecciones } from "../data/fichas";
import Rejilla from "./Rejilla";

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Dice si una publicación cumple los filtros. "saltar" ignora uno de ellos
// (se usa para contar cuántos resultados tendría cada marca o estilo).
function coincide(p, f, saltar) {
  if (f.mundo) {
    const enEstilo = f.mundo.estilos && f.mundo.estilos.includes(p.estilo);
    const enMarca = f.mundo.marcas && f.mundo.marcas.includes(p.marca);
    if (!enEstilo && !enMarca) return false;
  }
  if (saltar !== "tipo" && f.tipo && p.tipo !== f.tipo) return false;
  if (saltar !== "estilo" && f.estilo && p.estilo !== f.estilo) return false;
  if (saltar !== "marca" && f.marca && p.marca !== f.marca) return false;
  if (f.q) {
    const texto = normalizar(
      [p.titulo, p.marca, p.modelo, p.estilo, p.tipo, p.autor || ""].join(" ")
    );
    if (!texto.includes(f.q)) return false;
  }
  return true;
}

export default function Muro({ posts, onAbrir, nota }) {
  const [busqueda, setBusqueda] = useState("");
  const [mundoId, setMundoId] = useState("");
  const [tipo, setTipo] = useState("");
  const [estilo, setEstilo] = useState("");
  const [marca, setMarca] = useState("");

  const mundo = colecciones.find((c) => c.id === mundoId) || null;

  const f = useMemo(
    () => ({ q: normalizar(busqueda.trim()), mundo, tipo, estilo, marca }),
    [busqueda, mundo, tipo, estilo, marca]
  );

  const resultados = useMemo(() => posts.filter((p) => coincide(p, f)), [posts, f]);

  function contar(campo, valor) {
    return posts.filter((p) => coincide(p, f, campo) && p[campo] === valor).length;
  }

  function opcion(campo, valor, texto) {
    const n = contar(campo, valor);
    return (
      <option key={valor} value={valor}>
        {texto || valor}
        {n > 0 ? ` · ${n}` : ""}
      </option>
    );
  }

  const hayFiltros = busqueda || mundoId || tipo || estilo || marca;

  function limpiar() {
    setBusqueda("");
    setMundoId("");
    setTipo("");
    setEstilo("");
    setMarca("");
  }

  return (
    <section>
      <div className="buscador">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar moto, componente, marca o usuario"
          aria-label="Buscar"
        />
      </div>

      <div className="mundos-bloque">
        <p className="etiqueta">Mundos</p>
        <div className="mundos" role="group" aria-label="Mundos">
          <button
            type="button"
            className="chip"
            aria-pressed={mundoId === ""}
            onClick={() => setMundoId("")}
          >
            Todos
          </button>
          {colecciones.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={mundoId === c.id}
              onClick={() => setMundoId(mundoId === c.id ? "" : c.id)}
            >
              {c.nombre}
            </button>
          ))}
        </div>
        {mundo && <p className="mundo-texto">{mundo.texto}</p>}
      </div>

      <div className="desplegables">
        <label className="desplegable">
          <span>Tipo</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todo</option>
            {tipos.map((t) => opcion("tipo", t.valor, t.nombre))}
          </select>
        </label>

        <label className="desplegable">
          <span>Estilo</span>
          <select value={estilo} onChange={(e) => setEstilo(e.target.value)}>
            <option value="">Todos</option>
            {estilos.map((s) => opcion("estilo", s))}
          </select>
        </label>

        <label className="desplegable">
          <span>Marca</span>
          <select value={marca} onChange={(e) => setMarca(e.target.value)}>
            <option value="">Todas</option>
            {gruposMarcas.map((g) => (
              <optgroup key={g.nombre} label={g.nombre}>
                {g.marcas.map((m) => opcion("marca", m))}
              </optgroup>
            ))}
            {opcion("marca", "Otra")}
          </select>
        </label>
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
