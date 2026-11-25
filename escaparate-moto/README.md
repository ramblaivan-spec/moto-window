# Valve

Comunidad visual del mundo motero: muro con buscador y filtros, perfiles, subida de fotos, me gusta y comentarios.

- El nombre se cambia en `app/config.js`.
- Las fichas de ejemplo están en `app/data/fichas.js`.
- El diseño está en `app/globals.css`.
- La base de datos se crea con `supabase.sql` (Supabase > SQL Editor).
- Publicación: Cloudflare Pages, desplegado desde GitHub (rama main). Variables necesarias en Cloudflare Pages: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
