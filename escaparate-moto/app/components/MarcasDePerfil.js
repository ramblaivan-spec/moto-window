"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { secciones } from "../data/fichas";
import "./marcas.css";

export default function MarcasDePerfil({ id, onMarca }) {
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("marcas_seguidas")
      .select("marca")
      .eq("user_id", id)
      .then(({ data }) => setMarcas((data || []).map((x) => x.marca)));
  }, [id]);

  const grupos = useMemo(() => {
    const set = new Set(marcas);
    const usadas = new Set();
    const res = [];
    secciones.forEach((sec) =>
      sec.grupos.forEach((g) => {
        const lista = g.marcas.filter((m) => set.has(m));
        lista.forEach((m) => usadas.add(m));
        if (lista.length) res.push({ nombre: g.nombre, marcas: lista });
      })
    );
    const otras = marcas.filter((m) => !usadas.has(m)).sort((a, b) => a.localeCompare(b, "es"));
    if (otras.length) res.push({ nombre: "Otras", marcas: otras });
    return res;
  }, [marcas]);

  if (marcas.length === 0) return null;

  return (
    <section className="siguiendo-bloque">
      <h3 className="titulo-siguiendo">Marcas que sigue</h3>
      {grupos.map((g) => (
        <div key={g.nombre} className="grupo-marcas">
          <h3>{g.nombre}</h3>
          <div className="lista-marcas">
            {g.marcas.map((m) => (
              <button key={m} type="button" className="marca-item" onClick={() => onMarca(m)}>
                {m}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
