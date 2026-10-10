/**
 * EcoCoder — levels.js
 * Data 10 level tanpa emoji — ikon ditentukan dari field `jenis`
 */

const LEVELS = [
  {
    id: 1, judul: "Langkah Pertama", misi: "Buang sampah organik ke tempat sampah organik.",
    konsep: "Urutan Instruksi",
    start: { petak: 1, arah: "kanan" },
    sampah: [{ petak: 3, jenis: "organik", label: "Kulit Pisang" }],
    tempatSampah: [{ petak: 5, jenis: "organik" }],
    penghalang: [],
    blokTersedia: ["maju","putar_kanan","putar_kiri","ambil","letakkan","ulangi"],
    optimal: 6, maksBlok: 10, tutorial: true,
    tutorialSteps: [
      { pesan: "Selamat datang di EcoCoder! Bantu karakter membuang sampah ke tempat yang benar.", sorotBlok: null },
      { pesan: "Tarik blok <b>Maju</b> ke area program untuk menggerakkan karakter ke kanan.", sorotBlok: "maju" },
      { pesan: "Setelah karakter sampai di petak sampah, gunakan blok <b>Ambil</b>.", sorotBlok: "ambil" },
      { pesan: "Lanjutkan ke tempat sampah organik dan gunakan blok <b>Letakkan</b>.", sorotBlok: "letakkan" },
      { pesan: "Tekan tombol <b>Jalankan</b> untuk melihat karakter bergerak!", sorotBlok: null }
    ],
    faktaSampah: "Sampah organik seperti kulit pisang bisa dijadikan kompos yang menyuburkan tanah."
  },
  {
    id: 2, judul: "Jalur Berliku", misi: "Navigasi jalur berbelok dan buang sampah anorganik ke tempatnya.",
    konsep: "Arah & Belokan",
    start: { petak: 1, arah: "kanan" },
    sampah: [{ petak: 4, jenis: "anorganik", label: "Botol Plastik" }],
    tempatSampah: [{ petak: 9, jenis: "anorganik" }],
    penghalang: [5],
    blokTersedia: ["maju","putar_kanan","putar_kiri","ambil","letakkan","ulangi"],
    optimal: 8, maksBlok: 14, tutorial: false,
    faktaSampah: "Botol plastik memerlukan ratusan tahun untuk terurai. Daur ulang adalah solusinya."
  },
  {
    id: 3, judul: "Jalur Panjang", misi: "Gunakan blok Ulangi untuk efisiensi langkah di jalur lurus yang panjang.",
    konsep: "Perulangan",
    start: { petak: 1, arah: "kanan" },
    sampah: [{ petak: 5, jenis: "organik", label: "Daun Kering" }],
    tempatSampah: [{ petak: 21, jenis: "organik" }],
    penghalang: [],
    blokTersedia: ["maju","putar_kanan","putar_kiri","ambil","letakkan","ulangi"],
    optimal: 5, maksBlok: 12, tutorial: true,
    tutorialSteps: [
      { pesan: "Level ini memperkenalkan blok <b>Ulangi</b>. Daripada menulis Maju berkali-kali, gunakan satu blok Ulangi.", sorotBlok: "ulangi" },
      { pesan: "Seret blok <b>Ulangi</b>, isi angkanya, lalu taruh blok <b>Maju</b> di dalamnya.", sorotBlok: "ulangi" }
    ],
    faktaSampah: "Daun kering adalah sampah organik yang sangat baik untuk dijadikan pupuk alami."
  },
  {
    id: 4, judul: "Rintangan Pertama", misi: "Hindari penghalang dan buang sampah ke tempat yang benar.",
    konsep: "Menghindari Penghalang",
    start: { petak: 1, arah: "kanan" },
    sampah: [{ petak: 13, jenis: "organik", label: "Sisa Sayuran" }],
    tempatSampah: [{ petak: 25, jenis: "organik" }],
    penghalang: [3, 8, 18, 23],
    blokTersedia: ["maju","putar_kanan","putar_kiri","ambil","letakkan","ulangi"],
    optimal: 10, maksBlok: 18, tutorial: false,
    faktaSampah: "Sisa sayuran mengandung nutrisi penting yang bisa dikembalikan ke tanah lewat kompos."
  },
  {
    id: 5, judul: "Dua Sampah", misi: "Kumpulkan 2 sampah organik dan buang ke tempat sampah organik.",
    konsep: "Beberapa Objek",
    start: { petak: 1, arah: "kanan" },
    sampah: [
      { petak: 3, jenis: "organik", label: "Kulit Apel" },
      { petak: 11, jenis: "organik", label: "Tongkol Jagung" }
    ],
    tempatSampah: [{ petak: 15, jenis: "organik" }],
    penghalang: [],
    blokTersedia: ["maju","putar_kanan","putar_kiri","ambil","letakkan","ulangi"],
    optimal: 12, maksBlok: 20, tutorial: false,
    faktaSampah: "Buah-buahan dan sisa sayuran terurai cepat dan bisa jadi pupuk dalam 2-3 bulan."
  },
  {
    id: 6, judul: "Pilah Sampah", misi: "Pisahkan sampah organik dan anorganik ke tempat sampah yang sesuai.",
    konsep: "Klasifikasi Sampah",
    start: { petak: 1, arah: "kanan" },
    sampah: [
      { petak: 3, jenis: "organik", label: "Cangkang Telur" },
      { petak: 8, jenis: "anorganik", label: "Gelas Plastik" }
    ],
    tempatSampah: [
      { petak: 5, jenis: "organik" },
      { petak: 10, jenis: "anorganik" }
    ],
    penghalang: [],
    blokTersedia: ["maju","putar_kanan","putar_kiri","ambil","letakkan","ulangi"],
    optimal: 14, maksBlok: 22, tutorial: false,
    faktaSampah: "Memilah sampah organik dan anorganik membantu proses daur ulang menjadi lebih efisien."
  },
  {
    id: 7, judul: "Pola Berulang", misi: "Temukan pola pergerakan berulang untuk mencapai sampah yang jauh.",
    konsep: "Perulangan & Belokan",
    start: { petak: 1, arah: "kanan" },
    sampah: [
      { petak: 5, jenis: "anorganik", label: "Kaleng Makanan" },
      { petak: 25, jenis: "organik", label: "Daun" }
    ],
    tempatSampah: [
      { petak: 11, jenis: "anorganik" },
      { petak: 15, jenis: "organik" }
    ],
    penghalang: [7, 9, 17, 19],
    blokTersedia: ["maju","putar_kanan","putar_kiri","ambil","letakkan","ulangi"],
    optimal: 14, maksBlok: 22, tutorial: false,
    faktaSampah: "Kaleng aluminium bisa didaur ulang hingga 100% dan menghemat energi sebesar 95%."
  },
  {
    id: 8, judul: "Labirin Sampah", misi: "Navigasi labirin dan kumpulkan 3 sampah berbeda jenis.",
    konsep: "Kombinasi Penghalang",
    start: { petak: 1, arah: "kanan" },
    sampah: [
      { petak: 7, jenis: "organik", label: "Buah Busuk" },
      { petak: 14, jenis: "anorganik", label: "Kotak Karton" },
      { petak: 22, jenis: "organik", label: "Jerami" }
    ],
    tempatSampah: [
      { petak: 5, jenis: "organik" },
      { petak: 20, jenis: "anorganik" }
    ],
    penghalang: [2, 4, 8, 12, 16, 18, 23],
    blokTersedia: ["maju","putar_kanan","putar_kiri","ambil","letakkan","ulangi"],
    optimal: 22, maksBlok: 32, tutorial: false,
    faktaSampah: "Karton dapat didaur ulang menjadi kertas baru. Satu ton kertas daur ulang menyelamatkan 17 pohon."
  },
  {
    id: 9, judul: "Hemat Blok", misi: "Selesaikan dengan blok sesedikit mungkin. Batas blok sangat ketat.",
    konsep: "Efisiensi",
    start: { petak: 1, arah: "kanan" },
    sampah: [
      { petak: 3, jenis: "organik", label: "Sayuran" },
      { petak: 13, jenis: "anorganik", label: "Ember Plastik" },
      { petak: 21, jenis: "organik", label: "Daun Kering" },
      { petak: 25, jenis: "anorganik", label: "Baterai Bekas" }
    ],
    tempatSampah: [
      { petak: 5, jenis: "organik" },
      { petak: 15, jenis: "anorganik" }
    ],
    penghalang: [9, 19],
    blokTersedia: ["maju","putar_kanan","putar_kiri","ambil","letakkan","ulangi"],
    optimal: 20, maksBlok: 26, tutorial: false,
    faktaSampah: "Baterai mengandung bahan berbahaya. Jangan buang sembarangan — bawa ke tempat pengumpulan khusus."
  },
  {
    id: 10, judul: "Tantangan Akhir", misi: "Ujian terakhir! Gabungkan semua yang sudah kamu pelajari.",
    konsep: "Gabungan Semua Konsep",
    start: { petak: 1, arah: "kanan" },
    sampah: [
      { petak: 3, jenis: "organik", label: "Rumput" },
      { petak: 10, jenis: "anorganik", label: "Botol Minum" },
      { petak: 16, jenis: "organik", label: "Kulit Jeruk" },
      { petak: 23, jenis: "anorganik", label: "Kantong Plastik" },
      { petak: 25, jenis: "organik", label: "Sisa Tanaman" }
    ],
    tempatSampah: [
      { petak: 6, jenis: "organik" },
      { petak: 20, jenis: "anorganik" }
    ],
    penghalang: [4, 9, 12, 14, 18, 22],
    blokTersedia: ["maju","putar_kanan","putar_kiri","ambil","letakkan","ulangi"],
    optimal: 28, maksBlok: 38, tutorial: false,
    faktaSampah: "Dengan menguasai pemilahan sampah dan pemrograman dasar, kamu sudah menjadi pahlawan lingkungan."
  }
];

function petakToGrid(n) { return { col: (n - 1) % 5, row: Math.floor((n - 1) / 5) }; }
function gridToPetak(col, row) { return row * 5 + col + 1; }
