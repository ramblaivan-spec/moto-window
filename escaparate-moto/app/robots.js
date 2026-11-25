export const dynamic = "force-static";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://crank-elx.pages.dev/sitemap.xml",
  };
}
