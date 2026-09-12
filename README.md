# TIK SD Muhammadiyah 01 Kukusan

Website pembelajaran TIK untuk siswa kelas 4, 5, dan 6. Dibangun dengan Next.js, dan materi/video per kelas diambil secara dinamis dari **Supabase**.

## Status saat ini

- ✅ **Live di Vercel**: https://tik-sd-muhammadiyah.vercel.app
- ✅ **Supabase**: project `tik-sd-muhammadiyah` sudah aktif, tabel `materi` sudah dibuat + contoh data
- ⏳ **GitHub**: kode ini belum ada di repo — ikuti langkah 1 di bawah

Kredensial Supabase yang dipakai sudah tertanam sebagai default di `lib/supabase/client.ts` (dan tercantum di `.env.example`), jadi website ini **langsung berfungsi tanpa setup tambahan**. Kamu tetap bisa override lewat Environment Variables di Vercel kapan saja.

## 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Inisialisasi website TIK SD Muhammadiyah"
git branch -M main
git remote add origin https://github.com/<username-kamu>/<nama-repo>.git
git push -u origin main
```

> Ganti `<username-kamu>` dan `<nama-repo>` sesuai repo yang kamu buat di GitHub.

## 2. Hubungkan repo ke project Vercel yang sudah ada

Project Vercel `tik-sd-muhammadiyah` sudah dibuat dan berjalan, tapi belum tersambung ke Git (deploy sebelumnya dilakukan langsung/manual). Supaya setiap `git push` otomatis ter-deploy:

1. Buka https://vercel.com/hendrahindrawan1-mastertiks-projects/tik-sd-muhammadiyah
2. **Settings > Git** → **Connect Git Repository** → pilih repo GitHub yang tadi kamu push
3. (Opsional, disarankan) Buka **Settings > Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (nilainya ada di `.env.example`) — supaya kredensial tidak hardcoded di source code.

Setelah tersambung, **setiap `git push` ke branch `main` otomatis build & deploy ulang**.

## 3. Jalankan di komputer lokal (opsional)

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Buka http://localhost:3000

## Menambah/mengubah materi tanpa coding

1. Buka dashboard Supabase project `tik-sd-muhammadiyah`
2. **Table Editor > materi** → tambah baris baru:

| kolom | isi |
|---|---|
| `kelas` | 4, 5, atau 6 |
| `judul` | Judul materi |
| `deskripsi` | Penjelasan singkat |
| `video_url` | Link YouTube (boleh kosong) |
| `urutan` | Angka urutan tampil (1, 2, 3, ...) |

Materi otomatis muncul di halaman `/kelas/4`, `/kelas/5`, atau `/kelas/6` — tidak perlu redeploy.

## UTS Online (`/uts`) — 100% gratis, tanpa biaya AI

Siswa mengerjakan UTS pilihan ganda langsung di HP/laptop, seperti fitur "Latihan Soal"
yang sudah ada, tapi terpisah supaya soal UTS resmi tidak tercampur soal latihan biasa.
Nilai dihitung otomatis oleh sistem (cocokkan pilihan siswa dengan jawaban benar) —
**tidak butuh AI, tidak ada biaya per pemakaian**, murni Supabase yang sudah gratis.

Alurnya:

1. **Guru**: buka `/guru/kelola-soal-uts` → susun soal pilihan ganda per kelas (pertanyaan,
   4 pilihan, jawaban benar)
2. **Siswa**: buka `/uts` → pilih kelas → login pakai NISN (password = NISN, sama seperti
   absen) → kerjakan soal satu per satu → nilai otomatis muncul & tersimpan. Setiap siswa
   hanya bisa mengerjakan **satu kali** (kalau perlu mengulang, guru bisa hapus baris
   nilainya di halaman rekap)
3. **Guru**: buka `/guru/rekap-uts` → lihat rekap nilai semua siswa per kelas beserta
   rata-ratanya

Setup: jalankan `supabase/uts.sql` di Supabase Dashboard > SQL Editor (bikin tabel
`soal_uts` dan `hasil_uts`). Tidak perlu Storage bucket baru maupun Environment Variable
tambahan.

## Struktur penting

```
app/kelas/[level]/page.tsx   -> halaman materi per kelas (4/5/6), ambil data dari Supabase
lib/supabase/client.ts       -> koneksi ke Supabase
lib/supabase/queries.ts      -> query ambil materi berdasarkan kelas
supabase/schema.sql          -> skema tabel + contoh data (sudah dijalankan di project Supabase)
```
