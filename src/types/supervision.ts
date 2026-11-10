export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  kelurahanKecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  teleponEmail: string;
  website: string;
  dinasPendidikan: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  pangkatGolKepalaSekolah: string;
  namaPengawas: string;
  nipPengawas: string;
  pangkatGolPengawas: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  kopLogoText: string;
}

export type SupervisionStatus = 'Belum Disupervisi' | 'Proses' | 'Selesai' | 'Perlu Tindak Lanjut';

export interface Teacher {
  id: string;
  namaGuru: string;
  nip: string;
  pangkatGolongan: string;
  mataPelajaran: string;
  kelasFase: string;
  jamTatapMuka: number;
  tanggalSupervisi: string;
  status: SupervisionStatus;
  noHp?: string;
  email?: string;
}

export interface Instrument1Admin {
  id: string;
  teacherId: string;
  tanggalTelaah: string;
  scores: Record<number, number>; // 1 to 24 with score 1 - 5
  catatanItem: Record<number, string>;
  catatanTemuan: string;
  rekomendasi: string;
  tanggapanGuru: string;
  ttdPengawas: boolean;
  ttdKepalaSekolah: boolean;
  ttdGuru: boolean;
  isCompleted: boolean;
  updatedAt: string;
}

export interface Instrument2ModulAjar {
  id: string;
  teacherId: string;
  tanggalTelaah: string;
  items: Record<number, { ya: boolean; catatan: string }>; // 1 to 20
  catatanTemuan: string;
  rekomendasi: string;
  tanggapanGuru: string;
  ttdPengawas: boolean;
  ttdKepalaSekolah: boolean;
  ttdGuru: boolean;
  isCompleted: boolean;
  updatedAt: string;
}

export interface Instrument3Observasi {
  id: string;
  teacherId: string;
  tanggalObservasi: string;
  jamKe: string;
  materiPokok: string;
  scores: Record<number, number>; // 1 to 22 with score 1 - 4
  catatanPerIndikator: Record<number, string>;
  buktiPembelajaran: {
    keselarasan: string;
    kerangka: string;
    memahami: string;
    mengaplikasi: string;
    merefleksi: string;
    memuliakan: string;
    mengakomodir: string;
  };
  catatanSupervisor: string;
  rekomendasiPerbaikan: string;
  tindakLanjut: string;
  ttdPengawas: boolean;
  ttdKepalaSekolah: boolean;
  ttdGuru: boolean;
  isCompleted: boolean;
  updatedAt: string;
}

export interface PascaRefleksiGuru {
  perasaan: string;
  halBaik: string;
  tantangan: string;
  responMurid: string;
  rencanaPerbaikan: string;
}

export interface PascaUmpanBalik {
  id: string;
  aspek: string;
  kekuatan: string;
  areaPengembangan: string;
}

export interface PascaRencanaTindakLanjut {
  id: string;
  aspek: string;
  tindakLanjut: string;
  penanggungJawab: string;
  waktuPelaksanaan: string;
  status: 'Direncanakan' | 'Dalam Proses' | 'Selesai';
}

export interface Instrument4PascaObservasi {
  id: string;
  teacherId: string;
  tanggalKegiatan: string;
  refleksiGuru: PascaRefleksiGuru;
  umpanBalik: PascaUmpanBalik[];
  rencanaTindakLanjut: PascaRencanaTindakLanjut[];
  catatanSupervisor: string;
  kesepakatanBersama: string;
  ttdPengawas: boolean;
  ttdKepalaSekolah: boolean;
  ttdGuru: boolean;
  isCompleted: boolean;
  updatedAt: string;
}

export interface AppSupervisionData {
  school: SchoolProfile;
  teachers: Teacher[];
  instrumen1: Record<string, Instrument1Admin>; // key is teacherId
  instrumen2: Record<string, Instrument2ModulAjar>; // key is teacherId
  instrumen3: Record<string, Instrument3Observasi>; // key is teacherId
  instrumen4: Record<string, Instrument4PascaObservasi>; // key is teacherId
}

// Indicator Definitions

export const INSTRUMEN_1_ITEMS: { id: number; nama: string; deskripsi: string }[] = [
  { id: 1, nama: 'Kalender Pendidikan', deskripsi: 'Kesesuaian dengan kalender pendidikan provinsi/sekolah dan alokasi pekan efektif' },
  { id: 3, nama: 'Program Tahunan (Prota)', deskripsi: 'Pemetaan materi esensial dan alokasi waktu tahunan sesuai struktur kurikulum' },
  { id: 4, nama: 'Pemanfaatan Hasil Asesmen Awal', deskripsi: 'Bukti dokumentasi diagnosis awal murid (kognitif/non-kognitif) sebagai dasar perencanaan' },
  { id: 5, nama: 'CP, ATP & Perencanaan Pembelajaran', deskripsi: 'Analisis Capaian Pembelajaran, Alur Tujuan Pembelajaran, dan Modul Ajar/RPM yang valid' },
  { id: 6, nama: 'Bahan Ajar / Buku Guru & Siswa', deskripsi: 'Ketersediaan buku teks utama, modul digital, referensi pendukung yang relevan' },
  { id: 7, nama: 'Jadwal Pelajaran & Alokasi Jam', deskripsi: 'Jadwal mengajar resmi dan kesesuaian jam tatap muka mingguan' },
  { id: 8, nama: 'Program Penilaian / Asesmen', deskripsi: 'Rencana asesmen formatif dan sumatif, kisi-kisi instrumen, dan kriteria ketercapaian (KKTP)' },
  { id: 9, nama: 'Daftar Nilai / Hasil Asesmen', deskripsi: 'Rekapitulasi nilai formatif, sumatif lingkup materi, dan sumatif akhir semester' },
  { id: 10, nama: 'Daftar Kelas & Kelompok Belajar', deskripsi: 'Data profil peserta didik, pembagian kelompok diferensiasi belajar di kelas' },
  { id: 11, nama: 'Jurnal Harian Guru', deskripsi: 'Catatan pelaksanaan pembelajaran harian, topik bahasan, kendala, dan kehadiran' },
  { id: 12, nama: 'Absensi Murid', deskripsi: 'Pencatatan presensi siswa harian secara tertib, akurat, dan terdokumentasi' },
  { id: 13, nama: 'Analisis Hasil Asesmen / Nilai', deskripsi: 'Analisis butir soal/aspek kompetensi dan pemetaan ketuntasan belajar siswa' },
  { id: 14, nama: 'Program Perbaikan & Pengayaan', deskripsi: 'Perencanaan dan pelaksanaan tindak lanjut remidial dan pengayaan terukur' },
  { id: 15, nama: 'Buku Refleksi Pembelajaran Guru', deskripsi: 'Catatan evaluasi diri guru terhadap metode, efektivitas strategi, dan respon murid' },
  { id: 17, nama: 'Buku Bimbingan & Konseling Siswa', deskripsi: 'Catatan pembinaan siswa bermasalah/berbakat dan koordinasi bersama Guru BK' },
  { id: 24, nama: 'Buku Komunikasi Orang Tua / Humas', deskripsi: 'Jurnal penghubung, pertemuan wali murid, dan tindak lanjut kemitraan keluarga' },
];

export const INSTRUMEN_2_ITEMS: { id: number; nama: string; deskripsi: string }[] = [
  { id: 1, nama: 'Identitas RPM / Modul Ajar', deskripsi: 'Memuat nama satuan pendidikan, nama guru, mata pelajaran, fase/kelas, dan alokasi waktu jelas' },
  { id: 2, nama: 'Identifikasi Kesiapan Murid', deskripsi: 'Mencantumkan data kesiapan, minat, atau profil belajar murid dari asesmen awal' },
  { id: 3, nama: 'Materi Pembelajaran Esensial', deskripsi: 'Materi kontekstual, terstruktur, bermakna, dan selaras dengan fase perkembangan murid' },
  { id: 4, nama: 'Dimensi Profil Lulusan', deskripsi: 'Mencantumkan dimensi profil lulusan (Beriman dan Bertaqwa Kepada Tuhan Yang Maha Esa, Kewargaan, Penalaran Kritis, Kreativitas, Kolaborasi, Kemandirian, Kesehatan, Komunikasi)' },
  { id: 5, nama: 'Capaian Pembelajaran (CP)', deskripsi: 'Mencantumkan elemen dan deskripsi CP resmi yang menjadi acuan' },
  { id: 6, nama: 'Keterkaitan Lintas Disiplin Ilmu', deskripsi: 'Mengintegrasikan keterhubungan materi dengan disiplin ilmu lain atau isu nyata kekinian' },
  { id: 7, nama: 'Tujuan Pembelajaran (TP)', deskripsi: 'Memuat kompetensi terukur dan lingkup materi dengan kata kerja operasional yang jelas' },
  { id: 8, nama: 'Topik / Pemahaman Bermakna', deskripsi: 'Menyajikan pertanyaan pemantik dan pemahaman bermakna yang relevan dengan kehidupan nyata' },
  { id: 9, nama: 'Praktek Pedagogis & Diferensiasi', deskripsi: 'Menerapkan strategi pembelajaran berdiferensiasi (konten, proses, atau produk)' },
  { id: 10, nama: 'Kemitraan Pembelajaran', deskripsi: 'Memfasilitasi kolaborasi aktif antar murid, kelompok diskusi, dan lingkungan sekitar' },
  { id: 11, nama: 'Lingkungan Pembelajaran Aman', deskripsi: 'Merancang suasana kelas interaktif, saling menghargai, menyenangkan, dan bebas perundungan' },
  { id: 12, nama: 'Pemanfaatan Teknologi Digital', deskripsi: 'Mengintegrasikan platform digital, media interaktif, simulasi, atau referensi online edukatif' },
  { id: 13, nama: 'Kegiatan Awal (Pendahuluan)', deskripsi: 'Memuat apersepsi kontekstual, motivasi, pemantik, dan penyampaian tujuan pembelajaran' },
  { id: 14, nama: 'Kegiatan Inti: Tahap MEMAHAMI', deskripsi: 'Aktivitas eksplorasi konsep, pemahaman esensial, dan penalaran materi secara mendalam' },
  { id: 15, nama: 'Kegiatan Inti: Tahap MENGAPLIKASI', deskripsi: 'Menghubungkan konsep baru, menerapkan dalam situasi nyata, eksplorasi lanjut, berpikir kritis & mencari solusi inovatif' },
  { id: 16, nama: 'Kegiatan Inti: Tahap MEREFLEKSI', deskripsi: 'Aktivitas mengolah pemikiran kritis, mendiskusikan makna, dan mengevaluasi pemahaman' },
  { id: 17, nama: 'Kegiatan Inti: Tahap MEMULIAKAN', deskripsi: 'Apresiasi keberagaman pandangan, penumbuhan budi pekerti, dan kepedulian sosial murid' },
  { id: 18, nama: 'Asesmen Awal (Diagnostik)', deskripsi: 'Instrumen diagnosis awal untuk memetakan kesiapan murid sebelum materi baru' },
  { id: 19, nama: 'Asesmen Proses (Formatif)', deskripsi: 'Teknik observasi, lembar ceklis, umpan balik langsung selama aktivitas berlangsung' },
  { id: 20, nama: 'Asesmen Akhir (Sumatif)', deskripsi: 'Evaluasi ketercapaian tujuan pembelajaran di akhir materi atau lingkup materi' },
  { id: 21, nama: 'Rubrik Penilaian & LKPD Terlampir', deskripsi: 'Lembar Kerja Peserta Didik (LKPD) dan rubrik penilaian kriteria ketercapaian (KKTP) lengkap' },
];

export interface ObservasiIndicator {
  id: number;
  section: string;
  sectionTitle: string;
  subSection?: string; // e.g., '1. Keselarasan', '2. Kerangka Pembelajaran', '3. Langkah Pembelajaran'
  nama: string;
  deskripsi: string;
  subItems?: { label: string; text: string }[];
  highlightHeader?: string; // e.g., 'MEMAHAMI:', 'MENGAPLIKASI:', 'MEREFLEKSI:'
}

export const INSTRUMEN_3_ITEMS: ObservasiIndicator[] = [
  // A. Perencanaan di Kelas
  { id: 1, section: 'A', sectionTitle: 'Perencanaan di Kelas', nama: 'Apersepsi & Motivasi Belajar', deskripsi: 'Guru mengaitkan materi dengan pengalaman nyata murid dan memantik motivasi belajar intrinsik' },
  { id: 2, section: 'A', sectionTitle: 'Perencanaan di Kelas', nama: 'Penyampaian Tujuan & Alur Aktivitas', deskripsi: 'Guru menyampaikan tujuan pembelajaran, kriteria keberhasilan, dan tahapan belajar secara eksplisit' },
  
  // B. Pelaksanaan Pembelajaran
  { id: 3, section: 'B', sectionTitle: 'Pelaksanaan Pembelajaran', nama: 'Stimulus Eksplorasi & Bernalar Kritis', deskripsi: 'Memberikan pertanyaan terbuka yang memantik nalar kritis dan eksplorasi rasa ingin tahu murid' },
  { id: 4, section: 'B', sectionTitle: 'Pelaksanaan Pembelajaran', nama: 'Kolaborasi & Diskusi Interaktif', deskripsi: 'Memandu kerja kelompok atau diskusi berpasangan secara aktif dan inklusif bagi semua murid' },
  { id: 5, section: 'B', sectionTitle: 'Pelaksanaan Pembelajaran', nama: 'Praktik Nyata & Unjuk Pemahaman', deskripsi: 'Mendorong murid memecahkan masalah nyata, membuat produk belajar, atau melakukan simulasi' },
  { id: 6, section: 'B', sectionTitle: 'Pelaksanaan Pembelajaran', nama: 'Refleksi Terbimbing Bersama Murid', deskripsi: 'Mengajak murid menyimpulkan pembelajaran dan mengidentifikasi makna yang dipelajari' },
  
  // C. Pengelolaan Kelas
  { id: 7, section: 'C', sectionTitle: 'Pengelolaan Kelas', nama: 'Suasana Belajar Kondusif & Positif', deskripsi: 'Menjaga keterlibatan murid dengan disiplin positif, saling menghormati, dan tanpa intimidasi' },
  { id: 8, section: 'C', sectionTitle: 'Pengelolaan Kelas', nama: 'Pemanfaatan Sarana & Digital', deskripsi: 'Menggunakan media pembelajaran, proyektor/alat peraga/gawai secara efektif dan tepat guna' },
  
  // D. IMPLEMENTASI PEMBELAJARAN MENDALAM
  // 1. Keselarasan
  {
    id: 9,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '1. Keselarasan',
    nama: 'Implementasi perencanaan selaras dengan perencanaan pembelajaran:',
    deskripsi: 'Implementasi perencanaan selaras dengan perencanaan pembelajaran pada tahap awal, inti, dan penutup.',
    subItems: [
      { label: 'a.', text: 'Awal pembelajaran' },
      { label: 'b.', text: 'Inti pembelajaran (memahami, mengaplikasi, merefleksi)' },
      { label: 'c.', text: 'Penutupan pembelajaran' },
    ],
  },
  {
    id: 10,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '1. Keselarasan',
    nama: 'Upaya mencapai tujuan pembelajaran:',
    deskripsi: 'Pencapaian dimensi profil lulusan selaras perencanaan atau disesuaikan konteks kebutuhan belajar murid.',
    subItems: [
      { label: 'a.', text: 'Upaya mencapai tujuan pembelajaran menuju pencapaian dimensi profil lulusan selaras dengan perencanaan, atau' },
      { label: 'b.', text: 'Disesuaikan dengan konteks kebutuhan belajar siswa' },
    ],
  },

  // 2. Kerangka Pembelajaran
  {
    id: 11,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '2. Kerangka Pembelajaran',
    nama: 'Strategi pembelajaran diimplementasikan:',
    deskripsi: 'Strategi pembelajaran diimplementasikan sesuai perencanaan / dimodifikasi sesuai kebutuhan / tantangan dapat terlewati untuk mencapai CP',
  },
  {
    id: 12,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '2. Kerangka Pembelajaran',
    nama: 'Lingkungan belajar:',
    deskripsi: 'Lingkungan belajar tergambar dalam langkah dan/atau asesmen pembelajaran',
  },
  {
    id: 13,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '2. Kerangka Pembelajaran',
    nama: 'Kemitraan pembelajaran:',
    deskripsi: 'Kemitraan pembelajaran tergambar dalam langkah dan/atau asesmen pembelajaran',
  },
  {
    id: 14,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '2. Kerangka Pembelajaran',
    nama: 'Pemanfaatan digital:',
    deskripsi: 'Pemanfaatan digital tergambar dalam langkah dan/atau asesmen pembelajaran',
  },

  // 3. Langkah Pembelajaran
  {
    id: 15,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '3. Langkah Pembelajaran',
    nama: 'Saling Memuliakan:',
    deskripsi: 'Guru dan murid saling MEMULIAKAN (bahasa verbal maupun nonverbal)',
  },
  {
    id: 16,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '3. Langkah Pembelajaran',
    nama: 'Tahap MEMAHAMI:',
    deskripsi: 'Penguasaan konsep mendalam melalui stimulus dan penanaman nilai moral.',
    highlightHeader: 'MEMAHAMI:',
    subItems: [
      { label: 'a.', text: 'Menghubungkan pengetahuan baru dengan pengetahuan lama' },
      { label: 'b.', text: 'Menstimulasi proses berpikir' },
      { label: 'c.', text: 'Menghubungkan dengan konteks nyata' },
      { label: 'd.', text: 'Eksploratif & kolaboratif' },
      { label: 'e.', text: 'Menanamkan nilai moral & karakter' },
    ],
  },
  {
    id: 17,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '3. Langkah Pembelajaran',
    nama: 'Tahap MENGAPLIKASI:',
    deskripsi: 'Penerapan konsep baru pada situasi nyata dan solusi inovatif.',
    highlightHeader: 'MENGAPLIKASI:',
    subItems: [
      { label: 'a.', text: 'Menghubungkan konsep baru dengan pengetahuan sebelumnya' },
      { label: 'b.', text: 'Menerapkan dalam situasi nyata/bidang lain' },
      { label: 'c.', text: 'Eksplorasi lanjut' },
      { label: 'd.', text: 'Berpikir kritis & solusi inovatif' },
    ],
  },
  {
    id: 18,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '3. Langkah Pembelajaran',
    nama: 'Tahap MEREFLEKSI:',
    deskripsi: 'Kesadaran metakognitif, evaluasi diri, dan regulasi emosi murid.',
    highlightHeader: 'MEREFLEKSI:',
    subItems: [
      { label: 'a.', text: 'Motivasi belajar' },
      { label: 'b.', text: 'Evaluasi diri' },
      { label: 'c.', text: 'Strategi berpikir' },
      { label: 'd.', text: 'Metakognisi' },
      { label: 'e.', text: 'Regulasi emosi' },
    ],
  },
  {
    id: 19,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '3. Langkah Pembelajaran',
    nama: 'Prinsip Pembelajaran Mendalam:',
    deskripsi: 'Prinsip pembelajaran mendalam (berkesadaran, bermakna, menggembirakan) tergambar pada setiap pengalaman belajar',
  },
  {
    id: 20,
    section: 'D',
    sectionTitle: 'Implementasi Pembelajaran Mendalam',
    subSection: '3. Langkah Pembelajaran',
    nama: 'Akomodasi Karakteristik Peserta Didik:',
    deskripsi: 'Praktik pembelajaran mengakomodir karakteristik peserta didik (usia, perkembangan, kemampuan, minat, gaya belajar, dll.)',
  },

  // E. Asesmen
  { id: 21, section: 'E', sectionTitle: 'Asesmen Pembelajaran', nama: 'Asesmen Formatif & Observasi Proses', deskripsi: 'Mengamati perkembangan keterampilan dan partisipasi murid dengan lembar ceklis/catatan dan umpan balik deskriptif' },
  { id: 22, section: 'E', sectionTitle: 'Asesmen Pembelajaran', nama: 'Asesmen Ketercapaian Tujuan (Sumatif)', deskripsi: 'Memastikan ketercapaian tujuan melalui instrumen yang sahih, objektif, dan rubrik penilaian' },

  // F. Refleksi Guru
  { id: 23, section: 'F', sectionTitle: 'Refleksi Guru', nama: 'Kesadaran Kekuatan & Pelajaran Belajar', deskripsi: 'Guru mampu mengenali momen keberhasilan dan respon positif murid secara objektif' },
  { id: 24, section: 'F', sectionTitle: 'Refleksi Guru', nama: 'Inisiatif Tindak Lanjut Mandiri', deskripsi: 'Guru menyampaikan gagasan perbaikan dan komitmen pengembangan diri secara proaktif' },
];

// Helper calculations
export function calculateInstrumen1Score(scores: Record<number, number>): {
  total: number;
  max: number;
  percentage: number;
  predikat: string;
  grade: 'A' | 'B' | 'C' | 'D' | '-';
  badgeColor: string;
} {
  const max = INSTRUMEN_1_ITEMS.length * 5; // 16 items * 5 = 80
  let total = 0;
  let filledCount = 0;
  INSTRUMEN_1_ITEMS.forEach((item) => {
    if (scores[item.id] && scores[item.id] > 0) {
      total += scores[item.id];
      filledCount++;
    }
  });

  if (filledCount === 0 || total === 0) {
    return {
      total: 0,
      max,
      percentage: 0,
      predikat: 'Belum Dinilai',
      grade: '-',
      badgeColor: 'bg-slate-100 text-slate-600 border-slate-300',
    };
  }

  const percentage = max > 0 ? Number(((total / max) * 100).toFixed(1)) : 0;
  
  let predikat = 'Kurang';
  let grade: 'A' | 'B' | 'C' | 'D' | '-' = 'D';
  let badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';

  if (percentage >= 90) {
    predikat = 'Sangat Baik';
    grade = 'A';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (percentage >= 80) {
    predikat = 'Baik';
    grade = 'B';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (percentage >= 70) {
    predikat = 'Cukup';
    grade = 'C';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  return { total, max, percentage, predikat, grade, badgeColor };
}

export function calculateInstrumen2Score(items: Record<number, { ya: boolean; catatan: string }>): {
  totalYa: number;
  max: number;
  percentage: number;
  predikat: string;
  grade: 'A' | 'B' | 'C' | 'D' | '-';
  badgeColor: string;
} {
  const max = INSTRUMEN_2_ITEMS.length;
  let totalYa = 0;
  let answeredCount = 0;
  INSTRUMEN_2_ITEMS.forEach((it) => {
    if (items[it.id] !== undefined) {
      answeredCount++;
      if (items[it.id].ya) totalYa++;
    }
  });

  if (answeredCount === 0) {
    return {
      totalYa: 0,
      max,
      percentage: 0,
      predikat: 'Belum Dinilai',
      grade: '-',
      badgeColor: 'bg-slate-100 text-slate-600 border-slate-300',
    };
  }

  const percentage = max > 0 ? Number(((totalYa / max) * 100).toFixed(1)) : 0;

  let predikat = 'Kurang';
  let grade: 'A' | 'B' | 'C' | 'D' | '-' = 'D';
  let badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';

  if (percentage >= 90) {
    predikat = 'Sangat Baik';
    grade = 'A';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (percentage >= 80) {
    predikat = 'Baik';
    grade = 'B';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (percentage >= 70) {
    predikat = 'Cukup';
    grade = 'C';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  return { totalYa, max, percentage, predikat, grade, badgeColor };
}

export function calculateInstrumen3Score(scores: Record<number, number>): {
  total: number;
  max: number;
  percentage: number;
  predikat: string;
  grade: 'A' | 'B' | 'C' | 'D' | '-';
  badgeColor: string;
} {
  const max = INSTRUMEN_3_ITEMS.length * 4; // 24 items * 4 = 96
  let total = 0;
  let filledCount = 0;
  INSTRUMEN_3_ITEMS.forEach((item) => {
    if (scores[item.id] && scores[item.id] > 0) {
      total += scores[item.id];
      filledCount++;
    }
  });

  if (filledCount === 0 || total === 0) {
    return {
      total: 0,
      max,
      percentage: 0,
      predikat: 'Belum Dinilai',
      grade: '-',
      badgeColor: 'bg-slate-100 text-slate-600 border-slate-300',
    };
  }

  const percentage = max > 0 ? Number(((total / max) * 100).toFixed(1)) : 0;

  let predikat = 'Kurang';
  let grade: 'A' | 'B' | 'C' | 'D' | '-' = 'D';
  let badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';

  if (percentage >= 90) {
    predikat = 'Sangat Baik';
    grade = 'A';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (percentage >= 80) {
    predikat = 'Baik';
    grade = 'B';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (percentage >= 70) {
    predikat = 'Cukup';
    grade = 'C';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  return { total, max, percentage, predikat, grade, badgeColor };
}

export function calculateCompositeGrade(p1: number, p2: number, p3: number, completedInst4: boolean): {
  averagePercentage: number;
  grade: 'A' | 'B' | 'C' | 'D' | '-';
  predikat: string;
  badgeClass: string;
} {
  const validScores = [p1, p2, p3].filter((s) => s > 0);
  if (validScores.length === 0) {
    return {
      averagePercentage: 0,
      grade: '-',
      predikat: 'Belum Dinilai',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-300',
    };
  }

  const averagePercentage = Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1));

  let grade: 'A' | 'B' | 'C' | 'D' | '-' = 'D';
  let predikat = 'Kurang';
  let badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';

  if (averagePercentage >= 90) {
    grade = 'A';
    predikat = 'Sangat Baik (Amat Baik)';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (averagePercentage >= 80) {
    grade = 'B';
    predikat = 'Baik';
    badgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (averagePercentage >= 70) {
    grade = 'C';
    predikat = 'Cukup';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  } else {
    grade = 'D';
    predikat = 'Kurang';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
  }

  return { averagePercentage, grade, predikat, badgeClass };
}
