import { marcasInfo } from "./data/marcasInfo";
import { SITIO, LEGAL_COMPLETO } from "./config";

export const dynamic = "force-static";

export default function sitemap() {
  const base = SITIO;
  return [
    { url: base + "/" },
    ...(LEGAL_COMPLETO
      ? ["privacidad", "terminos", "afiliacion"].map((p) => ({ url: `${base}/${p}` }))
      : []),
    ...Object.values(marcasInfo).map((m) => ({ url: `${base}/marcas/${m.slug}` })),
  ];
}
