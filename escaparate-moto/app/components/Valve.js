"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { NOMBRE } from "../config";
import { fichas } from "../data/fichas";
import Muro from "./Muro";
import Auth from "./Auth";
import Subir from "./Subir";
import Detalle from "./Detalle";
import Perfil from "./Perfil";

function convertir(p) {
  return {
    id: p.id,
    titulo: p.titulo,
    estilo: p.estilo,
    tipo: p.tipo || "Moto",
    marca: p.marca || "",
    modelo: p.moto || "",
    motoDe: p.motos ? `${p.motos.marca} ${p.motos.modelo}` : "",
    imagen: p.imagen_url,
    imagenPath: p.imagen_path,
    ratio: p.ancho ? p.alto / p.ancho : 1,
    autor: p.profiles ? p.profiles.username : "anónimo",
    autorId: p.user_id,
    likes: p.likes && p.likes[0] ? p.likes[0].count : 0,
    comentarios: p.comentarios && p.comentarios[0] ? p.comentarios[0].count : 0,
  };
}

export default function Valve() {
  const [usuario, setUsuario] = useState(null);
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState("");
  const [modal, setModal] = useState(null); // "auth" | "subir" | null
  const [abierto, setAbierto] = useState(null);
  const [vista, setVista] = useState({ tipo: "muro" });
  const [misLikes, setMisLikes] = useState(new Set());

  const ejemplos = useMemo(
    () =>
      fichas.map((f) => ({
        id: "e" + f.id,
        titulo: f.titulo,
        estilo: f.estilo,
        tipo: f.tipo,
        marca: f.marca,
        modelo: f.modelo,
        ratio: f.alto,
        tono: f.tono,
        ejemplo: true,
        likes: 0,
        comentarios: 0,
      })),
    []
  );

  function avisar(texto) {
    setAviso(texto);
    setTimeout(() => setAviso(""), 2500);
  }

  // Sesión del usuario
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session ? data.session.user : null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setUsuario(sesion ? sesion.user : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Publicaciones
  const cargar = useCallback(async () => {
    if (!supabase) {
      setCargando(false);
      return;
    }
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id,titulo,estilo,tipo,marca,moto,imagen_url,imagen_path,ancho,alto,user_id,moto_id,created_at,profiles(username),motos(marca,modelo),likes(count),comentarios(count)"
      )
      .order("created_at", { ascending: false })
      .limit(80);
   if (error) avisar("Error: " + error.message);
    else setPosts(data.map(convertir));
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Mis me gusta
  const cargarLikes = useCallback(async () => {
    if (!supabase || !usuario) {
      setMisLikes(new Set());
      return;
    }
    const { data } = await supabase.from("likes").select("post_id").eq("user_id", usuario.id);
    setMisLikes(new Set((data || []).map((l) => l.post_id)));
  }, [usuario]);

  useEffect(() => {
    cargarLikes();
  }, [cargarLikes]);

  async function alternarLike(post) {
    if (!usuario) {
      setModal("auth");
      return;
    }
    const tiene = misLikes.has(post.id);
    const siguiente = new Set(misLikes);
    if (tiene) siguiente.delete(post.id);
    else siguiente.add(post.id);
    setMisLikes(siguiente);
    setPosts((ps) =>
      ps.map((p) => (p.id === post.id ? { ...p, likes: p.likes + (tiene ? -1 : 1) } : p))
    );
    const { error } = tiene
      ? await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", usuario.id)
      : await supabase.from("likes").insert({ post_id: post.id, user_id: usuario.id });
    if (error) {
      avisar("No se pudo guardar el me gusta.");
      cargar();
      cargarLikes();
    }
  }

  async function eliminar(post) {
    if (!window.confirm("¿Eliminar esta publicación?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      avisar("No se pudo eliminar.");
      return;
    }
    if (post.imagenPath) {
      await supabase.storage.from("fotos").remove([post.imagenPath]);
    }
    setAbierto(null);
    cargar();
    avisar("Publicación eliminada");
  }

  function cambioComentarios(id, delta) {
    setPosts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, comentarios: Math.max(0, p.comentarios + delta) } : p))
    );
  }

  async function salir() {
    await supabase.auth.signOut();
    setVista({ tipo: "muro" });
    setMisLikes(new Set());
  }

  function irAPerfil(id) {
    setAbierto(null);
    setVista({ tipo: "perfil", id });
    window.scrollTo(0, 0);
  }

  const hayReales = posts.length > 0;
  const postsMuro = cargando ? [] : hayReales ? posts : ejemplos;
  const nota =
    !cargando && !hayReales
      ? "Estas son fichas de ejemplo. Cuando la comunidad suba sus fotos, aparecerán aquí."
      : "";
  const postAbierto = posts.find((p) => p.id === abierto);

  return (
    <>
      <header className="cabecera">
        <button type="button" className="logo" onClick={() => setVista({ tipo: "muro" })}>
          {NOMBRE}
        </button>
        <nav className="menu" aria-label="Principal">
          <button
            type="button"
            className="destacado"
            onClick={() => setModal(usuario ? "subir" : "auth")}
          >
            Subir
          </button>
          {usuario ? (
            <>
              <button type="button" onClick={() => irAPerfil(usuario.id)}>
                Perfil
              </button>
              <button type="button" onClick={salir}>
                Salir
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setModal("auth")}>
              Entrar
            </button>
          )}
        </nav>
      </header>

      <main className="principal">
        {vista.tipo === "muro" ? (
          <Muro posts={postsMuro} onAbrir={setAbierto} nota={nota} />
        ) : (
          <Perfil
            id={vista.id}
            usuario={usuario}
            posts={posts.filter((p) => p.autorId === vista.id)}
            onAbrir={setAbierto}
          />
        )}
      </main>

      {modal === "auth" && (
        <Auth
          onCerrar={() => setModal(null)}
          onListo={() => {
            setModal(null);
            avisar("Sesión iniciada");
          }}
        />
      )}

      {modal === "subir" && usuario && (
        <Subir
          usuario={usuario}
          onCerrar={() => setModal(null)}
          onListo={() => {
            setModal(null);
            cargar();
            avisar("Foto publicada");
          }}
        />
      )}

      {postAbierto && (
        <Detalle
          key={postAbierto.id}
          post={postAbierto}
          usuario={usuario}
          liked={misLikes.has(postAbierto.id)}
          onLike={alternarLike}
          onCerrar={() => setAbierto(null)}
          onPerfil={irAPerfil}
          onEliminar={eliminar}
          onCambioComentarios={cambioComentarios}
        />
      )}

      {aviso && <div className="aviso">{aviso}</div>}
    </>
  );
}
