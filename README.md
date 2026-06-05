# TabibitoPocket
TABIBITO POCKET

Modern IT Inventory Dashboard

DESKRIPSI

Aplikasi Single Page Application (SPA) untuk mengelola data inventaris perangkat IT, gadget laboratorium, dan komponen PC mahasiswa Informatika. Aplikasi ini berinteraksi penuh dengan DummyJSON API menggunakan metode HTTP:


POST (Pendaftaran Device Baru)

PUT (Modifikasi Parameter Device)

DELETE (Penghapusan Device)

TEMA: Aurora Glassmorphism dengan nuansa futuristik gelap (Dark Indigo & Cyan)

FITUR LENGKAP

✅ CREATE (POST) - Tambah gear/device baru dengan form input dinamis

✅ READ (GET) - Tampilkan daftar 15 perangkat bawaan awal dari API

✅ UPDATE (PUT) - Edit data perangkat yang sudah ada di dalam rak

✅ DELETE (DELETE) - Hapus perangkat dari sistem dengan konfirmasi keamanan

KEUNGGULAN APLIKASI

🎨 Desain modern "Aurora Glassmorphism" (Efek kaca buram & cahaya neon)

📊 Panel Statistik Real-Time (Total aset perangkat & kalkulasi nilai Rupiah)

📱 Layout Full-Dashboard yang responsif untuk berbagai ukuran layar

⚠️ UI Error Alert terintegrasi (Error tampil langsung di layar antarmuka web)

✨ Animasi halus pada transisi hover kartu dan notifikasi

🔔 Toast notification untuk feedback aksi pengguna (Sukses/Gagal)

💰 Format nominal angka otomatis ke mata uang Rupiah (IDR)

⚡ Loading state indicator saat sinkronisasi server

TEKNOLOGI YANG DIGUNAKAN

HTML5 (Semantic Structure)

CSS3 (Backdrop-filter Blur, Grid/Flexbox, Custom Properties, Keyframe Animations)

JavaScript ES6+ (Strict async/await, Fetch API, DOM Manipulation)

DummyJSON API (Mock REST API untuk simulasi server)

CARA MENJALANKAN
Ekstrak file ZIP ke dalam satu folder tujuan

Buka file index.html dengan web browser modern
(Chrome, Firefox, Edge, Safari)

REKOMENDASI: Gunakan Live Server di VS Code (Mencegah kendala CORS)

Install text editor VS Code
Install extension "Live Server"

Buka folder project, klik kanan area code index.html → "Open with Live Server"

CARA PENGGUNAAN
[1] TAMBAH GEAR/PERANGKAT
- Isi form pendaftaran (Nama perangkat dan Harga wajib diisi)
- Klik tombol "Simpan Data"
- Perangkat akan langsung masuk ke urutan paling atas daftar inventaris

[2] EDIT DATA PERANGKAT
- Klik tombol "✏️" (Edit) pada baris perangkat yang ingin diubah
- Form akan otomatis beralih ke Mode Edit dan terisi data lama
- Sesuaikan parameter nama, harga, atau kategori
- Klik "Update Data"

[3] HAPUS PERANGKAT
- Klik tombol "🗑️" (Hapus) pada baris perangkat
- Konfirmasi peringatan sistem
- Baris perangkat akan musnah dari layar dashboard

PALET WARNA (Aurora Glassmorphism)


Background Core: #0f111a (Deep Space Dark)

Glass Effect: rgba(255, 255, 255, 0.03) dengan Blur 16px

Accent Primary: #6366f1 (Indigo Neon)

Accent Highlight: #38bdf8 (Cyan Glow)

Success UI: #10b981 (Emerald Green)

Danger/Error UI: #ef4444 (Crimson Red)


STRUKTUR FILE


index.html  - Kerangka utama dashboard UI

style.css   - Styling elemen, grid, dan efek aurora background

script.js   - Logika utama CRUD SPA, Fetch API, & Error Handling

README.md   - Dokumentasi & Panduan Aplikasi


CATATAN PENTING (SESUAI KETENTUAN PRAKTIKUM)


Seluruh kode wajib mematuhi aturan manipulasi DOM murni (tanpa reload/refresh halaman).

DummyJSON adalah mock API, penambahan/penghapusan tidak tersimpan permanen di database mereka.

Refresh halaman (F5) akan mengembalikan repositori ke 15 data bawaan awal.

Semua request HTTP (POST, PUT, DELETE) menggunakan "async/await" (tidak menggunakan .then).

Proteksi kode dilapisi "try...catch". Jika request gagal (simulasi offline/salah URL), sistem akan memunculkan banner Error merah di layar antarmuka, bukan sekadar di console.log.

BROWSER SUPPORT
✅ Chrome (Versi 90+)
✅ Firefox (Versi 88+)
✅ Edge (Versi 90+)
✅ Safari (Versi 14+)
