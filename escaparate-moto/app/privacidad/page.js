import PaginaLegal, { Identidad } from "../components/PaginaLegal";
import { LEGAL_COMPLETO } from "../config";

export const metadata = {
  title: "Política de privacidad | Crank",
  description: "Qué datos recoge Crank, para qué se usan y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
  robots: LEGAL_COMPLETO ? undefined : { index: false, follow: true },
};

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad">
      <h2>1. Quién es el responsable</h2>
      <Identidad />

      <h2>2. Qué datos recogemos</h2>
      <p>Solo los que tú nos das al usar Crank:</p>
      <ul>
        <li>Al registrarte: correo electrónico, contraseña (que se guarda cifrada, nunca en claro) y nombre de usuario.</li>
        <li>Lo que publicas: fotos, títulos, descripciones, motos de tu garaje, comentarios y me gusta.</li>
        <li>Lo que haces en la app: publicaciones guardadas y marcas que sigues.</li>
        <li>Datos técnicos mínimos de la visita (página vista, país, tipo de dispositivo) mediante una analítica que no usa cookies ni te identifica.</li>
      </ul>
      <p>No pedimos datos de pago ni ningún dato especialmente protegido.</p>

      <h2>3. Para qué los usamos</h2>
      <ul>
        <li>Crear y mantener tu cuenta y mostrar tu perfil y tus publicaciones (base legal: ejecución del servicio que solicitas).</li>
        <li>Mantener la seguridad y evitar abusos (interés legítimo).</li>
        <li>Medir de forma agregada cuántas personas usan Crank para mejorarlo (interés legítimo, sin cookies).</li>
      </ul>
      <p>No vendemos tus datos ni los usamos para publicidad de terceros.</p>

      <h2>4. Qué es público</h2>
      <p>Tu nombre de usuario, tus publicaciones, tus motos y tus comentarios son visibles para otras personas dentro de Crank. Tu correo no se muestra a nadie.</p>

      <h2>5. Quién más trata tus datos</h2>
      <ul>
        <li>Supabase: almacena la base de datos, las cuentas y las fotos.</li>
        <li>Cloudflare: aloja la web y mide las visitas de forma agregada.</li>
        <li>Google Fonts: la web carga la tipografía desde los servidores de Google, que pueden recibir tu dirección IP.</li>
      </ul>
      <p>Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo, con las garantías que ofrece la normativa (por ejemplo, cláusulas contractuales tipo).</p>

      <h2>6. Cookies y almacenamiento local</h2>
      <p>Crank no usa cookies de publicidad ni de seguimiento. Para mantener tu sesión iniciada guarda un identificador técnico en el almacenamiento local de tu navegador, necesario para el funcionamiento del servicio.</p>

      <h2>7. Cuánto tiempo los conservamos</h2>
      <p>Mientras mantengas tu cuenta. Si la eliminas, borramos tus datos personales, salvo lo que la ley nos obligue a conservar.</p>

      <h2>8. Tus derechos</h2>
      <p>Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos escribiendo al correo indicado arriba. Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>

      <h2>9. Menores</h2>
      <p>Crank no está dirigido a menores de 14 años. Si crees que un menor se ha registrado, escríbenos y eliminaremos la cuenta.</p>

      <h2>10. Cambios</h2>
      <p>Si cambiamos esta política, actualizaremos la fecha de arriba y, si el cambio es importante, te avisaremos en la app.</p>
    </PaginaLegal>
  );
}
