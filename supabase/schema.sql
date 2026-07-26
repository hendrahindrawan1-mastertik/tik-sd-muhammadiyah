-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- Membuat tabel "materi" untuk menyimpan materi & video pembelajaran TIK per kelas

create table if not exists public.materi (
  id uuid primary key default gen_random_uuid(),
  kelas smallint not null check (kelas in (4, 5, 6)),
  judul text not null,
  deskripsi text,
  video_url text,
  urutan integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists materi_kelas_urutan_idx
  on public.materi (kelas, urutan);

-- Aktifkan Row Level Security
alter table public.materi enable row level security;

-- Izinkan siapa saja MEMBACA materi (website publik untuk siswa)
create policy "Materi dapat dibaca semua orang"
  on public.materi
  for select
  using (true);

-- Catatan: kebijakan INSERT/UPDATE/DELETE sengaja tidak dibuat di sini.
-- Tambah/ubah/hapus materi dilakukan lewat Supabase Table Editor
-- (login sebagai admin di dashboard Supabase), jadi tidak perlu ubah kode
-- dan tidak perlu sistem login terpisah untuk saat ini.

-- Contoh data awal (opsional, boleh dihapus/diganti)
insert into public.materi (kelas, judul, deskripsi, video_url, urutan) values
  (4, 'Mengenal Bagian-bagian Komputer', 'Siswa belajar mengenali perangkat keras dasar seperti monitor, CPU, mouse, dan keyboard.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1),
  (5, 'Dasar-dasar Pengolah Kata', 'Belajar membuat dan memformat dokumen sederhana menggunakan aplikasi pengolah kata.', null, 1),
  (6, 'Pengenalan Internet Sehat', 'Memahami cara menggunakan internet dengan aman dan bertanggung jawab.', null, 1)
on conflict do nothing;
