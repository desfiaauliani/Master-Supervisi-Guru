import {
  AppSupervisionData,
  SchoolProfile,
  Teacher,
  Instrument1Admin,
  Instrument2ModulAjar,
  Instrument3Observasi,
  Instrument4PascaObservasi,
  calculateInstrumen1Score,
  calculateInstrumen2Score,
  calculateInstrumen3Score,
  calculateCompositeGrade,
} from '../types/supervision';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'supervisi_digital_master_v2';

export const DEFAULT_SCHOOL: SchoolProfile = {
  namaSekolah: 'SMA Negeri 1 Teladan Nusantara',
  npsn: '10293847',
  alamatSekolah: 'Jl. Pendidikan No. 45, Kompleks Karang Anyar',
  kelurahanKecamatan: 'Kel. Sukamaju, Kec. Mentari Jaya',
  kotaKabupaten: 'Kota Metropolitan',
  provinsi: 'Provinsi Jawa Barat',
  teleponEmail: '(021) 7891234 / info@sman1teladan.sch.id',
  website: 'https://sman1teladan.sch.id',
  dinasPendidikan: 'Dinas Pendidikan dan Kebudayaan Provinsi',
  namaKepalaSekolah: 'Dr. H. Bambang Sudarsono, M.Pd.',
  nipKepalaSekolah: '19680512 199303 1 004',
  pangkatGolKepalaSekolah: 'Pembina Utama Muda, IV/c',
  namaPengawas: 'Dra. Hj. Ratna Juwita, M.Si.',
  nipPengawas: '19650420 199002 2 001',
  pangkatGolPengawas: 'Pembina Tingkat I, IV/b',
  tahunAjaran: '2024/2025',
  semester: 'Ganjil',
  kopLogoText: 'PEMERINTAH PROVINSI JAWA BARAT\nDINAS PENDIDIKAN DAN KEBUDAYAAN\nCABANG DINAS WILAYAH III',
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    namaGuru: 'Siti Rahmawati, S.Pd., M.Pd.',
    nip: '19820315 200604 2 018',
    pangkatGolongan: 'Penata Tingkat I, III/d',
    mataPelajaran: 'Bahasa Indonesia',
    kelasFase: 'Kelas X / Fase E',
    jamTatapMuka: 24,
    tanggalSupervisi: '2024-10-14',
    status: 'Selesai',
    noHp: '0812-3456-7890',
    email: 'siti.rahmawati@sman1teladan.sch.id',
  },
];

import { getAdministrasiReferenceNote } from './administrasiReferences';

// Helper to generate sample Instrument 1
function createSampleInst1(teacherId: string, baseScore: number): Instrument1Admin {
  const scores: Record<number, number> = {};
  const catatanItem: Record<number, string> = {};
  for (let i = 1; i <= 24; i++) {
    // vary slightly around baseScore (between 3 and 5)
    const offset = (i % 5 === 0) ? -1 : (i % 7 === 0) ? 0 : 0;
    scores[i] = Math.max(3, Math.min(5, baseScore + offset));
    catatanItem[i] = getAdministrasiReferenceNote(i, scores[i]);
  }

  return {
    id: `inst1-${teacherId}`,
    teacherId,
    tanggalTelaah: '2024-10-14',
    scores,
    catatanItem,
    catatanTemuan: 'Seluruh perangkat administrasi pembelajaran tersusun sangat rapi, terstruktur, dan sesuai panduan Kurikulum Merdeka.',
    rekomendasi: 'Pertahankan ketertiban administrasi dan bagikan praktik baik (best practice) jurnal refleksi ke guru serumpun.',
    tanggapanGuru: 'Terima kasih atas bimbingan dan apresiasi Pengawas. Saya siap mengimbaskan kepada rekan guru di MGMP sekolah.',
    ttdPengawas: true,
    ttdKepalaSekolah: true,
    ttdGuru: true,
    isCompleted: true,
    updatedAt: new Date().toISOString(),
  };
}

import { getModulAjarReferenceNote } from './modulAjarReferences';

// Helper to generate sample Instrument 2
function createSampleInst2(teacherId: string, yaCount: number = 20): Instrument2ModulAjar {
  const items: Record<number, { ya: boolean; catatan: string }> = {};
  for (let i = 1; i <= 21; i++) {
    const isYa = i <= yaCount;
    items[i] = {
      ya: isYa,
      catatan: getModulAjarReferenceNote(i, isYa),
    };
  }

  return {
    id: `inst2-${teacherId}`,
    teacherId,
    tanggalTelaah: '2024-10-15',
    items,
    catatanTemuan: 'Modul Ajar dirancang dengan tahapan Deep Learning (Memahami, Merefleksi, Memuliakan) yang sangat aplikatif.',
    rekomendasi: 'Perkaya alternatif LKPD berbasis studi kasus kontekstual kekinian dan penguatan rubrik asesmen formatif.',
    tanggapanGuru: 'Masukan sangat membantu untuk memperkaya LKPD pada pertemuan bab berikutnya.',
    ttdPengawas: true,
    ttdKepalaSekolah: true,
    ttdGuru: true,
    isCompleted: true,
    updatedAt: new Date().toISOString(),
  };
}

import { getObservasiReferenceNote } from './observasiReferences';

// Helper to generate sample Instrument 3
function createSampleInst3(teacherId: string, baseScore: number = 4): Instrument3Observasi {
  const scores: Record<number, number> = {};
  const catatanPerIndikator: Record<number, string> = {};
  for (let i = 1; i <= 24; i++) {
    scores[i] = (i === 8 || i === 15 || i === 20) ? Math.max(3, baseScore - 1) : baseScore;
    catatanPerIndikator[i] = getObservasiReferenceNote(i, scores[i]);
  }

  return {
    id: `inst3-${teacherId}`,
    teacherId,
    tanggalObservasi: '2024-10-16',
    jamKe: 'Jam ke 3-4 (08.30 - 10.00 WIB)',
    materiPokok: 'Teks Argumentasi Berbasis Isu Lingkungan dan Berpikir Kritis',
    scores,
    catatanPerIndikator,
    buktiPembelajaran: {
      keselarasan: 'Tujuan pembelajaran selaras dengan aktivitas eksplorasi teks dan rubrik penilaian presentasi siswa.',
      kerangka: 'Alur dari pembukaan, eksplorasi pemantik, diskusi kelompok, presentasi unjuk kerja, hingga refleksi berlangsung tertib.',
      memahami: 'Murid mampu mengidentifikasi fakta vs opini dengan nalar kritis yang tajam.',
      mengaplikasi: 'Siswa memproduksi draf opini editorial terkait konservasi air di lingkungan sekolah.',
      merefleksi: 'Siswa menuliskan 1 hal baru yang dipahami dan 1 hal yang ingin didalami pada lembar refleksi digital.',
      memuliakan: 'Guru mengapresiasi partisipasi setiap kelompok tanpa diskriminasi dan mengedepankan budaya positif.',
      mengakomodir: 'Tersedia sumber belajar bacaan infografis bagi tipe visual dan rekaman audio untuk tipe auditori.',
    },
    catatanSupervisor: 'Penguasaan kelas sangat prima, interaksi dua arah hidup, dan penggunaan media digital adaptif.',
    rekomendasiPerbaikan: 'Tingkatkan alokasi waktu pada sesi tanya jawab antar kelompok agar respon siswa lebih mendalam.',
    tindakLanjut: 'Mengoptimalkan waktu presentasi dengan teknik timer digital terpusat pada layar kelas.',
    ttdPengawas: true,
    ttdKepalaSekolah: true,
    ttdGuru: true,
    isCompleted: true,
    updatedAt: new Date().toISOString(),
  };
}

// Helper to generate sample Instrument 4
function createSampleInst4(teacherId: string): Instrument4PascaObservasi {
  return {
    id: `inst4-${teacherId}`,
    teacherId,
    tanggalKegiatan: '2024-10-17',
    refleksiGuru: {
      perasaan: 'Sangat lega, senang, dan bersemangat karena murid merespons aktivitas dengan antusiasme yang tinggi.',
      halBaik: 'Kerja kelompok berjalan mandiri, alur diferensiasi konten berjalan mulus sesuai rancangan modul ajar.',
      tantangan: 'Waktu di akhir pembelajaran sedikit padat sehingga beberapa kelompok terburu-buru menyampaikan kesimpulan.',
      responMurid: 'Sangat positif, 90% murid aktif menyampaikan gagasan dalam lembar kerja interaktif.',
      rencanaPerbaikan: 'Akan menggunakan strategi jigsaw discussion agar pertukaran gagasan lebih terfokus dan efisien waktu.',
    },
    umpanBalik: [
      {
        id: 'ub-1',
        aspek: 'Perencanaan Pembelajaran',
        kekuatan: 'Modul Ajar sangat terstruktur dengan integrasi pembelajaran mendalam yang terencana.',
        areaPengembangan: 'Menambahkan diferensiasi pada tingkat kompleksitas tugas akhir bagi murid yang sudah cepat paham.',
      },
      {
        id: 'ub-2',
        aspek: 'Pelaksanaan Pembelajaran',
        kekuatan: 'Pemberian stimulus apersepsi sangat kontekstual dan menarik perhatian seluruh murid di kelas.',
        areaPengembangan: 'Manajemen alokasi waktu presentasi agar seluruh kelompok mendapat porsi umpan balik berimbang.',
      },
      {
        id: 'ub-3',
        aspek: 'Pengelolaan Kelas & Suasana',
        kekuatan: 'Iklim kelas ramah, aman, terbuka, dan murid berani mengemukakan argumen tanpa rasa cemas.',
        areaPengembangan: 'Mempertahankan konsistensi kesepakatan kelas dalam pengaturan gawai smartphone murid.',
      },
      {
        id: 'ub-4',
        aspek: '4. Asesmen Pembelajaran',
        kekuatan: 'Asesmen formatif berjalan natural sepanjang proses belajar menggunakan lembar observasi proses.',
        areaPengembangan: 'Melibatkan asesmen antar teman (peer-assessment) untuk mengasah empati dan evaluasi diri murid.',
      },
      {
        id: 'ub-5',
        aspek: 'Refleksi & Pengembangan Diri',
        kekuatan: 'Guru memiliki metakognisi tinggi dan sangat reflektif terhadap hasil pembelajaran yang baru berlangsung.',
        areaPengembangan: 'Menuliskan hasil pembelajaran ini menjadi artikel jurnal reflektif atau modul praktik baik sekolah.',
      },
    ],
    rencanaTindakLanjut: [
      {
        id: 'rtl-1',
        aspek: '1. Perencanaan',
        tindakLanjut: 'Menambahkan variasi penugasan bertingkat (tiered assignment) pada rubrik sumatif',
        penanggungJawab: 'Guru Mata Pelajaran',
        waktuPelaksanaan: 'Minggu ke-4 Oktober 2024',
        status: 'Selesai',
      },
      {
        id: 'rtl-2',
        aspek: '2. Pelaksanaan',
        tindakLanjut: 'Menerapkan timer interaktif dan teknik round-robin pada sesi diskusi kelas',
        penanggungJawab: 'Guru Mata Pelajaran & Tim Pengembang',
        waktuPelaksanaan: 'Awal November 2024',
        status: 'Dalam Proses',
      },
      {
        id: 'rtl-3',
        aspek: '3. Pengelolaan Kelas',
        tindakLanjut: 'Menata formasi tempat duduk berkelompok dinamis untuk mendukung diskusi kolaboratif yang kondusif',
        penanggungJawab: 'Guru Mata Pelajaran & Wali Kelas',
        waktuPelaksanaan: 'Pertengahan November 2024',
        status: 'Dalam Proses',
      },
      {
        id: 'rtl-4',
        aspek: '4. Asesmen',
        tindakLanjut: 'Menyusun instrumen penilaian antarteman (peer-assessment) digital sederhana',
        penanggungJawab: 'Guru Mata Pelajaran',
        waktuPelaksanaan: 'Pertengahan November 2024',
        status: 'Direncanakan',
      },
      {
        id: 'rtl-5',
        aspek: '5. Pengembangan Profesional Guru',
        tindakLanjut: 'Berbagi praktik baik pembelajaran mendalam di Komunitas Belajar (Kombel) Guru Bahasa Indonesia',
        penanggungJawab: 'Guru & Koordinator Kombel',
        waktuPelaksanaan: 'Akhir November 2024',
        status: 'Direncanakan',
      },
    ],
    catatanSupervisor: 'Guru menunjukkan dedikasi dan kompetensi pedagogik yang unggul. Tindak lanjut yang disusun sangat terarah.',
    kesepakatanBersama: 'Disepakati untuk melanjutkan implementasi strategi diferensiasi bertingkat dengan supervisi klinis lanjutan pada semester berikutnya.',
    ttdPengawas: true,
    ttdKepalaSekolah: true,
    ttdGuru: true,
    isCompleted: true,
    updatedAt: new Date().toISOString(),
  };
}

export function getInitialSupervisionData(): AppSupervisionData {
  const inst1: Record<string, Instrument1Admin> = {};
  const inst2: Record<string, Instrument2ModulAjar> = {};
  const inst3: Record<string, Instrument3Observasi> = {};
  const inst4: Record<string, Instrument4PascaObservasi> = {};

  // Seed sample data for Teacher 1 (Siti Rahmawati - Complete A)
  inst1['t-1'] = createSampleInst1('t-1', 5);
  inst2['t-1'] = createSampleInst2('t-1', 20);
  inst3['t-1'] = createSampleInst3('t-1', 4);
  inst4['t-1'] = createSampleInst4('t-1');

  return {
    school: DEFAULT_SCHOOL,
    teachers: INITIAL_TEACHERS,
    instrumen1: inst1,
    instrumen2: inst2,
    instrumen3: inst3,
    instrumen4: inst4,
  };
}

export function loadSupervisionData(): AppSupervisionData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSupervisionData();
      saveSupervisionData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppSupervisionData;
    // ensure structure integrity
    if (!parsed.school || !parsed.teachers || !parsed.instrumen1) {
      const initial = getInitialSupervisionData();
      saveSupervisionData(initial);
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Error loading data from localStorage, falling back to initial data:', err);
    return getInitialSupervisionData();
  }
}

export function saveSupervisionData(data: AppSupervisionData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function exportBackupJSON(data: AppSupervisionData): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `supervisi_digital_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportRecapToXLSX(data: AppSupervisionData): void {
  const headers = [
    'No',
    'Nama Guru',
    'NIP/NUPTK',
    'Pangkat/Golongan',
    'Mata Pelajaran',
    'Kelas/Fase',
    'Jam Tatap Muka',
    'Tanggal Supervisi',
    'Skor Administrasi (%)',
    'Predikat Administrasi',
    'Skor Modul Ajar (%)',
    'Predikat Modul Ajar',
    'Skor Observasi Kelas (%)',
    'Predikat Observasi',
    'Rata-rata Skor (%)',
    'Predikat Akhir',
    'Status Supervisi',
  ];

  const rows = data.teachers.map((t, idx) => {
    const inst1 = data.instrumen1[t.id];
    const inst2 = data.instrumen2[t.id];
    const inst3 = data.instrumen3[t.id];
    const inst4 = data.instrumen4[t.id];

    const p1 = inst1 ? calculateInstrumen1Score(inst1.scores).percentage : 0;
    const pred1 = inst1 ? calculateInstrumen1Score(inst1.scores).predikat : '-';
    const p2 = inst2 ? calculateInstrumen2Score(inst2.items).percentage : 0;
    const pred2 = inst2 ? calculateInstrumen2Score(inst2.items).predikat : '-';
    const p3 = inst3 ? calculateInstrumen3Score(inst3.scores).percentage : 0;
    const pred3 = inst3 ? calculateInstrumen3Score(inst3.scores).predikat : '-';

    const comp = calculateCompositeGrade(p1, p2, p3, !!inst4);

    return [
      idx + 1,
      t.namaGuru,
      t.nip ? String(t.nip) : '-',
      t.pangkatGolongan || '-',
      t.mataPelajaran || '-',
      t.kelasFase || '-',
      t.jamTatapMuka,
      t.tanggalSupervisi || '-',
      p1 > 0 ? p1 : '-',
      pred1,
      p2 > 0 ? p2 : '-',
      pred2,
      p3 > 0 ? p3 : '-',
      pred3,
      comp.averagePercentage > 0 ? comp.averagePercentage : '-',
      comp.predikat,
      t.status,
    ];
  });

  // Buat WorkSheet dari data array
  const wsData = [
    [`REKAPITULASI HASIL SUPERVISI AKADEMIK`],
    [`Satuan Pendidikan: ${data.school.namaSekolah}`],
    [`Tahun Ajaran: ${data.school.tahunAjaran} | Semester: ${data.school.semester}`],
    [`Kepala Sekolah: ${data.school.namaKepalaSekolah} (NIP. ${data.school.nipKepalaSekolah})`],
    [`Pengawas: ${data.school.namaPengawas} (NIP. ${data.school.nipPengawas})`],
    [], // Baris kosong pemisah
    headers,
    ...rows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Atur lebar kolom agar rapi saat dibuka di Microsoft Excel
  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 28 }, // Nama Guru
    { wch: 22 }, // NIP/NUPTK
    { wch: 18 }, // Pangkat/Gol
    { wch: 20 }, // Mapel
    { wch: 14 }, // Kelas/Fase
    { wch: 14 }, // Jam
    { wch: 16 }, // Tanggal
    { wch: 18 }, // Skor Adm
    { wch: 18 }, // Pred Adm
    { wch: 18 }, // Skor MA
    { wch: 18 }, // Pred MA
    { wch: 18 }, // Skor Obs
    { wch: 18 }, // Pred Obs
    { wch: 16 }, // Rata-rata
    { wch: 16 }, // Predikat Akhir
    { wch: 20 }, // Status
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rekap Supervisi');

  const cleanSchoolName = data.school.namaSekolah.replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `rekap_supervisi_${cleanSchoolName}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, filename);
}

// Alias untuk kompatibilitas jika dipanggil dengan nama lama
export const exportRecapToCSV = exportRecapToXLSX;
