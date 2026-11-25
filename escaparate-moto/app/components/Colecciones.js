"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Rejilla from "./Rejilla";

// Panel dentro de una publicación: elegir en qué colecciones está.
export function GuardarEnColeccion({ post, usuario }) {
  const [abierto, setAbierto] = useState(false);
  const [cols, setCols] = useState([]);
  const [dentro, setDentro] = useState(new Set());
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    const c = await supabase
      .from("colecciones")
      .select("id,nombre")
      .eq("user_id", usuario.id)
      .order("created_at", { ascending: false });
    setCols(c.data || []);
    const d = await supabase.from("coleccion_posts").select("coleccion_id").eq("post_id", post.id);
    setDentro(new Set((d.data || []).map((x) => x.coleccion_id)));
  }, [post.id, usuario.id]);

  useEffect(() => {
    if (abierto) cargar();
  }, [abierto, cargar]);

  async function alternar(c) {
    setError("");
    const esta = dentro.has(c.id);
    const sig = new Set(dentro);
    if (esta) sig.delete(c.id);
    else sig.add(c.id);
    setDentro(sig);
    const { error: err } = esta
      ? await supabase.from("coleccion_posts").delete().eq("coleccion_id", c.id).eq("post_id", post.id)
      : await supabase.from("coleccion_posts").insert({ coleccion_id: c.id, post_id: post.id });
    if (err) {
      setError("No se pudo guardar.");
      cargar();
    }
  }

  async function crear(e) {
    e.preventDefault();
    const n = nombre.trim();
    if (!n) return;
    setError("");
    const { data, error: err } = await supabase
      .from("colecciones")
      .insert({ nombre: n, user_id: usuario.id })
      .select("id,nombre")
      .single();
    if (err || !data) {
      setError("No se pudo crear la colección.");
      return;
    }
    const r = await supabase.from("coleccion_posts").insert({ coleccion_id: data.id, post_id: post.id });
    if (r.error) setError("Colección creada, pero no se pudo añadir la foto.");
    setNombre("");
    cargar();
  }

  return (
    <div className="col-panel">
      <button type="button" onClick={() => setAbierto(!abierto)} aria-expanded={abierto}>
        + Colección
      </button>
      {abierto && (
        <div className="col-lista">
          {cols.length === 0 && <p className="nota">Aún no tienes colecciones. Crea la primera.</p>}
          {cols.map((c) => (
            <label key={c.id} className="col-fila">
              <input type="checkbox" checked={dentro.has(c.id)} onChange={() => alternar(c)} />
              {c.nombre}
            </label>
          ))}
          <form onSubmit={crear} className="form-comentario">
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nueva colección"
              maxLength={60}
              aria-label="Nombre de la nueva colección"
            />
            <button type="submit" className="accion">
              Crear
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}

// Vista "Colecciones": listado propio y contenido de cada una.
export function VistaColecciones({ usuario, posts, onAbrir }) {
  const [cols, setCols] = useState(null);
  const [items, setItems] = useState({}); // coleccion_id -> [post_id]
  const [activa, setActiva] = useState(null);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    const c = await supabase
      .from("colecciones")
      .select("id,nombre,publica")
      .eq("user_id", usuario.id)
      .order("created_at", { ascending: false });
    if (c.error) {
      setError("No se pudieron cargar tus colecciones.");
      setCols([]);
      return;
    }
    setCols(c.data || []);
    const ids = (c.data || []).map((x) => x.id);
    const mapa = {};
    if (ids.length) {
      const p = await supabase.from("coleccion_posts").select("coleccion_id,post_id").in("coleccion_id", ids);
      (p.data || []).forEach((r) => {
        (mapa[r.coleccion_id] = mapa[r.coleccion_id] || []).push(r.post_id);
      });
    }
    setItems(mapa);
  }, [usuario.id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function cambiarPublica(c) {
    const { error: err } = await supabase.from("colecciones").update({ publica: !c.publica }).eq("id", c.id);
    if (err) setError("No se pudo cambiar.");
    cargar();
  }

  async function borrar(c) {
    if (!window.confirm(`¿Borrar la colección "${c.nombre}"? Las fotos no se borran.`)) return;
    const { error: err } = await supabase.from("colecciones").delete().eq("id", c.id);
    if (err) setError("No se pudo borrar.");
    setActiva(null);
    cargar();
  }

  if (cols === null) return <p className="vacio">Cargando…</p>;

  const actual = cols.find((c) => c.id === activa);
  if (actual) {
    const ids = new Set(items[actual.id] || []);
    const lista = posts.filter((p) => ids.has(p.id));
    return (
      <section>
        <button type="button" className="enlace-marca" onClick={() => setActiva(null)}>
          ← Colecciones
        </button>
        <h2 className="titulo-vista">{actual.nombre}</h2>
        <p className="nota">
          {actual.publica ? "Pública: cualquiera con el enlace de tu garaje podrá verla." : "Privada: solo tú la ves."}
        </p>
        <div className="acciones">
          <button type="button" onClick={() => cambiarPublica(actual)}>
            {actual.publica ? "Hacer privada" : "Hacer pública"}
          </button>
          <button type="button" onClick={() => borrar(actual)}>
            Borrar colección
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {lista.length === 0 ? (
          <p className="vacio">Esta colección está vacía. Abre una foto y pulsa "+ Colección".</p>
        ) : (
          <Rejilla posts={lista} onAbrir={onAbrir} />
        )}
      </section>
    );
  }

  return (
    <section>
      <h2 className="titulo-vista">Colecciones</h2>
      {error && <p className="error">{error}</p>}
      {cols.length === 0 ? (
        <p className="vacio">Aún no tienes colecciones. Abre una foto y pulsa "+ Colección" para crear la primera.</p>
      ) : (
        <ul className="col-grid">
          {cols.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => setActiva(c.id)}>
                <b>{c.nombre}</b>
                <span>
                  {(items[c.id] || []).length} · {c.publica ? "pública" : "privada"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
