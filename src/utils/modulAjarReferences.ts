// Mapping referensi Catatan Pengamatan / Bukti Penunjang untuk 21 indikator Telaah Modul Ajar (Instrumen 2)
// Mengacu pada:
// 1. Indikator Komponen Modul Ajar (Nama & Deskripsi)
// 2. Keterlaksanaan:
//    - Ya: Terlaksana / Lengkap / Terintegrasi dalam modul ajar
//    - Tidak: Belum Terlaksana / Belum Lengkap / Perlu penambahan

export const MODUL_AJAR_REFERENSI_CATATAN: Record<number, { ya: string; tidak: string }> = {
  // 1. Identitas RPM / Modul Ajar
  1: {
    ya: 'Identitas modul ajar lengkap memuat satuan pendidikan, nama guru, fase/kelas, dan alokasi waktu yang jelas.',
    tidak: 'Komponen identitas belum lengkap, alokasi waktu atau fase/kelas belum dicantumkan secara spesifik.',
  },

  // 2. Identifikasi Kesiapan Murid
  2: {
    ya: 'Tercantum bukti identifikasi kesiapan belajar, minat, dan profil murid sebagai rujukan diferensiasi.',
    tidak: 'Belum mencantumkan data kesiapan atau profil belajar murid dari hasil asesmen awal.',
  },

  // 3. Materi Pembelajaran Esensial
  3: {
    ya: 'Uraian materi ajar kontekstual, terstruktur secara logis, dan relevan dengan fase perkembangan kognitif murid.',
    tidak: 'Materi ajar masih bersifat teoretis umum dan belum dikaitkan secara kontekstual dengan kehidupan murid.',
  },

  // 4. Dimensi Profil Lulusan
  4: {
    ya: 'Dimensi profil lulusan terintegrasi eksplisit dalam tujuan dan langkah aktivitas pembelajaran.',
    tidak: 'Dimensi profil lulusan belum dicantumkan atau belum terhubung dengan aktivitas belajar yang dirancang.',
  },

  // 5. Capaian Pembelajaran (CP)
  5: {
    ya: 'Elemen dan kalimat Capaian Pembelajaran (CP) fase bersangkutan dicantumkan secara tepat dan akurat.',
    tidak: 'Kalimat CP atau elemen Capaian Pembelajaran resmi belum tertera dalam dokumen modul ajar.',
  },

  // 6. Keterkaitan Lintas Disiplin Ilmu
  6: {
    ya: 'Tergambar integrasi lintas disiplin ilmu dan pengaitan materi dengan isu nyata lingkungan/masyarakat kekinian.',
    tidak: 'Belum tampak adanya keterkaitan lintas disiplin ilmu atau isu kontekstual dalam skenario modul ajar.',
  },

  // 7. Tujuan Pembelajaran (TP)
  7: {
    ya: 'Tujuan pembelajaran memuat kompetensi terukur dengan kata kerja operasional (KKO) dan materi yang spesifik.',
    tidak: 'Rumusan tujuan pembelajaran belum terukur jelas dan kata kerja operasional belum operasional.',
  },

  // 8. Topik / Pemahaman Bermakna
  8: {
    ya: 'Menyajikan pertanyaan pemantik terbuka dan rumusan pemahaman bermakna yang relevan dengan kehidupan nyata.',
    tidak: 'Pertanyaan pemantik dan rumusan pemahaman bermakna belum tertera secara eksplisit dalam rancangan.',
  },

  // 9. Praktek Pedagogis & Diferensiasi
  9: {
    ya: 'Rencana diferensiasi (konten/proses/produk) dijabarkan konkret untuk mengakomodasi keragaman murid.',
    tidak: 'Strategi diferensiasi belum dijabarkan konkret dalam langkah kegiatan belajar mengajar.',
  },

  // 10. Kemitraan Pembelajaran
  10: {
    ya: 'Skenario pembelajaran memfasilitasi kerja kelompok, kolaborasi aktif antarmurid, dan interaksi kemitraan.',
    tidak: 'Aktivitas masih didominasi pola individual dan belum memfasilitasi kemitraan kolaboratif antar-peserta didik.',
  },

  // 11. Lingkungan Pembelajaran Aman
  11: {
    ya: 'Rancangan kegiatan memuat pengondisian iklim kelas interaktif, inklusif, dan saling menghargai tanpa perundungan.',
    tidak: 'Pengondisian suasana kelas aman, positif, dan inklusif belum tergambar dalam langkah pembelajaran.',
  },

  // 12. Pemanfaatan Teknologi Digital
  12: {
    ya: 'Media digital interaktif, platform daring, atau tautan referensi edukatif terintegrasi jelas dalam alur belajar.',
    tidak: 'Pemanfaatan media digital atau sumber belajar interaktif belum dicantumkan dalam modul ajar.',
  },

  // 13. Kegiatan Awal (Pendahuluan)
  13: {
    ya: 'Tahap pendahuluan memuat salam, apersepsi kontekstual, motivasi, dan penyampaian tujuan serta alur belajar.',
    tidak: 'Langkah kegiatan awal belum memuat apersepsi kontekstual atau penyampaian tujuan pembelajaran secara jelas.',
  },

  // 14. Kegiatan Inti: Tahap MEMAHAMI
  14: {
    ya: 'Aktivitas eksplorasi konsep dan penalaran materi esensial dirancang mendalam melalui bimbingan terstruktur.',
    tidak: 'Langkah memahami konsep baru masih bersifat penyampaian searah dan belum memicu eksplorasi aktif murid.',
  },

  // 15. Kegiatan Inti: Tahap MENGAPLIKASI
  15: {
    ya: 'Tahap aplikasi memfasilitasi murid menerapkan konsep pada situasi nyata dan memecahkan masalah kritis secara inovatif.',
    tidak: 'Belum tampak aktivitas penerapan konsep dalam situasi nyata atau pemecahan masalah kritis yang aplikatif.',
  },

  // 16. Kegiatan Inti: Tahap MEREFLEKSI
  16: {
    ya: 'Langkah merefleksi memandu murid mengevaluasi pemahaman diri, berdiskusi makna, dan menyimpulkan hasil belajar.',
    tidak: 'Skenario refleksi diri murid dan diskusi simpulan makna pembelajaran belum terprogram jelas.',
  },

  // 17. Kegiatan Inti: Tahap MEMULIAKAN
  17: {
    ya: 'Memuat pembiasaan apresiasi keberagaman pandangan, saling memuliakan, empati, dan penumbuhan karakter mulia.',
    tidak: 'Penanaman sikap saling memuliakan dan apresiasi keberagaman belum tercermin dalam kegiatan inti.',
  },

  // 18. Asesmen Awal (Diagnostik)
  18: {
    ya: 'Tersedia instrumen asesmen diagnostik awal beserta petunjuk pemetaan kesiapan peserta didik.',
    tidak: 'Instrumen asesmen awal/diagnostik belum dilampirkan dalam perangkat modul ajar.',
  },

  // 19. Asesmen Proses (Formatif)
  19: {
    ya: 'Rencana asesmen formatif proses dilengkapi lembar ceklis observasi dan rubrik umpan balik deskriptif.',
    tidak: 'Rencana asesmen formatif proses dan instrumen observasi keterlibatan murid belum terlampir.',
  },

  // 20. Asesmen Akhir (Sumatif)
  20: {
    ya: 'Instrumen asesmen sumatif mengukur ketercapaian tujuan secara sahih dilengkapi kisi-kisi dan rubrik kriteria.',
    tidak: 'Instrumen asesmen sumatif akhir lingkup materi atau kriteria penilaiannya belum dilampirkan.',
  },

  // 21. Rubrik Penilaian & LKPD Terlampir
  21: {
    ya: 'Lembar Kerja Peserta Didik (LKPD) dan rubrik kriteria ketercapaian tujuan (KKTP) terlampir lengkap dan siap pakai.',
    tidak: 'LKPD atau rubrik penilaian kriteria ketercapaian tujuan (KKTP) belum terlampir secara lengkap.',
  },
};

/**
 * Mengambil catatan pengamatan / bukti penunjang otomatis berdasarkan indikator modul ajar dan status keterlaksanaan (ya/tidak).
 */
export function getModulAjarReferenceNote(itemId: number, isYa: boolean): string {
  const ref = MODUL_AJAR_REFERENSI_CATATAN[itemId];
  if (!ref) return isYa ? 'Lengkap dan terintegrasi dengan baik' : 'Belum termuat dalam modul ajar';
  return isYa ? ref.ya : ref.tidak;
}

/**
 * Mengecek apakah catatan saat ini cocok dengan salah satu referensi otomatis (ya/tidak).
 */
export function isAutoModulAjarNote(itemId: number, currentText: string | undefined): boolean {
  if (!currentText) return true;
  const ref = MODUL_AJAR_REFERENSI_CATATAN[itemId];
  if (!ref) {
    return currentText === 'Lengkap dan terintegrasi dengan baik' || currentText === 'Belum termuat dalam modul ajar';
  }
  return currentText.trim() === ref.ya || currentText.trim() === ref.tidak;
}
