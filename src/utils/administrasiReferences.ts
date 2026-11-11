// Mapping referensi Catatan Pengawas / Rekomendasi Khusus untuk 16 butir Administrasi Pembelajaran (Instrumen 1)
// Mengacu pada:
// 1. Komponen & Butir Administrasi (Nama & Deskripsi)
// 2. Skala Penilaian (1 - 5):
//    - 5: Sangat Baik (SB) / Amat Baik
//    - 4: Baik (B)
//    - 3: Cukup (C)
//    - 2: Kurang (K)
//    - 1: Sangat Kurang (SK)

export const ADMINISTRASI_REFERENSI_CATATAN: Record<number, Record<number, string>> = {
  // 1. Kalender Pendidikan
  1: {
    5: 'Dokumen kalender pendidikan sangat lengkap, memetakan rincian alokasi pekan efektif semester secara tepat dan terinci.',
    4: 'Kalender pendidikan tersedia rapi dan rincian alokasi pekan efektif sesuai ketentuan dinas/sekolah.',
    3: 'Kalender pendidikan terlampir, namun perhitungan pekan efektif perlu diselaraskan dengan kalender kegiatan terbaru.',
    2: 'Kalender pendidikan belum memuat pembagian alokasi pekan efektif dan jam efektif secara jelas.',
    1: 'Dokumen kalender pendidikan dan pemetaan pekan efektif belum tersedia dalam berkas administrasi.',
  },

  // 3. Program Tahunan (Prota)
  3: {
    5: 'Program tahunan tersusun sangat sistematis, alokasi jam per lingkup materi terpetakan proporsional dan lengkap.',
    4: 'Program tahunan tersusun dengan baik sesuai struktur kurikulum dan materi pokok terpetakan jelas.',
    3: 'Prota sudah dibuat, namun alokasi waktu antar lingkup materi masih perlu disesuaikan dengan tingkat kesulitan materi.',
    2: 'Prota masih berbentuk draf awal dan belum mencakup pembagian alokasi waktu semester genap.',
    1: 'Dokumen Program Tahunan (Prota) belum disusun dalam berkas perencanaan.',
  },

  // 4. Pemanfaatan Hasil Asesmen Awal
  4: {
    5: 'Dokumentasi asesmen awal (kognitif & non-kognitif) sangat lengkap, dianalisis rapi, dan menjadi rujukan diferensiasi modul.',
    4: 'Terdapat bukti pelaksanaan asesmen awal dan hasil pemetaannya dimanfaatkan dalam perencanaan pembelajaran.',
    3: 'Instrumen asesmen awal ada, namun rekapitulasi analisis hasil pemetaan kesiapan belajar murid belum tertata rapi.',
    2: 'Hasil asesmen awal belum didokumentasikan tertulis dan belum dijadikan dasar pengelompokan belajar.',
    1: 'Bukti pelaksanaan maupun analisis hasil asesmen diagnostik/awal belum tersedia.',
  },

  // 5. CP, ATP & Perencanaan Pembelajaran
  5: {
    5: 'Dokumen CP, ATP, dan Modul Ajar/RPM tersusun sangat komprehensif, runtut, selaras, dan disahkan kepala sekolah.',
    4: 'Analisis CP, penyusunan ATP, dan Modul Ajar lengkap serta memenuhi komponen esensial kurikulum.',
    3: 'Modul ajar tersedia, namun penjabaran ATP ke dalam tujuan pembelajaran masih perlu diselaraskan.',
    2: 'Modul Ajar/RPM belum lengkap atau baru mengadopsi contoh tanpa modifikasi konteks satuan pendidikan.',
    1: 'Dokumen CP, ATP, dan Modul Ajar/perencanaan pembelajaran belum disiapkan.',
  },

  // 6. Bahan Ajar / Buku Guru & Siswa
  6: {
    5: 'Buku teks utama, modul ajar digital interaktif, dan referensi pengayaan kontekstual tersedia sangat lengkap.',
    4: 'Buku guru, buku teks siswa, dan materi pendukung pembelajaran tersedia baik dalam bentuk cetak maupun digital.',
    3: 'Buku teks utama tersedia, namun referensi materi pengayaan kontekstual masih perlu ditambah.',
    2: 'Ketersediaan bahan ajar pendukung masih sangat minim dan terbatas pada ringkasan materi seadanya.',
    1: 'Buku teks panduan atau bahan ajar pendukung pembelajaran belum tersedia secara memadai.',
  },

  // 7. Jadwal Pelajaran & Alokasi Jam
  7: {
    5: 'Jadwal mengajar resmi terpasang rapi, alokasi jam tatap muka dan jadwal kokurikuler/P5 terencana presisi.',
    4: 'Jadwal pelajaran resmi tersedia dan pembagian alokasi waktu mengajar mingguan sesuai struktur kurikulum.',
    3: 'Jadwal pelajaran ada, namun pencatatan alokasi jam tatap muka mingguan perlu diperjelas rinciannya.',
    2: 'Jadwal mengajar belum disahkan atau belum disesuaikan dengan pembagian jam mengajar terbaru.',
    1: 'Jadwal mengajar resmi guru belum didokumentasikan dalam berkas administrasi.',
  },

  // 8. Program Penilaian / Asesmen
  8: {
    5: 'Program asesmen sangat lengkap; memuat kisi-kisi instrumen formatif/sumatif, rubrik penilaian, dan KKTP terukur jelas.',
    4: 'Rencana asesmen formatif dan sumatif terprogram jelas beserta kriteria ketercapaian tujuan pembelajaran (KKTP).',
    3: 'Program asesmen ada, namun rubrik instrumen penilaian proses/formatif masih perlu dilengkapi.',
    2: 'Kisi-kisi instrumen penilaian dan penentuan KKTP belum tersusun secara sistematis.',
    1: 'Program penilaian, kisi-kisi, atau kriteria ketercapaian asesmen belum disusun.',
  },

  // 9. Daftar Nilai / Hasil Asesmen
  9: {
    5: 'Rekapitulasi nilai formatif, sumatif lingkup materi, dan nilai akhir tertata sangat rapi, transparan, dan akurat.',
    4: 'Daftar nilai terisi lengkap dengan catatan capaian kompetensi formatif dan sumatif siswa secara berkala.',
    3: 'Daftar nilai ada, namun penginputan nilai formatif harian masih perlu diperbarui secara berkala.',
    2: 'Rekap nilai belum terorganisir per lingkup materi dan baru memuat nilai tes akhir saja.',
    1: 'Buku atau daftar nilai hasil asesmen siswa belum tersedia/belum diisi.',
  },

  // 10. Daftar Kelas & Kelompok Belajar
  10: {
    5: 'Profil belajar siswa, minat, dan pembagian kelompok belajar diferensiasi terpetakan sangat jelas dan dinamis.',
    4: 'Data profil murid dan pembagian kelompok belajar tersusun rapi mendukung pembelajaran berpusat pada murid.',
    3: 'Data presensi kelas ada, namun pemetaan kelompok belajar berbasis karakteristik murid masih perlu diperjelas.',
    2: 'Pembagian kelompok belajar masih bersifat acak tanpa data profil kesiapan belajar peserta didik.',
    1: 'Data profil kelas dan kelompok belajar murid belum dibuat.',
  },

  // 11. Jurnal Harian Guru
  11: {
    5: 'Jurnal mengajar harian terisi sangat tertib, mencatat topik bahasan, kehadiran, kendala, dan tindak lanjut riil.',
    4: 'Jurnal harian terisi berkala dengan ringkasan aktivitas pembelajaran dan catatan kehadiran murid.',
    3: 'Jurnal harian ada, namun catatan refleksi kendala pembelajaran di kelas belum terisi konsisten.',
    2: 'Pengisian jurnal harian mengajar masih tertunda dan belum mencerminkan tahapan pembelajaran riil.',
    1: 'Jurnal harian guru belum tersedia atau belum pernah diisi.',
  },

  // 12. Absensi Murid
  12: {
    5: 'Pencatatan absensi murid harian sangat akurat, tertib, dan dilengkapi rekapitulasi persentase bulanan rapi.',
    4: 'Daftar presensi murid harian tercatat dengan baik dan tertib sesuai jadwal tatap muka.',
    3: 'Absensi murid terisi, namun rekapitulasi bulanan dan catatan izin/sakit masih perlu diperbarui.',
    2: 'Pencatatan kehadiran murid sering terlambat dan belum terorganisir dalam buku presensi resmi.',
    1: 'Dokumen absensi harian murid tidak tersedia dalam berkas administrasi.',
  },

  // 13. Analisis Hasil Asesmen / Nilai
  13: {
    5: 'Analisis butir soal dan daya serap kompetensi tersaji sangat mendalam, memetakan ketuntasan klasikal dan per individu.',
    4: 'Dokumen analisis hasil asesmen tersedia dan memetakan capaian ketuntasan murid dengan baik.',
    3: 'Hasil penilaian dianalisis secara sederhana, namun pemetaan materi yang memerlukan remedial belum terinci.',
    2: 'Analisis hasil asesmen belum dilakukan secara terstruktur, baru sebatas rekap nilai mentah.',
    1: 'Analisis hasil asesmen kompetensi murid belum dibuat.',
  },

  // 14. Program Perbaikan & Pengayaan
  14: {
    5: 'Program remedial dan pengayaan dirancang sangat terstruktur, memuat materi penanganan khusus dan bukti ketercapaian.',
    4: 'Jadwal, materi, dan bukti pelaksanaan tindak lanjut perbaikan (remedial) serta pengayaan terdokumentasi baik.',
    3: 'Program remedial sudah direncanakan, namun kegiatan pengayaan bagi murid yang tuntas lebih cepat perlu ditingkatkan.',
    2: 'Pelaksanaan remedial belum disertai instrumen soal perbaikan dan belum ada format pengayaan murid.',
    1: 'Dokumen program perbaikan (remedial) dan pengayaan belum disusun.',
  },

  // 15. Buku Refleksi Pembelajaran Guru
  15: {
    5: 'Buku refleksi mengajar memuat evaluasi diri yang sangat mendalam, jujur, serta melahirkan ide inovasi perbaikan berkelanjutan.',
    4: 'Guru mencatat hasil evaluasi efektivitas metode mengajar dan respon belajar murid secara berkala.',
    3: 'Catatan refleksi mengajar tersedia, namun pengisian masih bersifat periodik dan perlu ditingkatkan keteraturannya.',
    2: 'Refleksi pembelajaran baru berupa catatan ringkas sepintas tanpa rumusan tindak lanjut perbaikan.',
    1: 'Buku refleksi evaluasi pembelajaran guru belum tersedia.',
  },

  // 17. Buku Bimbingan & Konseling Siswa
  17: {
    5: 'Catatan bimbingan siswa terdokumentasi sangat rapi, memuat tindak lanjut pembinaan, dan sinergi aktif dengan Guru BK/wali kelas.',
    4: 'Terdapat catatan pembinaan akademik maupun karakter siswa serta koordinasi yang baik dengan tim BK.',
    3: 'Buku catatan pembinaan ada, namun tindak lanjut hasil konseling murid masih perlu dicatat secara berkesinambungan.',
    2: 'Catatan pembinaan siswa baru sebatas insidental dan belum terintegrasi dalam buku bimbingan teratur.',
    1: 'Buku catatan bimbingan konseling dan penanganan murid belum tersedia.',
  },

  // 24. Buku Komunikasi Orang Tua / Humas
  24: {
    5: 'Komunikasi dengan orang tua murid terdokumentasi sangat rapi, baik melalui jurnal penghubung, grup komunikasi, maupun catatan pertemuan.',
    4: 'Terdapat catatan komunikasi berkala dengan orang tua/wali murid mengenai perkembangan belajar siswa.',
    3: 'Komunikasi dengan orang tua berjalan, namun dokumentasi pertemuan/catatan kemitraan masih perlu dirapikan.',
    2: 'Pencatatan interaksi dengan orang tua masih bersifat lisan dan belum terdokumentasi secara tertib.',
    1: 'Buku atau rekam dokumentasi komunikasi dengan orang tua murid belum tersedia.',
  },
};

/**
 * Mengambil catatan rekomendasi khusus otomatis untuk suatu butir administrasi berdasarkan skala nilai (1-5).
 */
export function getAdministrasiReferenceNote(itemId: number, score: number): string {
  if (!score || score < 1 || score > 5) return '';
  return ADMINISTRASI_REFERENSI_CATATAN[itemId]?.[score] || '';
}

/**
 * Mengecek apakah teks catatan saat ini cocok dengan salah satu referensi otomatis butir administrasi tersebut.
 */
export function isAutoAdministrasiNote(itemId: number, currentText: string | undefined): boolean {
  if (!currentText) return true;
  const refs = ADMINISTRASI_REFERENSI_CATATAN[itemId];
  if (!refs) return false;
  return Object.values(refs).includes(currentText.trim());
}
