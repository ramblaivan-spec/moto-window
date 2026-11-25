import PerfilPublico from "../components/PerfilPublico";

export const metadata = {
  title: "Garaje | Crank",
  description: "Garaje de un motorista en Crank.",
  robots: { index: false, follow: true },
};

export default function Garaje() {
  return <PerfilPublico />;
}
