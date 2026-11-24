"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { estilos, tendencias } from "../data/fichas";
import Modal from "./Modal";

// Reduce la foto a 1600 px como máximo para ahorrar espacio y cargar rápido.
function reducir(archivo, max = 1600) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, max / Math.max(img.width, img.height));
      const ancho = Math.round(img.width * escala);
      const alto = Math.round(img.height * escala);
      const lienzo = document.createElement("canvas");
      lienzo.width = ancho;
      lienzo.height = alto;
      lienzo.getContext("2d").drawImage(img, 0, 0, ancho, alto);
      lienzo.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve({ blob, ancho, alto });
          else reject(new Error("No se pudo procesar la imagen"));
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Imagen no válida"));
    };
    img.src = url;
  });
}

export default function Subir({ usuario, onCerrar, onListo }) {
  const [archivo, setArchivo] = useState(null);
  const [vista, setVista] = useState("");
  const [titulo, setTitulo] = useState("");
  const [estilo, setEstilo] = useState(estilos[0]);
  const [moto, setMoto] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  function elegirArchivo(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setArchivo(f);
    setVista(URL.createObjectURL(f));
  }

  function alternarTag(t) {
    if (tags.includes(t)) setTags(tags.filter((x) => x !== t));
    else if (tags.length < 3) setTags([...tags, t]);
  }

  async function enviar(e) {
    e.preventDefault();
    setError("");
    if (!archivo || !titulo.trim()) {
      setError("Añade una foto y un título.");
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
        estilo,
        moto: moto.trim(),
        tendencias: tags,
        imagen_url: data.publicUrl,
        imagen_path: ruta,
        ancho,
        alto,
      });
      if (e2) {
        await supabase.storage.from("fotos").remove([ruta]);
        throw e2;
      }
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
          <span>Estilo</span>
          <select value={estilo} onChange={(e) => setEstilo(e.target.value)}>
            {estilos.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="campo">
          <span>Moto (opcional)</span>
          <input
            value={moto}
            onChange={(e) => setMoto(e.target.value)}
            maxLength={80}
            placeholder="Por ejemplo: Yamaha MT-07"
          />
        </label>

        <div className="campo">
          <span>Tendencias (hasta 3)</span>
          <div className="etiquetas">
            {tendencias.map((t) => (
              <button
                key={t}
                type="button"
                className="chip chip-suave"
                aria-pressed={tags.includes(t)}
                onClick={() => alternarTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="accion" disabled={subiendo}>
          {subiendo ? "Subiendo…" : "Publicar"}
        </button>
      </form>
    </Modal>
  );
}
