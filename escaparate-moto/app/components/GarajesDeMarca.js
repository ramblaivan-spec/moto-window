"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./marcas.css";

// Garajes públicos que tienen alguna moto de esta marca.
export default function GarajesDeMarca({ marca }) {
  const [garajes, setGarajes] = useState([]);

  useEffect(() => {
    if (!supabase || !marca) return;
    const limpio = marca.replace(/[%_,()]/g, "");
    supabase
      .from("motos")
      .select("modelo,profiles(username)")
      .ilike("marca", limpio)
      .limit(30)
      .then(({ data }) => {
        const vistos = new Map();
        (data || []).forEach((m) => {
          const u = m.profiles && m.profiles.username;
          if (u && !vistos.has(u)) vistos.set(u, m.modelo);
        });
        setGarajes([...vistos].slice(0, 12));
      });
  }, [marca]);

  if (garajes.length === 0) return null;
  return (
    <div className="garajes-marca">
      <h3 className="titulo-siguiendo">Garajes con {marca}</h3>
      <div className="lista-marcas">
        {garajes.map(([u, modelo]) => (
          <a key={u} className="marca-item" href={`/garaje?u=${encodeURIComponent(u)}`}>
            @{u}
            <em>{modelo}</em>
          </a>
        ))}
      </div>
    </div>
  );
}
