import "./marcas.css";
import { NOMBRE, LEGAL, LEGAL_COMPLETO } from "../config";

export function Identidad() {
  const f = (v) => v || "[pendiente de completar]";
  return (
    <p>
      Titular: {f(LEGAL.titular)} · NIF: {f(LEGAL.nif)} · Domicilio: {f(LEGAL.domicilio)} · Correo:{" "}
      {f(LEGAL.email)}
    </p>
  );
}

export default function PaginaLegal({ titulo, children }) {
  return (
    <>
      <header className="cabecera">
        <a className="logo" href="/">
          {NOMBRE}
        </a>
        <nav className="menu" aria-label="Principal">
          <a href="/">Muro</a>
        </nav>
      </header>
      <main className="principal">
        <h1 className="titulo-vista">{titulo}</h1>
        <p className="nota">
          Última actualización: {LEGAL.actualizado}
          {LEGAL_COMPLETO ? "" : " · Borrador pendiente de completar los datos del titular"}
        </p>
        <div className="ficha-marca">{children}</div>
      </main>
    </>
  );
}
