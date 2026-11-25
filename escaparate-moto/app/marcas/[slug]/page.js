import { marcasInfo } from "../../data/marcasInfo";
import Escaparate from "./Escaparate";
import "../../components/marcas.css";

export const dynamicParams = false;

const todas = Object.entries(marcasInfo).map(([nombre, info]) => ({ nombre, ...info }));

export function generateStaticParams() {
  return todas.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }) {
  const m = todas.find((x) => x.slug === params.slug);
  return {
    title: m ? `${m.nombre}: historia y dónde comprar | Crank` : "Crank",
    description: m ? `${m.nombre}, ${m.origen}. ${m.texto}`.slice(0, 160) : "",
  };
}

export default function PaginaMarca({ params }) {
  const m = todas.find((x) => x.slug === params.slug);
  if (!m) return null;
  return (
    <>
      <header className="cabecera">
        <a className="logo" href="/">
          Crank
        </a>
        <nav className="menu" aria-label="Principal">
          <a href="/">Muro</a>
        </nav>
      </header>
      <main className="principal">
        <p className="nota">
          <a href="/">Crank</a> / Marcas
        </p>
        <h1 className="titulo-vista">{m.nombre}</h1>
        <p className="nota">
          {m.origen}
          {m.fundada ? ` · ${m.fundada}` : ""}
        </p>
        <div className="ficha-marca">
          <p>{m.texto}</p>
          {m.web && (
            <p>
              <a href={m.web} target="_blank" rel="noopener noreferrer" className="enlace-tienda">
                Web oficial
              </a>
            </p>
          )}
        </div>

        <h2 className="titulo-vista">En la comunidad</h2>
        <Escaparate nombre={m.nombre} />

        <p className="nota fuentes">
          Fuentes:{" "}
          {m.fuentes.map(([t, u], i) => (
            <span key={u}>
              {i > 0 ? " · " : ""}
              <a href={u} target="_blank" rel="noopener noreferrer">
                {t}
              </a>
            </span>
          ))}
        </p>
      </main>
    </>
  );
}
