import "./globals.css";
import { NOMBRE, SITIO } from "./config";
import "./components/marcas.css";

const DESCRIPCION = "Escaparate visual de tendencias del mundo motero: motos, ropa, cascos y fichas de marca.";

export const metadata = {
  metadataBase: new URL(SITIO),
  title: { default: NOMBRE, template: "%s" },
  description: DESCRIPCION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: NOMBRE,
    locale: "es_ES",
    title: NOMBRE,
    description: DESCRIPCION,
    url: "/",
  },
  twitter: { card: "summary", title: NOMBRE, description: DESCRIPCION },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400&display=swap"
        />
      </head>
      <body style={{ fontFamily: "'Jost', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        {children}
        <footer className="pie-legal">
          <a href="/privacidad">Privacidad</a>
          <a href="/terminos">Términos</a>
          <a href="/afiliacion">Afiliación</a>
        </footer>
      </body>
    </html>
  );
}
