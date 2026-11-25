import PaginaLegal, { Identidad } from "../components/PaginaLegal";
import { LEGAL_COMPLETO } from "../config";

export const metadata = {
  title: "Términos de uso | Crank",
  description: "Condiciones de uso de Crank y normas de la comunidad.",
  alternates: { canonical: "/terminos" },
  robots: LEGAL_COMPLETO ? undefined : { index: false, follow: true },
};

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos de uso">
      <h2>1. Quiénes somos</h2>
      <Identidad />
      <p>Crank es una comunidad visual del mundo motero y un directorio de marcas. Al registrarte o usarla aceptas estos términos.</p>

      <h2>2. Tu cuenta</h2>
      <ul>
        <li>Debes dar un correo real y mantener tu contraseña en secreto.</li>
        <li>Eres responsable de lo que se haga desde tu cuenta.</li>
        <li>Puedes dejar de usar Crank y pedir que borremos tu cuenta cuando quieras.</li>
      </ul>

      <h2>3. Lo que publicas</h2>
      <ul>
        <li>Solo publica fotos y textos que sean tuyos o para los que tengas permiso. No subas material con derechos de otras personas o marcas.</li>
        <li>Conservas la propiedad de lo que subes. Nos das permiso para mostrarlo dentro de Crank mientras esté publicado.</li>
        <li>No se permite contenido ilegal, violento, sexual, de acoso, que suplante a otras personas o que sea publicidad engañosa o spam.</li>
        <li>Podemos retirar contenido o suspender cuentas que incumplan estas normas.</li>
      </ul>

      <h2>4. Marcas y fichas</h2>
      <p>Las fichas de marca son textos informativos elaborados por Crank a partir de fuentes públicas, que se enlazan en cada ficha. Los nombres de marca pertenecen a sus propietarios y su aparición no implica relación ni respaldo. Si eres titular de una marca y ves un error, escríbenos y lo revisamos.</p>

      <h2>5. Enlaces a tiendas</h2>
      <p>Algunos enlaces llevan a tiendas de terceros. Consulta el <a href="/afiliacion">aviso de afiliación</a>. No somos parte de tus compras en esas tiendas.</p>

      <h2>6. Responsabilidad</h2>
      <p>Ofrecemos Crank tal cual, sin garantía de que funcione sin interrupciones. Las fichas son informativas y pueden contener errores. No nos hacemos responsables de lo que publiquen otros usuarios, aunque retiraremos lo que se nos notifique y vulnere estas normas.</p>

      <h2>7. Cambios y ley aplicable</h2>
      <p>Podemos cambiar estos términos y lo indicaremos en la fecha de arriba. Se rigen por la ley española.</p>
    </PaginaLegal>
  );
}
