import { marcasInfo } from "../data/marcasInfo";

const norm = (t) => (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

const indice = new Map(Object.entries(marcasInfo).map(([nombre, i]) => [norm(nombre), { nombre, slug: i.slug }]));

// Devuelve { nombre, slug } si hay ficha verificada de esa marca; si no, null.
export function fichaDeMarca(marca) {
  return indice.get(norm(marca)) || null;
}
