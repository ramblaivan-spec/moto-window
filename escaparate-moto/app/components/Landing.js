"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { NOMBRE } from "../config";
import { registrar } from "../lib/eventos";

export default function Landing() {
  // Quien ya tiene sesión, o vuelve de un correo de Supabase (confirmación,
  // recuperar contraseña), pasa directo al muro conservando los datos de la URL.
  useEffect(() => {
    registrar("visita_landing", null, true);
    const h = window.location.hash || "";
    if (/access_token|refresh_token|type=|error=/.test(h) || /[?&]code=/.test(window.location.search)) {
      window.location.replace("/muro" + window.location.search + h);
      return;
    }
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace("/muro");
    });
  }, []);

  return (
    <>
      <header className="cabecera">
        <a className="logo" href="/">
          {NOMBRE}
        </a>
        <nav className="menu" aria-label="Principal">
          <a href="/muro">Muro</a>
          <a href="/muro">Entrar</a>
        </nav>
      </header>
      <main className="principal landing">
        <h1 className="landing-titulo">Tu garaje, tus marcas, tu inspiración.</h1>
        <p className="landing-sub">
          Descubre marcas con su historia, inspírate con motos de otros motoristas y enseña tu garaje.
        </p>
        <p>
          <a className="enlace-tienda" href="/muro">
            Entrar al muro
          </a>
        </p>

        <div className="landing-bloques">
          <section>
            <h2>Descubre marcas</h2>
            <p>Fichas con origen, historia y fuentes de las marcas de motos, ropa, cascos y componentes.</p>
          </section>
          <section>
            <h2>Inspírate</h2>
            <p>Un muro de motos y estilos para ver ideas, guardar lo que te gusta y seguir tus marcas favoritas.</p>
          </section>
          <section>
            <h2>Enseña tu garaje</h2>
            <p>Crea tu perfil, añade tus motos y comparte fotos con la comunidad.</p>
          </section>
        </div>
      </main>
    </>
  );
}
