"use client";
/* eslint-disable @next/next/no-img-element */

export function Silueta() {
  return (
    <svg viewBox="0 0 200 110" aria-hidden="true" className="silueta">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="36" cy="78" r="24" />
        <circle cx="166" cy="78" r="24" />
        <path d="M36 78 L70 42 H108 L128 56 L166 78 M70 42 L84 78 H116 L128 56 M58 38 H80 M126 40 L142 30 H156 M108 42 L100 30 H78 L70 42" />
      </g>
    </svg>
  );
}

export default function Rejilla({ posts, onAbrir }) {
  return (
    <div className="muro">
      {posts.map((p) => {
        const contenido = (
          <>
            <div
              className={`imagen${p.imagen ? "" : " tono-" + (p.tono || 0)}`}
              style={{ aspectRatio: `1 / ${p.ratio}` }}
            >
              {p.imagen ? (
                <img src={p.imagen} alt={p.titulo} loading="lazy" />
              ) : (
                <Silueta />
              )}
            </div>
            <div className="pie">
              <b>{p.titulo}</b>
              <span>
                {p.marca ? `${p.marca}${p.modelo ? " " + p.modelo : ""} · ` : ""}
                {p.estilo}
              </span>
              {!p.ejemplo && (
                <span>
                  @{p.autor} · ♥ {p.likes} · {p.comentarios}{" "}
                  {p.comentarios === 1 ? "comentario" : "comentarios"}
                </span>
              )}
            </div>
          </>
        );

        if (p.ejemplo) {
          return (
            <article key={p.id} className="tarjeta">
              {contenido}
            </article>
          );
        }
        return (
          <button
            key={p.id}
            type="button"
            className="tarjeta tarjeta-boton"
            onClick={() => onAbrir(p.id)}
            aria-label={`Abrir ${p.titulo}`}
          >
            {contenido}
          </button>
        );
      })}
    </div>
  );
}
