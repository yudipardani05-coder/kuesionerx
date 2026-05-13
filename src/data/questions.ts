export interface Question {
  num: number;
  code: string;
  dimension: string;
  indicator: string;
  text: string;
}

export const sections = [
  { id: "respondent", title: "Data Responden", description: "Mohon isi data diri Anda dengan lengkap" },
  { id: "x1", title: "Kelompok 1: Sistem Penggajian (X1)", description: "Pernyataan terkait sistem penggajian di perusahaan" },
  { id: "x2", title: "Kelompok 2: Pengendalian Internal (X2)", description: "Pernyataan terkait pengendalian internal perusahaan" },
  { id: "y", title: "Kelompok 3: Perspektif Akuntansi Manajemen (Y)", description: "Pernyataan terkait perspektif akuntansi manajemen" },
];

export const scaleLabels = [
  { value: 1, label: "STS", full: "Sangat Tidak Setuju", color: "bg-red-500" },
  { value: 2, label: "KS", full: "Kurang Setuju", color: "bg-orange-400" },
  { value: 3, label: "N", full: "Netral", color: "bg-yellow-400" },
  { value: 4, label: "S", full: "Setuju", color: "bg-emerald-400" },
  { value: 5, label: "SS", full: "Sangat Setuju", color: "bg-green-600" },
];

export const questions: Question[] = [
  // X1 - Sistem Penggajian (Q1-Q15)
  { num: 1, code: "X1", dimension: "Fungsi yang Terkait", indicator: "Pemisahan Fungsi Kepegawaian", text: "Tugas bagian kepegawaian dalam mengelola data karyawan sudah jelas dan terpisah dari tugas lain." },
  { num: 2, code: "X1", dimension: "Fungsi yang Terkait", indicator: "Pemisahan Fungsi Kepegawaian", text: "Pencatatan kehadiran dan jam kerja saya dilakukan dengan tepat dan akurat." },
  { num: 3, code: "X1", dimension: "Fungsi yang Terkait", indicator: "Pemisahan Fungsi Kepegawaian", text: "Daftar gaji dibuat oleh petugas yang berwenang sesuai prosedur." },
  { num: 4, code: "X1", dimension: "Dokumen yang Digunakan", indicator: "Kartu Jam Hadir", text: "Saya menggunakan kartu jam hadir/finger print setiap hari kerja." },
  { num: 5, code: "X1", dimension: "Dokumen yang Digunakan", indicator: "Kartu Jam Hadir", text: "Daftar hadir digunakan sebagai dasar perhitungan gaji saya." },
  { num: 6, code: "X1", dimension: "Dokumen yang Digunakan", indicator: "Kartu Jam Hadir", text: "Saya menerima slip gaji setiap bulan yang menjelaskan rincian gaji saya." },
  { num: 7, code: "X1", dimension: "Catatan Akuntansi", indicator: "Jurnal Umum", text: "Setiap pembayaran gaji dicatat dalam laporan keuangan perusahaan." },
  { num: 8, code: "X1", dimension: "Catatan Akuntansi", indicator: "Jurnal Umum", text: "Ada catatan penghasilan karyawan yang disimpan perusahaan." },
  { num: 9, code: "X1", dimension: "Catatan Akuntansi", indicator: "Jurnal Umum", text: "Gaji saya merupakan bagian dari biaya operasional perusahaan." },
  { num: 10, code: "X1", dimension: "Prosedur Sistem", indicator: "Prosedur Pencatatan Waktu", text: "Prosedur pencatatan waktu kerja sudah berjalan dengan baik." },
  { num: 11, code: "X1", dimension: "Prosedur Sistem", indicator: "Prosedur Pencatatan Waktu", text: "Distribusi/pembagian gaji dilakukan secara teratur dan tepat waktu." },
  { num: 12, code: "X1", dimension: "Prosedur Sistem", indicator: "Prosedur Pencatatan Waktu", text: "Pembayaran gaji dilakukan sesuai dengan prosedur yang berlaku." },
  { num: 13, code: "X1", dimension: "Unsur Pengendalian", indicator: "Organisasi", text: "Struktur organisasi penggajian sudah jelas dan terorganisir." },
  { num: 14, code: "X1", dimension: "Unsur Pengendalian", indicator: "Organisasi", text: "Prosedur pencatatan penggajian dilakukan dengan teliti." },
  { num: 15, code: "X1", dimension: "Unsur Pengendalian", indicator: "Organisasi", text: "Setiap pembayaran gaji telah mendapat persetujuan dari atasan yang berwenang." },

  // X2 - Pengendalian Internal (Q16-Q30)
  { num: 16, code: "X2", dimension: "Lingkungan Pengendalian", indicator: "Integritas dan Etika", text: "Perusahaan menerapkan nilai integritas dan etika kerja dengan baik." },
  { num: 17, code: "X2", dimension: "Lingkungan Pengendalian", indicator: "Integritas dan Etika", text: "Karyawan di perusahaan ini memiliki kompetensi sesuai bidangnya." },
  { num: 18, code: "X2", dimension: "Lingkungan Pengendalian", indicator: "Integritas dan Etika", text: "Saya memahami struktur organisasi dan garis wewenang di perusahaan ini." },
  { num: 19, code: "X2", dimension: "Penilaian Risiko", indicator: "Identifikasi Risiko Internal", text: "Perusahaan mengenali risiko-risiko yang mungkin terjadi dari dalam." },
  { num: 20, code: "X2", dimension: "Penilaian Risiko", indicator: "Identifikasi Risiko Internal", text: "Perusahaan mengenali risiko-risiko yang mungkin datang dari luar." },
  { num: 21, code: "X2", dimension: "Penilaian Risiko", indicator: "Identifikasi Risiko Internal", text: "Perusahaan menganalisis risiko operasional secara berkala." },
  { num: 22, code: "X2", dimension: "Aktivitas Pengendalian", indicator: "Pemisahan Tugas", text: "Tugas dan tanggung jawab antar bagian sudah dipisah dengan jelas." },
  { num: 23, code: "X2", dimension: "Aktivitas Pengendalian", indicator: "Pemisahan Tugas", text: "Setiap aktivitas kerja didokumentasikan dengan baik." },
  { num: 24, code: "X2", dimension: "Aktivitas Pengendalian", indicator: "Pemisahan Tugas", text: "Aset dan dokumen perusahaan diamankan dengan baik." },
  { num: 25, code: "X2", dimension: "Informasi dan Komunikasi", indicator: "Sistem Informasi Operasional", text: "Informasi operasional disampaikan dengan jelas dan tepat waktu." },
  { num: 26, code: "X2", dimension: "Informasi dan Komunikasi", indicator: "Sistem Informasi Operasional", text: "Laporan keuangan perusahaan disusun secara akurat." },
  { num: 27, code: "X2", dimension: "Informasi dan Komunikasi", indicator: "Sistem Informasi Operasional", text: "Komunikasi antar karyawan dan atasan berjalan dengan baik." },
  { num: 28, code: "X2", dimension: "Pemantauan", indicator: "Evaluasi Berkala", text: "Kinerja karyawan dievaluasi secara berkala." },
  { num: 29, code: "X2", dimension: "Pemantauan", indicator: "Evaluasi Berkala", text: "Sistem pengendalian internal dinilai efektivitasnya secara berkala." },
  { num: 30, code: "X2", dimension: "Pemantauan", indicator: "Evaluasi Berkala", text: "Kekurangan yang ditemukan segera ditindaklanjuti dengan perbaikan." },

  // Y - Kinerja Karyawan (Q31-Q40)
{ num: 31, code: "Y", dimension: "Kualitas Kerja", indicator: "Akurasi Hasil Pekerjaan", text: "Saya merasa/percaya/mengetahui bahwa hasil pekerjaan saya akurat dan bebas dari kesalahan." },
{ num: 32, code: "Y", dimension: "Kualitas Kerja", indicator: "Ketelitian dalam Pelaksanaan Tugas", text: "Saya merasa/percaya/mengetahui bahwa saya melaksanakan tugas dengan teliti dan cermat." },
{ num: 33, code: "Y", dimension: "Kuantitas Kerja", indicator: "Volume Output Sesuai Target", text: "Saya merasa/percaya/mengetahui bahwa volume pekerjaan yang saya hasilkan sesuai dengan target yang ditetapkan." },
{ num: 34, code: "Y", dimension: "Kuantitas Kerja", indicator: "Jumlah Pekerjaan yang Diselesaikan", text: "Saya merasa/percaya/mengetahui bahwa jumlah pekerjaan yang saya selesaikan memenuhi standar yang diharapkan." },
{ num: 35, code: "Y", dimension: "Ketepatan Waktu", indicator: "Penyelesaian Tugas Sesuai Batas Waktu", text: "Saya merasa/percaya/mengetahui bahwa saya selalu menyelesaikan tugas sesuai dengan batas waktu yang ditentukan." },
{ num: 36, code: "Y", dimension: "Ketepatan Waktu", indicator: "Tidak Terjadi Keterlambatan Operasional", text: "Saya merasa/percaya/mengetahui bahwa tidak terjadi keterlambatan dalam pelaksanaan tugas operasional saya." },
{ num: 37, code: "Y", dimension: "Kemampuan Kerja Sama", indicator: "Kolaborasi dengan Rekan Kerja dan Atasan", text: "Saya merasa/percaya/mengetahui bahwa saya mampu bekerja sama dengan baik bersama rekan kerja dan atasan." },
{ num: 38, code: "Y", dimension: "Kemampuan Kerja Sama", indicator: "Partisipasi dalam Pencapaian Tujuan Tim", text: "Saya merasa/percaya/mengetahui bahwa saya aktif berpartisipasi dalam pencapaian tujuan tim." },
{ num: 39, code: "Y", dimension: "Tanggung Jawab", indicator: "Keandalan dalam Menyelesaikan Tugas", text: "Saya merasa/percaya/mengetahui bahwa saya dapat diandalkan dalam menyelesaikan setiap tugas yang diberikan." },
{ num: 40, code: "Y", dimension: "Tanggung Jawab", indicator: "Dedikasi dan Akuntabilitas Pekerjaan", text: "Saya merasa/percaya/mengetahui bahwa saya memiliki dedikasi tinggi dan bertanggung jawab penuh atas pekerjaan saya." },
