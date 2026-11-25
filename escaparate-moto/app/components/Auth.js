"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Modal from "./Modal";
import { registrar } from "../lib/eventos";

function traducir(mensaje) {
  const m = (mensaje || "").toLowerCase();
  if (m.includes("invalid login")) return "Correo o contraseña incorrectos.";
  if (m.includes("already registered")) return "Ya existe una cuenta con ese correo.";
  if (m.includes("database error")) return "Ese nombre de usuario ya está en uso.";
  if (m.includes("not confirmed")) return "Confirma tu correo antes de entrar.";
  if (m.includes("password")) return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("valid email") || m.includes("invalid email")) return "Escribe un correo válido.";
  if (m.includes("rate limit")) return "Demasiados intentos. Espera unos minutos.";
  return "No se pudo completar. Inténtalo de nuevo.";
}

export default function Auth({ onCerrar, onListo }) {
  const [modo, setModo] = useState("entrar");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [usuario, setUsuario] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!supabase) {
      setError("La comunidad aún no está conectada.");
      return;
    }
    setEnviando(true);

    if (modo === "entrar") {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: clave,
      });
      setEnviando(false);
      if (err) {
        setError(traducir(err.message));
        return;
      }
      onListo();
      return;
    }

    const nombre = usuario.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(nombre)) {
      setEnviando(false);
      setError("El usuario debe tener de 3 a 20 caracteres: letras, números o guion bajo.");
      return;
    }
    if (clave.length < 6) {
      setEnviando(false);
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password: clave,
      options: { data: { username: nombre } },
    });
    setEnviando(false);
    if (err) {
      setError(traducir(err.message));
      return;
    }
    registrar("registro");
    if (data.session) {
      onListo();
    } else {
      setModo("entrar");
      setInfo("Cuenta creada. Revisa tu correo para confirmarla y después entra.");
    }
  }

  return (
    <Modal titulo="Entrar" onCerrar={onCerrar}>
      <div className="pestanas" role="group" aria-label="Acceso">
        <button
          type="button"
          className="chip"
          aria-pressed={modo === "entrar"}
          onClick={() => setModo("entrar")}
        >
          Entrar
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={modo === "crear"}
          onClick={() => setModo("crear")}
        >
          Crear cuenta
        </button>
      </div>

      <form onSubmit={enviar}>
        {modo === "crear" && (
          <label className="campo">
            <span>Nombre de usuario</span>
            <input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              maxLength={20}
              required
            />
          </label>
        )}
        <label className="campo">
          <span>Correo</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="campo">
          <span>Contraseña</span>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete={modo === "entrar" ? "current-password" : "new-password"}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}
        {info && <p className="nota">{info}</p>}

        <button type="submit" className="accion" disabled={enviando}>
          {enviando ? "Un momento…" : modo === "entrar" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>
    </Modal>
  );
}
