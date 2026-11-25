-- Analítica mínima de embudo. Solo AÑADE una tabla; no toca nada existente.
-- Ejecutar en Supabase > SQL Editor cuando se apruebe.
create table if not exists public.eventos (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  evento text not null check (evento in (
    'visita_landing','registro','primera_moto','primera_publicacion','vuelve_7d','vuelve_30d'
  )),
  user_id uuid references auth.users(id) on delete set null,
  ruta text check (char_length(ruta) <= 200)
);

alter table public.eventos enable row level security;

-- Cualquiera puede registrar un evento (visitas anónimas incluidas); nadie puede leerlos desde la web.
drop policy if exists "eventos_insertar" on public.eventos;
create policy "eventos_insertar" on public.eventos
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
-- Sin política de select: solo se consultan desde el panel de Supabase.
