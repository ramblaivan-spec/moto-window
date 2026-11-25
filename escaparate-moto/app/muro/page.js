import Valve from "../components/Valve";

export const metadata = {
  title: "Muro | Crank",
  description: "El muro de Crank: motos, marcas e inspiración.",
  alternates: { canonical: "/muro" },
  robots: { index: false, follow: true },
};

export default function Muro() {
  return <Valve />;
}
