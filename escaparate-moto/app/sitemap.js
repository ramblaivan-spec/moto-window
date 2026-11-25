import { marcasInfo } from "./data/marcasInfo";

export const dynamic = "force-static";

export default function sitemap() {
  const base = "https://crank-elx.pages.dev";
  return [
    { url: base + "/" },
    ...Object.values(marcasInfo).map((m) => ({ url: `${base}/marcas/${m.slug}` })),
  ];
}
