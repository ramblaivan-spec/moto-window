"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Rejilla from "./Rejilla";

export default function Perfil({ id, usuario, posts, onAbrir }) {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [bio, setBio] = useState("");

  const propio = usuario && usuario.id === id;

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("profiles")
      .select("username,bio")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setPerfil(data);
          setBio(data.bio || "");
        }
      });
  }, [id]);

  async function guardar() {
    const limpia = bio.trim().slice(0, 200);
    const { error } = await supabase.from("profiles").update({ bio: limpia }).eq("id", id);
    if (!error) {
      setPerfil((p) => ({ ...p, bio: limpia }));
      setEditando(false);
    }
  }

  return (
    <section className="perfil">
      <h2>@{perfil ? perfil.username : "…"}</h2>

      {editando ? (
        <div className="campo">
          <span>Sobre ti (hasta 200 caracteres)</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
          />
          <button type="button" className="accion" onClick={guardar}>
            Guardar
          </button>
        </div>
      ) : (
        <>
          {perfil && perfil.bio && <p className="bio">{perfil.bio}</p>}
          {propio && (
            <button type="button" className="accion" onClick={() => setEditando(true)}>
              {perfil && perfil.bio ? "Editar descripción" : "Añadir descripción"}
            </button>
          )}
        </>
      )}

      <p className="contador">
        {posts.length} {posts.length === 1 ? "publicación" : "publicaciones"}
      </p>

      {posts.length === 0 ? (
        <p className="vacio">
          {propio ? "Aún no has subido nada. Pulsa «Subir» para empezar." : "Aún no ha subido nada."}
        </p>
      ) : (
        <Rejilla posts={posts} onAbrir={onAbrir} />
      )}
    </section>
  );
}
