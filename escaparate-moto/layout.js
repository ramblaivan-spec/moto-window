import "./globals.css";
import { NOMBRE } from "./config";

export const metadata = {
  title: NOMBRE,
  description: "Escaparate visual de tendencias del mundo motero.",
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
      </body>
    </html>
  );
}
