-- ============ VALVE: base de datos ============
-- Pega todo este script en Supabase > SQL Editor y pulsa Run.

-- Perfiles de usuario
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  bio text default '',
  created_at timestamptz default now()
);

-- Publicaciones (fotos)
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  titulo text not null,
  estilo text not null,
  moto text default '',
  tendencias text[] default '{}',
  imagen_url text not null,
  imagen_path text not null,
  ancho int not null,
  alto int not null,
  created_at timestamptz default now()
);

-- Me gusta (uno por persona y publicación)
create table public.likes (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

-- Comentarios
create table public.comentarios (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  texto text not null check (char_length(texto) between 1 and 500),
  created_at timestamptz default now()
);

-- Crea el perfil automáticamente cuando alguien se registra
create function public.crear_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, lower(new.raw_user_meta_data->>'username'));
  return new;
end;
$$;

create trigger al_registrarse after insert on auth.users
for each row execute function public.crear_perfil();

-- Seguridad: cada persona solo puede cambiar lo suyo
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comentarios enable row level security;

create policy "ver perfiles" on public.profiles for select using (true);
create policy "editar mi perfil" on public.profiles for update using (auth.uid() = id);

create policy "ver publicaciones" on public.posts for select using (true);
create policy "crear mis publicaciones" on public.posts for insert with check (auth.uid() = user_id);
create policy "borrar mis publicaciones" on public.posts for delete using (auth.uid() = user_id);

create policy "ver likes" on public.likes for select using (true);
create policy "dar like" on public.likes for insert with check (auth.uid() = user_id);
create policy "quitar like" on public.likes for delete using (auth.uid() = user_id);

create policy "ver comentarios" on public.comentarios for select using (true);
create policy "comentar" on public.comentarios for insert with check (auth.uid() = user_id);
create policy "borrar mi comentario" on public.comentarios for delete using (auth.uid() = user_id);

-- Almacén de fotos
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true)
on conflict (id) do nothing;

create policy "ver fotos" on storage.objects for select
using (bucket_id = 'fotos');

create policy "subir mis fotos" on storage.objects for insert to authenticated
with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "borrar mis fotos" on storage.objects for delete to authenticated
using (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);
