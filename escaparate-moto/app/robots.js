import { SITIO } from "./config";

export const dynamic = "force-static";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: SITIO + "/sitemap.xml",
  };
}
