import { Jost } from "next/font/google";
import "./globals.css";
import { NOMBRE } from "./config";

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  display: "swap",
});

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
      <body className={jost.className}>{children}</body>
    </html>
  );
}
