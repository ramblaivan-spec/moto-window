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
      <p>Algunos enlaces de Crank, como los botones “Ver en tienda”, pueden ser enlaces de afiliación. Si compras a través de ellos, la tienda puede pagarnos una comisión, sin ningún coste extra para ti.</p>
      <p>Esto no cambia lo que mostramos: no ordenamos ni destacamos contenido por la comisión que pueda generar, y las fichas de marca se redactan a partir de fuentes públicas.</p>
      <p>Los enlaces que ponen otros usuarios en sus publicaciones son responsabilidad de quien los publica.</p>
    </PaginaLegal>
  );
}
