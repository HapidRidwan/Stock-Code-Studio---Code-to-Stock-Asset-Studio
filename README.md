# StockCode Studio ⚡
> **Studio Minimalis untuk Mengubah Kode HTML, CSS, SVG & JS Menjadi Aset Komersial Beresolusi Tinggi (Adobe Stock Ready)**

**StockCode Studio** adalah web aplikasi dengan estetika Studio Minimalis modern (terinspirasi dari *Ray.so*, *Linear*, dan *Canva*) yang fokus mengonversi kode menjadi gambar tajam (PNG, JPG), vektor murni (SVG EPS-ready), dan video footage resolusi tinggi (MP4 H.264 / WebM) yang memenuhi standar kurasi Adobe Stock.

---

## 🎨 Desain Studio Minimalis

- **Bebas Gimmick Visual AI:** Tanpa gradasi neon ungu-biru, tanpa efek glow berlebihan, tanpa emoji murahan di tombol, dan tanpa kartu-kartu bertumpuk yang menyempitkan layar.
- **Palet Taktil & Bersih:** 
  - Workspace utama: `#F4F4F5` (Zinc-100) dengan pola dot-grid halus.
  - Toolbar & Panel: Putih bersih `#FFFFFF` dengan border tipis tegas `1px solid #E4E4E7` dan shadow sangat lembut.
  - Tombol Utama (Primary CTA): Hitam pekat elegan `#18181B` hover `#27272A`.
  - Tipografi: *Plus Jakarta Sans* & *Inter* yang lega dan mudah dibaca.

---

## 📐 Arsitektur "Canvas-First"

1. **Kanvas Preview sebagai Fokus Utama (80% Layar):**
   - Menempatkan hasil visual langsung di tengah layar dengan ruang lega di sekelilingnya.
   - Kanvas menyesuaikan ukuran layar secara otomatis (*Auto-Fit*) dengan bayangan lembut di belakangnya.
   - Info minimalis satu baris di bilah atas: contoh `2500 × 1600 px • Standar Adobe Stock (4.0 MP)`.

2. **Slide-Over Drawer [ Kode & Template ]:**
   - Editor kode disembunyikan rapi ke dalam panel samping (drawer) yang dapat dibuka melalui tombol **[ Kode & Template ]** di kiri atas.
   - **Smart Paste (1-Klik):** Kotak tempel cepat untuk paste kode utuh; parser otomatis memisahkan tag `<style>` dan `<script>` lalu langsung menerapkannya ke kanvas dengan 1 klik.
   - **Contoh Siap Pakai:** 4 kartu visual untuk memilih template bawaan:
     1. *Geometric Abstract Vector* (Vektor SVG murni)
     2. *Anti-Gravity Floating Particles* (Animasi kanvas 4K 60FPS)
     3. *Motion Gradient Background* (CSS aurora seamless loop)
     4. *Infographic UI Badge* (Vektor emblem & shield)
   - **Editor Lanjutan:** Tersedia accordion untuk pengembang yang ingin menyunting baris per baris HTML, CSS, atau JavaScript dengan Monaco Editor dan tombol *Format Code*.

3. **Floating Bottom Control Bar (Ray.so / Figma Style):**
   - Dock melayang di tengah bawah layar dengan 4 kontrol inti:
     - **Pemilih Ukuran:** Pilihan fungsional (*Gambar Adobe Stock 4MP*, *Gambar High-Res 12MP*, *Video Animasi 4K*, *Video Vertikal 9:16*, *Vektor SVG*).
     - **Pemilih Background:** 3 bulatan warna cepat (Transparan/Checkerboard, Putih, Hitam, dan Custom Color Picker).
     - **Kontrol Animasi:** Ikon *Play/Pause*, *Restart*, dan pemilih kecepatan (`0.5x`, `1x`, `2x`).
     - **Tombol Utama [ Unduh File ]:** Tombol hitam elegan berkontras tinggi di ujung kanan dock.

4. **Pop-up Unduhan (Export Modal) Bersih & Bebas Jargon:**
   - Dialog terpusat dengan baris pilihan rapi:
     - **PNG** — *Gambar tajam, mendukung background transparan & Super-Sampling*
     - **JPG** — *Kualitas 100%, siap unggah ke Adobe Stock*
     - **SVG** — *Vektor murni, tanpa foreignObject, kompatibel Adobe Illustrator EPS*
     - **MP4 / Video** — *Rekaman animasi H.264 dengan bitrate tinggi (Pilihan durasi: 5d, 10d, 15d, 30d)*
   - Saat proses render berjalan, tombol unduh berubah menjadi indikator persentase loading yang tenang dan otomatis mengunduh file saat selesai.

---

## 🚀 Menjalankan Aplikasi

Aplikasi aktif dan dapat dibuka langsung di:
```bash
http://127.0.0.1:5173
```
