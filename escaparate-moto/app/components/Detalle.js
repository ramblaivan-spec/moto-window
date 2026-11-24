"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Modal from "./Modal";

export default function Detalle({
  post,
  usuario,
  liked,
  onLike,
  onCerrar,
  onPerfil,
  onEliminar,
  onCambioComentarios,
}) {
  const [lista, setLista] = useState([]);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    const { data } = await supabase
      .from("comentarios")
      .select("id,texto,created_at,user_id,profiles(username)")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });
    setLista(data || []);
  }, [post.id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function comentar(e) {
    e.preventDefault();
    const t = texto.trim();
    if (!t) return;
    const { error: err } = await supabase
      .from("comentarios")
      .insert({ post_id: post.id, user_id: usuario.id, texto: t });
    if (err) {
      setError("No se pudo publicar el comentario.");
      return;
    }
    setTexto("");
    setError("");
    cargar();
    onCambioComentarios(post.id, 1);
  }

  async function borrar(id) {
    const { error: err } = await supabase.from("comentarios").delete().eq("id", id);
    if (!err) {
      setLista((l) => l.filter((c) => c.id !== id));
      onCambioComentarios(post.id, -1);
    }
  }

  const propio = usuario && usuario.id === post.autorId;

  return (
    <Modal titulo={post.titulo} onCerrar={onCerrar} ancha>
      <div className="det-img">
        <img src={post.imagen} alt={post.titulo} />
      </div>

      <div className="det-info">
        <div>
          <h3>{post.titulo}</h3>
          <p className="autor">
            de{" "}
            <button type="button" onClick={() => onPerfil(post.autorId)}>
              @{post.autor}
            </button>
          </p>
        </div>

        <dl>
          <dt>Tipo</dt>
          <dd>{post.tipo}</dd>
          {post.marca && (
            <>
              <dt>Marca</dt>
              <dd>{post.marca}</dd>
            </>
          )}
          {post.modelo && (
            <>
              <dt>Modelo</dt>
              <dd>{post.modelo}</dd>
            </>
          )}
          <dt>Estilo</dt>
          <dd>{post.estilo}</dd>
        </dl>

        <div className="acciones">
          <button type="button" onClick={() => onLike(post)} aria-pressed={liked}>
            {liked ? "♥ Te gusta" : "♡ Me gusta"} · {post.likes}
          </button>
          {propio && (
            <button type="button" onClick={() => onEliminar(post)}>
              Eliminar
            </button>
          )}
        </div>

        <div className="comentarios">
          <b>
            {lista.length} {lista.length === 1 ? "comentario" : "comentarios"}
          </b>
          <div className="lista-comentarios">
            {lista.map((c) => (
              <p key={c.id} className="comentario">
                <b>@{c.profiles ? c.profiles.username : "usuario"}</b> {c.texto}
                {usuario && usuario.id === c.user_id && (
                  <button type="button" className="borrar" onClick={() => borrar(c.id)}>
                    Borrar
                  </button>
                )}
              </p>
            ))}
          </div>

          {usuario ? (
            <form onSubmit={comentar} className="form-comentario">
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribe un comentario"
                maxLength={500}
                aria-label="Comentario"
              />
              <button type="submit" className="accion">
                Publicar
              </button>
            </form>
          ) : (
            <p className="nota">Entra para comentar.</p>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </Modal>
  );
}
