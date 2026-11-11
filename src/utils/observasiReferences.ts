// Mapping referensi catatan pengamat otomatis untuk 24 indikator Observasi Pembelajaran (Instrumen 3)
// Mengacu pada:
// 1. Fokus Indikator dan Deskripsi (Indikator 1-24)
// 2. Skala Nilai (1-4)
// 3. Petunjuk Skor:
//    - 1 = Tidak Tampak
//    - 2 = Kurang
//    - 3 = Baik
//    - 4 = Sangat Baik

export const OBSERVASI_REFERENSI_CATATAN: Record<number, Record<number, string>> = {
  // A. Perencanaan di Kelas
  1: {
    4: 'Guru sangat piawai mengaitkan materi dengan pengalaman nyata murid serta memantik motivasi belajar intrinsik yang tinggi.',
    3: 'Guru telah mengaitkan materi dengan pengalaman nyata murid dan memantik motivasi belajar dengan baik.',
    2: 'Apersepsi sudah diberikan namun pengaitan dengan konteks nyata dan pemantik motivasi murid masih terbatas.',
    1: 'Apersepsi dan pengaitan materi dengan pengalaman nyata murid belum tampak dilaksanakan di awal pembelajaran.',
  },
  2: {
    4: 'Tujuan pembelajaran, kriteria keberhasilan, dan alur tahapan belajar disampaikan secara sangat eksplisit, runtut, dan jelas dipahami murid.',
    3: 'Tujuan pembelajaran dan garis besar alur tahapan aktivitas belajar disampaikan dengan jelas dan terstruktur.',
    2: 'Tujuan pembelajaran disampaikan secara singkat, namun alur tahapan belajar dan kriteria ketercapaian kurang dijelaskan.',
    1: 'Penyampaian tujuan pembelajaran dan alur tahapan aktivitas belum tampak diutarakan kepada murid.',
  },

  // B. Pelaksanaan Pembelajaran
  3: {
    4: 'Pertanyaan pemantik terbuka sangat inspiratif, memicu nalar kritis mendalam, dan mendorong rasa ingin tahu eksploratif murid.',
    3: 'Guru memberikan pertanyaan terbuka yang merangsang proses berpikir dan memicu nalar kritis murid dengan baik.',
    2: 'Pertanyaan yang diajukan masih cenderung tertutup/hafalan dan belum optimal merangsang nalar kritis murid.',
    1: 'Stimulus atau pertanyaan terbuka untuk melatih nalar kritis dan eksplorasi murid belum tampak diterapkan.',
  },
  4: {
    4: 'Diskusi kelompok dan kolaborasi berjalan sangat aktif, inklusif, dan saling mendukung tanpa ada murid yang tertinggal.',
    3: 'Kerja kelompok atau diskusi berpasangan dipandu dengan baik, terarah, dan melibatkan keaktifan murid.',
    2: 'Kerja kelompok berlangsung namun interaksi belum merata dan bimbingan guru terhadap kelompok masih perlu ditingkatkan.',
    1: 'Aktivitas kerja kelompok atau diskusi interaktif antarmurid belum tampak dilaksanakan dalam proses belajar.',
  },
  5: {
    4: 'Murid sangat antusias menghasilkan unjuk kerja/karya nyata serta memecahkan studi kasus kontekstual secara inovatif.',
    3: 'Murid mempraktikkan konsep melalui penugasan nyata, lembar aktivitas, atau simulasi terarah secara mandiri.',
    2: 'Aktivitas unjuk kerja murid masih sebatas instruksi mekanis dan pengaitan pemecahan masalah kontekstual masih terbatas.',
    1: 'Aktivitas praktik nyata, pemecahan masalah kontekstual, atau unjuk pemahaman murid belum tampak di kelas.',
  },
  6: {
    4: 'Refleksi akhir terbimbing berlangsung sangat bermakna; murid mampu menyimpulkan intisari konsep dan manfaat belajarnya.',
    3: 'Guru membimbing murid menyimpulkan pembelajaran dan mengidentifikasi makna materi yang dipelajari dengan baik.',
    2: 'Refleksi akhir dilakukan tergesa-gesa dan perumusan simpulan pembelajaran belum melibatkan peran aktif murid.',
    1: 'Kegiatan refleksi terbimbing untuk menyimpulkan pembelajaran bersama murid belum tampak di akhir sesi.',
  },

  // C. Pengelolaan Kelas
  7: {
    4: 'Iklim kelas sangat positif dan aman; pembiasaan disiplin positif terbangun konsisten serta murid saling menghargai tanpa intimidasi.',
    3: 'Pengelolaan kelas kondusif, suasana belajar tertib, dan interaksi pembelajaran dilandasi rasa saling menghormati.',
    2: 'Keterlibatan murid fluktuatif dan guru masih perlu menegakkan kesepakatan kelas secara lebih konsisten dan positif.',
    1: 'Pengelolaan suasana kelas kurang kondusif dan penerapan disiplin positif belum tampak terkelola dengan baik.',
  },
  8: {
    4: 'Pemanfaatan media pembelajaran, alat peraga, dan teknologi digital sangat efektif, tepat guna, dan mempermudah pemahaman konsep.',
    3: 'Sarana belajar dan media digital pendukung dimanfaatkan dengan baik dan relevan mendukung alur pembelajaran.',
    2: 'Sarana dan media digital sudah digunakan namun belum optimal mendukung interaktivitas dan pemahaman murid.',
    1: 'Pemanfaatan sarana pendukung, alat peraga, atau media digital belum tampak difungsikan dalam pembelajaran.',
  },

  // D. IMPLEMENTASI PEMBELAJARAN MENDALAM
  // 1. Keselarasan
  9: {
    4: 'Seluruh tahapan awal, inti (memahami, mengaplikasi, merefleksi), dan penutup terlaksana sangat selaras dan terpadu dengan perencanaan.',
    3: 'Implementasi pembelajaran pada tahap awal, inti, dan penutup terlaksana secara teratur dan selaras dengan perencanaan.',
    2: 'Tahapan pembelajaran mulai berjalan namun kesinambungan antara kegiatan awal, inti, dan penutup masih belum utuh.',
    1: 'Pelaksanaan pembelajaran di kelas belum tampak selaras dengan skenario perencanaan tahapan pembelajaran yang dirancang.',
  },
  10: {
    4: 'Upaya pencapaian tujuan dan dimensi profil lulusan terwujud nyata, terintegrasi utuh, dan sangat adaptif dengan kebutuhan belajar siswa.',
    3: 'Upaya mencapai tujuan pembelajaran dan dimensi profil lulusan berjalan selaras dengan perencanaan dan kebutuhan murid.',
    2: 'Upaya mencapai tujuan pembelajaran telah berjalan namun penguatan dimensi profil lulusan dan respon kebutuhan siswa masih minim.',
    1: 'Upaya terencana untuk mengaitkan pembelajaran dengan pencapaian dimensi profil lulusan belum tampak di kelas.',
  },

  // 2. Kerangka Pembelajaran
  11: {
    4: 'Strategi pembelajaran diimplementasikan sangat adaptif; modifikasi dilakukan tepat sasaran dan tantangan belajar terlewati prima demi CP.',
    3: 'Strategi pembelajaran diimplementasikan sesuai perencanaan dan berhasil memfasilitasi ketercapaian Capaian Pembelajaran.',
    2: 'Strategi pembelajaran diterapkan cukup kaku sehingga penyesuaian terhadap dinamika kesulitan belajar murid masih kurang.',
    1: 'Penerapan strategi pembelajaran belum tampak terarah dalam memfasilitasi murid mencapai Capaian Pembelajaran (CP).',
  },
  12: {
    4: 'Penataan lingkungan belajar fisik maupun suasana emosional sangat hidup, memfasilitasi kolaborasi, dan terdokumentasi dalam langkah/asesmen.',
    3: 'Lingkungan belajar tercipta kondusif dan tergambar jelas mendukung langkah aktivitas serta asesmen pembelajaran.',
    2: 'Pengaturan lingkungan belajar belum optimal mendukung kenyamanan dan fleksibilitas interaksi antar-peserta didik.',
    1: 'Pengelolaan lingkungan belajar belum tampak dirancang atau dimanfaatkan dalam langkah maupun asesmen pembelajaran.',
  },
  13: {
    4: 'Kemitraan pembelajaran saling memberdayakan antar-murid, guru, dan sumber belajar/lingkungan sekitar terjalin sangat harmonis.',
    3: 'Kemitraan dan kolaborasi belajar tergambar dengan baik dalam langkah kerja sama maupun asesmen antarmurid.',
    2: 'Kemitraan pembelajaran masih didominasi instruksi satu arah dan interaksi kemitraan antar-murid masih terbatas.',
    1: 'Pola kemitraan pembelajaran yang melibatkan kerja sama aktif murid maupun lingkungan belum tampak di kelas.',
  },
  14: {
    4: 'Integrasi teknologi digital berlangsung interaktif, kreatif, dan berdampak nyata memperkaya pengalaman belajar serta asesmen.',
    3: 'Pemanfaatan perangkat atau platform digital tergambar dengan baik dalam memfasilitasi aktivitas belajar dan asesmen.',
    2: 'Pemanfaatan digital masih sebatas penayangan pasif dan belum mengoptimalkan partisipasi aktif murid dalam proses belajar.',
    1: 'Pemanfaatan teknologi digital belum tampak diterapkan dalam langkah pembelajaran maupun pelaksanaan asesmen.',
  },

  // 3. Langkah Pembelajaran
  15: {
    4: 'Budaya saling memuliakan terwujud prima lewat bahasa tutur yang santun, bahasa tubuh hangat, apresiasi tulus, dan empati timbal balik.',
    3: 'Komunikasi verbal dan nonverbal guru serta murid mencerminkan sikap saling menghormati, ramah, dan memuliakan.',
    2: 'Sikap saling menghormati sudah ada namun respons apresiatif terhadap keunikan dan kesulitan murid masih perlu diperkuat.',
    1: 'Pembiasaan bahasa santun dan budaya saling memuliakan antar-guru dan murid belum tampak terbangun di kelas.',
  },
  16: {
    4: 'Tahap memahami terlaksana sangat mendalam; pengetahuan lama-baru terkoneksi kontekstual, eksploratif, serta sarat nilai moral-karakter.',
    3: 'Murid difasilitasi memahami konsep esensial secara terarah melalui stimulus berpikir, konteks nyata, dan kerja kolaboratif.',
    2: 'Tahap memahami konsep masih bersifat transfer informasi satu arah dan pengaitan dengan konteks nyata masih dangkal.',
    1: 'Langkah pembelajaran untuk menstimulasi proses memahami secara mendalam dan kontekstual belum tampak dilaksanakan.',
  },
  17: {
    4: 'Murid sangat terampil menghubungkan konsep, mengaplikasikannya pada situasi nyata, bereksplorasi lanjut, dan melahirkan solusi inovatif.',
    3: 'Murid mampu mengaplikasikan konsep yang dipelajari ke dalam studi kasus nyata dengan penalaran kritis yang baik.',
    2: 'Tahap mengaplikasi konsep masih sebatas mengerjakan soal latihan tertulis standar dan belum menyentuh situasi nyata/solusi kritis.',
    1: 'Tahap mengaplikasi konsep pada situasi nyata, eksplorasi lanjutan, atau penemuan solusi inovatif belum tampak di kelas.',
  },
  18: {
    4: 'Refleksi metakognitif terbangun sangat matang; murid aktif mengevaluasi diri, mengenali strategi berpikirnya, dan mengelola motivasi belajarnya.',
    3: 'Murid dibimbing mengevaluasi diri, menelaah pemahaman materi, dan menyadari motivasi belajarnya dengan baik.',
    2: 'Tahap merefleksi masih sebatas menanyakan kesulitan belajar umum dan belum mengasah metakognisi atau regulasi emosi murid.',
    1: 'Langkah merefleksi yang memandu evaluasi diri, strategi berpikir, atau metakognisi murid belum tampak terlaksana.',
  },
  19: {
    4: 'Prinsip berkesadaran (mindful), bermakna (meaningful), dan menggembirakan (joyful) hidup secara nyata pada setiap denyut pengalaman belajar.',
    3: 'Pengalaman belajar dirasakan bermakna dan menyenangkan sehingga murid terlibat penuh dengan kesadaran belajar yang positif.',
    2: 'Pembelajaran berlangsung tertib namun penciptaan pengalaman belajar yang menggembirakan dan bermakna masih kurang terasa.',
    1: 'Prinsip pembelajaran yang berkesadaran, bermakna, dan menggembirakan belum tampak tercermin dalam pengalaman belajar.',
  },
  20: {
    4: 'Diferensiasi proses dan produk belajar mengakomodasi perbedaan usia, minat, kecepatan belajar, dan gaya belajar murid secara prima.',
    3: 'Praktik pembelajaran telah memberikan perhatian dan akomodasi yang baik terhadap keberagaman karakteristik peserta didik.',
    2: 'Akomodasi keragaman murid masih terbatas, perlakuan pembelajaran cenderung disamaratakan untuk seluruh murid.',
    1: 'Praktik pembelajaran belum tampak mengakomodir perbedaan karakteristik, kemampuan, minat, atau gaya belajar peserta didik.',
  },

  // E. Asesmen Pembelajaran
  21: {
    4: 'Asesmen formatif berjalan dinamis dan berkelanjutan; guru mencatat kemajuan proses belajar dan memberi umpan balik deskriptif seketika.',
    3: 'Guru mengamati proses kerja murid dan memberikan umpan balik perbaikan secara deskriptif dan terarah.',
    2: 'Pemantauan aktivitas murid dilakukan namun umpan balik yang diberikan masih umum dan belum terdokumentasi dalam instrumen pengamatan.',
    1: 'Pelaksanaan asesmen formatif proses atau pemberian umpan balik deskriptif selama belajar belum tampak dilakukan.',
  },
  22: {
    4: 'Ketercapaian tujuan pembelajaran diukur melalui instrumen yang sangat sahih, rubrik penilaian transparan, dan kriteria terukur jelas.',
    3: 'Penilaian ketercapaian tujuan belajar dilaksanakan secara objektif menggunakan instrumen dan rubrik yang sesuai.',
    2: 'Instrumen asesmen ketercapaian sudah ada namun rubrik kriteria penilaian belum terkomunikasikan secara transparan.',
    1: 'Instrumen yang sahih dan rubrik penilaian yang jelas untuk mengukur ketercapaian tujuan pembelajaran belum tampak digunakan.',
  },

  // F. Refleksi Guru
  23: {
    4: 'Guru memiliki kesadaran reflektif yang sangat tajam; mampu mengidentifikasi momen puncak keberhasilan kelas dan dinamika respons murid.',
    3: 'Guru mampu mengenali kekuatan pembelajaran dan respon positif murid secara objektif dan berkesadaran.',
    2: 'Guru menyadari beberapa momen keberhasilan pembelajaran namun analisis terhadap respon murid masih bersifat umum.',
    1: 'Kesadaran reflektif guru dalam mengenali kekuatan maupun pelajaran bermakna dari respon belajar murid belum tampak.',
  },
  24: {
    4: 'Guru sangat proaktif mengutarakan gagasan inovasi tindak lanjut dan berkomitmen kuat melakukan pengembangan diri secara mandiri.',
    3: 'Guru menunjukkan inisiatif yang baik dalam menyusun rencana perbaikan mengajar dan terbuka untuk peningkatan kompetensi.',
    2: 'Guru menyetujui masukan perbaikan namun inisiatif gagasan tindak lanjut mandiri masih menunggu arahan dari supervisor.',
    1: 'Inisiatif atau komitmen mandiri untuk merumuskan rencana tindak lanjut perbaikan pembelajaran belum tampak disampaikan guru.',
  },
};

/**
 * Mengambil catatan referensi otomatis untuk suatu indikator berdasarkan skala skor (1-4).
 */
export function getObservasiReferenceNote(indicatorId: number, score: number): string {
  if (!score || score < 1 || score > 4) return '';
  return OBSERVASI_REFERENSI_CATATAN[indicatorId]?.[score] || '';
}

/**
 * Mengecek apakah teks catatan saat ini cocok dengan salah satu referensi otomatis indikator tersebut.
 */
export function isAutoReferenceNote(indicatorId: number, currentText: string | undefined): boolean {
  if (!currentText) return true;
  const refs = OBSERVASI_REFERENSI_CATATAN[indicatorId];
  if (!refs) return false;
  return Object.values(refs).includes(currentText.trim());
}
