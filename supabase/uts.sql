-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- Fitur "UTS Online" (100% gratis, tanpa AI): siswa login pakai NISN lalu
-- mengerjakan soal pilihan ganda langsung di layar. Nilai dihitung otomatis
-- oleh sistem (cocokkan jawaban siswa vs jawaban_benar), tidak perlu baca PDF.

-- 1. Bank soal UTS per kelas (terpisah dari tabel "soal" yang dipakai untuk
--    latihan soal biasa, supaya soal UTS resmi tidak tercampur soal latihan)
create table if not exists public.soal_uts (
  id uuid primary key default gen_random_uuid(),
  kelas smallint not null check (kelas in (4, 5, 6)),
  nomor integer not null check (nomor > 0),
  pertanyaan text not null,
  pilihan_a text not null,
  pilihan_b text not null,
  pilihan_c text not null,
  pilihan_d text not null,
  jawaban_benar text not null check (jawaban_benar in ('a', 'b', 'c', 'd')),
  created_at timestamptz not null default now(),
  unique (kelas, nomor)
);

alter table public.soal_uts enable row level security;

create policy "Soal UTS dapat dibaca semua orang"
  on public.soal_uts
  for select
  using (true);

-- Catatan: insert/update/delete dibuka lewat anon key (sama seperti tabel
-- "tugas"), karena validasi login guru dilakukan di sisi aplikasi.
create policy "Soal UTS dapat diubah (validasi login di aplikasi)"
  on public.soal_uts
  for all
  using (true)
  with check (true);


-- 2. Hasil UTS siswa (satu baris per siswa; siswa tidak bisa mengerjakan
--    ulang begitu sudah submit sekali, kecuali guru menghapus barisnya)
create table if not exists public.hasil_uts (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid not null references public.siswa(id) on delete cascade,
  nama_siswa text not null,
  nisn text not null,
  kelas smallint not null check (kelas in (4, 5, 6)),
  skor integer not null,
  total_soal integer not null,
  created_at timestamptz not null default now(),
  unique (siswa_id)
);

create index if not exists hasil_uts_kelas_idx on public.hasil_uts (kelas, created_at desc);

alter table public.hasil_uts enable row level security;

create policy "Hasil UTS dapat dibaca semua orang"
  on public.hasil_uts
  for select
  using (true);

create policy "Hasil UTS dapat diubah (validasi login di aplikasi)"
  on public.hasil_uts
  for all
  using (true)
  with check (true);
