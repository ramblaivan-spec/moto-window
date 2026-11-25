import PaginaLegal from "../components/PaginaLegal";
import { LEGAL_COMPLETO } from "../config";

export const metadata = {
  title: "Aviso de enlaces de afiliación | Crank",
  description: "Qué son los enlaces de afiliación de Crank y cómo nos afectan.",
  alternates: { canonical: "/afiliacion" },
  robots: LEGAL_COMPLETO ? undefined : { index: false, follow: true },
};

export default function Afiliacion() {
  return (
    <PaginaLegal titulo="Aviso de enlaces de afiliación">
      <p>Algunos enlaces de Crank, como los botones “Ver en tienda”, pueden ser enlaces de afiliación. Esto significa que, si compras en la tienda a través de ellos, Crank puede recibir una pequeña comisión. A ti no te cuesta nada más.</p>
      <p>Las comisiones no influyen en lo que mostramos: las fichas de marca se escriben a partir de fuentes públicas y no se ordenan por lo que pagan las tiendas.</p>
      <p>Los enlaces que ponen otros usuarios en sus publicaciones son responsabilidad de quien los publica.</p>
    </PaginaLegal>
  );
}
