"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Escaparate({ nombre }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setPosts([]);
      return;
    }
    supabase
      .from("posts")
      .select("id,titulo,moto,imagen_url,ancho,alto")
      .ilike("marca", nombre)
      .order("created_at", { ascending: false })
      .limit(40)
      .then(({ data }) => setPosts(data || []));
  }, [nombre]);

  if (posts === null) return <p className="nota">Cargando…</p>;
  if (posts.length === 0)
    return (
      <p className="vacio">
        Todavía nadie ha subido nada de {nombre}. <a href="/">Entra en Crank</a> y sé el primero.
      </p>
    );

  return (
    <div className="muro">
      {posts.map((p) => (
        <a key={p.id} href="/" className="tarjeta tarjeta-boton">
          <div className="imagen" style={{ aspectRatio: `1 / ${p.ancho ? p.alto / p.ancho : 1}` }}>
            <img src={p.imagen_url} alt={p.titulo} loading="lazy" />
          </div>
          <div className="pie">
            <b>{p.titulo}</b>
            {p.moto && <span>{p.moto}</span>}
          </div>
        </a>
      ))}
    </div>
  );
}
