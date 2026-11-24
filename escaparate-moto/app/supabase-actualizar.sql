-- Solo para quien ya ejecutó supabase.sql antes: añade tipo y marca a las publicaciones.
alter table public.posts add column if not exists tipo text not null default 'Moto';
alter table public.posts add column if not exists marca text not null default '';
