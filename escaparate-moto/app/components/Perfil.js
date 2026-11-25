"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Rejilla from "./Rejilla";
import { registrar } from "../lib/eventos";
import { reducir } from "../lib/imagen";

export default function Perfil({ id, usuario, posts, onAbrir }) {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [bio, setBio] = useState("");

  const propio = usuario && usuario.id === id;

  const [motos, setMotos] = useState([]);
  const [anadiendo, setAnadiendo] = useState(false);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [foto, setFoto] = useState(null);
  const [errorMoto, setErrorMoto] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function cargarMotos() {
    if (!supabase) return;
    const { data } = await supabase
      .from("motos")
      .select("id,marca,modelo,anio,imagen_url,imagen_path")
      .eq("user_id", id)
      .order("created_at");
    setMotos(data || []);
  }

  useEffect(() => {
    cargarMotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function guardarMoto(e) {
    e.preventDefault();
    setErrorMoto("");
    if (!marca.trim() || !modelo.trim()) {
      setErrorMoto("Escribe la marca y el modelo.");
      return;
    }
    const n = anio ? parseInt(anio, 10) : null;
    if (anio && (isNaN(n) || n < 1900 || n > 2100)) {
      setErrorMoto("El año no es válido.");
      return;
    }
    setGuardando(true);
    try {
      let imagen_url = null;
      let imagen_path = null;
      if (foto) {
        const { blob } = await reducir(foto);
        imagen_path = `${usuario.id}/moto-${Date.now()}.jpg`;
        const { error: e1 } = await supabase.storage
          .from("fotos")
          .upload(imagen_path, blob, { contentType: "image/jpeg" });
        if (e1) throw e1;
        imagen_url = supabase.storage.from("fotos").getPublicUrl(imagen_path).data.publicUrl;
      }
      const { error: e2 } = await supabase.from("motos").insert({
        user_id: usuario.id,
        marca: marca.trim(),
        modelo: modelo.trim(),
        anio: n,
        imagen_url,
        imagen_path,
      });
      if (e2) throw e2;
      registrar("primera_moto", usuario.id);
      setMarca("");
      setModelo("");
      setAnio("");
      setFoto(null);
      setAnadiendo(false);
      cargarMotos();
    } catch (err) {
      setErrorMoto("Error: " + (err && err.message ? err.message : "desconocido"));
    }
    setGuardando(false);
  }

  async function quitarMoto(m) {
    if (!window.confirm("¿Quitar esta moto de tu garaje?")) return;
    const { error } = await supabase.from("motos").delete().eq("id", m.id);
    if (error) return;
    if (m.imagen_path) await supabase.storage.from("fotos").remove([m.imagen_path]);
    cargarMotos();
  }

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

  const [copiado, setCopiado] = useState(false);

  async function compartir() {
    const url = `${window.location.origin}/garaje?u=${encodeURIComponent(perfil.username)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Mi garaje en Crank", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      }
    } catch (e) {
      /* el usuario canceló o el navegador no lo permite */
    }
  }

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

      {perfil && (
        <button type="button" className="accion" onClick={compartir}>
          {copiado ? "Enlace copiado" : "Compartir garaje"}
        </button>
      )}

      <div className="garaje">
        <h3>Garaje</h3>
        {motos.length === 0 && !anadiendo && (
          <p className="vacio">
            {propio ? "Aún no has registrado ninguna moto." : "Aún no ha registrado ninguna moto."}
          </p>
        )}
        {motos.length > 0 && (
          <ul className="motos">
            {motos.map((m) => (
              <li key={m.id}>
                {m.imagen_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.imagen_url} alt={`${m.marca} ${m.modelo}`} loading="lazy" />
                )}
                <b>
                  {m.marca} {m.modelo}
                </b>
                {m.anio && <span>{m.anio}</span>}
                {propio && (
                  <button type="button" className="limpiar" onClick={() => quitarMoto(m)}>
                    Quitar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {propio && !anadiendo && (
          <button type="button" className="accion" onClick={() => setAnadiendo(true)}>
            Añadir moto
          </button>
        )}

        {propio && anadiendo && (
          <form onSubmit={guardarMoto}>
            <label className="campo">
              <span>Marca</span>
              <input value={marca} onChange={(e) => setMarca(e.target.value)} maxLength={60} placeholder="Por ejemplo: Triumph" />
            </label>
            <label className="campo">
              <span>Modelo</span>
              <input value={modelo} onChange={(e) => setModelo(e.target.value)} maxLength={80} placeholder="Por ejemplo: Bonneville T120" />
            </label>
            <label className="campo">
              <span>Año (opcional)</span>
              <input value={anio} onChange={(e) => setAnio(e.target.value)} inputMode="numeric" maxLength={4} />
            </label>
            <label className="campo">
              <span>Foto (opcional)</span>
              <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files && e.target.files[0])} />
            </label>
            {errorMoto && <p className="error">{errorMoto}</p>}
            <button type="submit" className="accion" disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar moto"}
            </button>
            <button type="button" className="limpiar" onClick={() => setAnadiendo(false)}>
              Cancelar
            </button>
          </form>
        )}
      </div>

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
