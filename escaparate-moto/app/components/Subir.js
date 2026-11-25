"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { tipos, seccionDeTipo } from "../data/fichas";
import { reducir } from "../lib/imagen";
import Modal from "./Modal";
import { registrar } from "../lib/eventos";

export default function Subir({ usuario, onCerrar, onListo }) {
  const [archivo, setArchivo] = useState(null);
  const [vista, setVista] = useState("");
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("Moto");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [enlace, setEnlace] = useState("");
  const [motoId, setMotoId] = useState("");
  const [motos, setMotos] = useState([]);
  const [error, setError] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    supabase
      .from("motos")
      .select("id,marca,modelo")
      .eq("user_id", usuario.id)
      .order("created_at")
      .then(({ data }) => setMotos(data || []));
  }, [usuario.id]);

  function elegirMoto(id) {
    setMotoId(id);
    const m = motos.find((x) => x.id === id);
    if (m && tipo === "Moto") {
      if (!marca) setMarca(m.marca);
      if (!modelo) setModelo(m.modelo);
    }
  }

  function elegirArchivo(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setArchivo(f);
    setVista(URL.createObjectURL(f));
  }

  async function enviar(e) {
    e.preventDefault();
    setError("");
    if (!archivo || !titulo.trim() || !marca.trim() || !modelo.trim()) {
      setError("Añade una foto, un título, la marca y el modelo.");
      return;
    }
    if (enlace.trim() && !/^https?:\/\//i.test(enlace.trim())) {
      setError("El enlace debe empezar por http:// o https://");
      return;
    }
    setSubiendo(true);
    try {
      const { blob, ancho, alto } = await reducir(archivo);
      const ruta = `${usuario.id}/${Date.now()}.jpg`;
      const { error: e1 } = await supabase.storage
        .from("fotos")
        .upload(ruta, blob, { contentType: "image/jpeg" });
      if (e1) throw e1;
      const { data } = supabase.storage.from("fotos").getPublicUrl(ruta);
      const { error: e2 } = await supabase.from("posts").insert({
        user_id: usuario.id,
        titulo: titulo.trim(),
        tipo,
        marca: marca.trim(),
        moto: modelo.trim(),
        estilo: "",
        enlace: enlace.trim() || null,
        moto_id: motoId || null,
        tendencias: [],
        imagen_url: data.publicUrl,
        imagen_path: ruta,
        ancho,
        alto,
      });
      if (e2) {
        await supabase.storage.from("fotos").remove([ruta]);
        throw e2;
      }
      registrar("primera_publicacion", usuario.id);
      onListo();
    } catch (err) {
      setError("No se pudo subir la foto. Comprueba que es una imagen e inténtalo de nuevo.");
      setSubiendo(false);
    }
  }

  return (
    <Modal titulo="Subir foto" onCerrar={onCerrar}>
      <form onSubmit={enviar}>
        <label className="campo">
          <span>Foto</span>
          <input type="file" accept="image/*" onChange={elegirArchivo} />
        </label>
        {vista && <img className="previa" src={vista} alt="Vista previa" />}

        <label className="campo">
          <span>Título</span>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={80}
            required
          />
        </label>

        <label className="campo">
          <span>¿Qué es?</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {tipos.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.valor}
              </option>
            ))}
          </select>
        </label>

        <label className="campo">
          <span>Marca</span>
          <input
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            maxLength={60}
            list="marcas-sugeridas"
            placeholder="Escribe o elige una marca"
          />
          <datalist id="marcas-sugeridas">
            {seccionDeTipo(tipo).grupos.flatMap((g) => g.marcas).map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>

        <label className="campo">
          <span>Modelo</span>
          <input
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            maxLength={80}
            placeholder="Por ejemplo: MT-07"
          />
        </label>

        <label className="campo">
          <span>Enlace a la tienda o web (opcional)</span>
          <input
            value={enlace}
            onChange={(e) => setEnlace(e.target.value)}
            maxLength={300}
            inputMode="url"
            placeholder="https://"
          />
        </label>

        {motos.length > 0 && (
          <label className="campo">
            <span>¿De cuál de tus motos? (opcional)</span>
            <select value={motoId} onChange={(e) => elegirMoto(e.target.value)}>
              <option value="">Ninguna</option>
              {motos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.marca} {m.modelo}
                </option>
              ))}
            </select>
          </label>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" className="accion" disabled={subiendo}>
          {subiendo ? "Subiendo…" : "Publicar"}
        </button>
      </form>
    </Modal>
  );
}
