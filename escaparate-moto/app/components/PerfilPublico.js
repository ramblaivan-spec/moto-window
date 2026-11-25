"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { NOMBRE } from "../config";
import "./marcas.css";

// Página pública de solo lectura: /garaje?u=<usuario>
export default function PerfilPublico() {
  const [estado, setEstado] = useState("cargando"); // cargando | ok | no_existe | error
  const [perfil, setPerfil] = useState(null);
  const [motos, setMotos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [colecciones, setColecciones] = useState([]); // [{id, nombre, descripcion, posts:[...]}]

  useEffect(() => {
    const u = (new URLSearchParams(window.location.search).get("u") || "").trim().toLowerCase();
    if (!u || !supabase) {
      setEstado(u ? "error" : "no_existe");
      return;
    }
    (async () => {
      const { data: p, error } = await supabase
        .from("profiles")
        .select("id,username,bio")
        .eq("username", u)
        .maybeSingle();
      if (error) return setEstado("error");
      if (!p) return setEstado("no_existe");
      const [m, po] = await Promise.all([
        supabase
          .from("motos")
          .select("id,marca,modelo,anio,imagen_url")
          .eq("user_id", p.id)
          .order("created_at"),
        supabase
          .from("posts")
          .select("id,titulo,marca,moto,imagen_url,ancho,alto")
          .eq("user_id", p.id)
          .order("created_at", { ascending: false })
          .limit(40),
      ]);
      // Colecciones públicas (si algo falla, simplemente no se muestran)
      try {
        const c = await supabase
          .from("colecciones")
          .select("id,nombre,descripcion")
          .eq("user_id", p.id)
          .eq("publica", true)
          .order("created_at", { ascending: false });
        const cols = c.data || [];
        if (cols.length) {
          const cp = await supabase
            .from("coleccion_posts")
            .select("coleccion_id,post_id")
            .in("coleccion_id", cols.map((x) => x.id));
          const ids = [...new Set((cp.data || []).map((x) => x.post_id))];
          const pp = ids.length
            ? await supabase.from("posts").select("id,titulo,moto,imagen_url,ancho,alto").in("id", ids)
            : { data: [] };
          const porId = new Map((pp.data || []).map((x) => [x.id, x]));
          setColecciones(
            cols
              .map((x) => ({
                ...x,
                posts: (cp.data || [])
                  .filter((r) => r.coleccion_id === x.id)
                  .map((r) => porId.get(r.post_id))
                  .filter(Boolean),
              }))
              .filter((x) => x.posts.length > 0)
          );
        }
      } catch (e) {
        setColecciones([]);
      }
      setPerfil(p);
      setMotos(m.data || []);
      setPosts(po.data || []);
      setEstado("ok");
    })();
  }, []);

  return (
    <>
      <header className="cabecera">
        <a className="logo" href="/">
          {NOMBRE}
        </a>
        <nav className="menu" aria-label="Principal">
          <a href="/muro">Muro</a>
        </nav>
      </header>
      <main className="principal">
        {estado === "cargando" && <p className="nota">Cargando…</p>}
        {estado === "error" && <p className="nota">No se ha podido cargar este garaje. Inténtalo más tarde.</p>}
        {estado === "no_existe" && (
          <p className="nota">
            Este garaje no existe. <a href="/muro">Ir al muro</a>
          </p>
        )}
        {estado === "ok" && (
          <section className="perfil">
            <h1 className="titulo-vista">@{perfil.username}</h1>
            {perfil.bio && <p className="bio">{perfil.bio}</p>}

            <div className="garaje">
              <h2>Garaje</h2>
              {motos.length === 0 ? (
                <p className="vacio">Aún no ha registrado ninguna moto.</p>
              ) : (
                <ul className="motos">
                  {motos.map((m) => (
                    <li key={m.id}>
                      {m.imagen_url && <img src={m.imagen_url} alt={`${m.marca} ${m.modelo}`} loading="lazy" />}
                      <b>
                        {m.marca} {m.modelo}
                      </b>
                      {m.anio && <span>{m.anio}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {posts.length > 0 && (
              <>
                <h2 className="titulo-vista">Publicaciones</h2>
                <div className="muro">
                  {posts.map((p) => (
                    <article key={p.id} className="tarjeta">
                      <div className="imagen" style={{ aspectRatio: `1 / ${p.ancho ? p.alto / p.ancho : 1}` }}>
                        <img src={p.imagen_url} alt={p.titulo} loading="lazy" />
                      </div>
                      <div className="pie">
                        <b>{p.titulo}</b>
                        {p.moto && <span>{p.moto}</span>}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {colecciones.map((c) => (
              <div key={c.id}>
                <h2 className="titulo-vista">{c.nombre}</h2>
                {c.descripcion && <p className="nota">{c.descripcion}</p>}
                <div className="muro">
                  {c.posts.map((p) => (
                    <article key={p.id} className="tarjeta">
                      <div className="imagen" style={{ aspectRatio: `1 / ${p.ancho ? p.alto / p.ancho : 1}` }}>
                        <img src={p.imagen_url} alt={p.titulo} loading="lazy" />
                      </div>
                      <div className="pie">
                        <b>{p.titulo}</b>
                        {p.moto && <span>{p.moto}</span>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}

            <p style={{ marginTop: 32 }}>
              <a className="enlace-tienda" href="/muro">
                Crea tu garaje en Crank
              </a>
            </p>
          </section>
        )}
      </main>
    </>
  );
}
