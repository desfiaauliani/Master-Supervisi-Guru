import React, { useState, useEffect } from 'react';
import {
  AppSupervisionData,
  Instrument4PascaObservasi,
  PascaRefleksiGuru,
  PascaUmpanBalik,
  PascaRencanaTindakLanjut,
} from '../types/supervision';
import { KopSurat } from './KopSurat';
import { SignatureBlock } from './SignatureBlock';
import { TeacherSelector } from './TeacherSelector';
import {
  CheckCircle,
  Save,
  Printer,
  Calendar,
  MessageSquareQuote,
  Smile,
  Check,
  AlertOctagon,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  ListTodo,
  FileText,
} from 'lucide-react';

interface Instrument4ViewProps {
  data: AppSupervisionData;
  selectedTeacherId: string;
  onSelectTeacher: (id: string) => void;
  onSaveInstrument: (record: Instrument4PascaObservasi) => void;
}

export const Instrument4View: React.FC<Instrument4ViewProps> = ({
  data,
  selectedTeacherId,
  onSelectTeacher,
  onSaveInstrument,
}) => {
  const { school, teachers, instrumen4 } = data;
  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const defaultRefleksi: PascaRefleksiGuru = {
    perasaan: 'Sangat bersyukur dan antusias melihat respons aktif murid dalam proses eksplorasi materi.',
    halBaik: 'Diskusi kelompok dan integrasi media digital interaktif terlaksana sesuai tahapan modul ajar.',
    tantangan: 'Memerlukan teknik pengelolaan alokasi waktu presentasi agar seluruh kelompok memiliki kesempatan bertanya berimbang.',
    responMurid: 'Sangat positif, 90% murid berpartisipasi dalam pengerjaan lembar unjuk pemahaman kolaboratif.',
    rencanaPerbaikan: 'Menerapkan penugasan berjenjang (tiered assignment) untuk mengakomodasi keberagaman kecepatan belajar.',
  };

  const defaultUmpanBalik: PascaUmpanBalik[] = [
    {
      id: 'ub-1',
      aspek: '1. Perencanaan Pembelajaran',
      kekuatan: 'Modul ajar memuat alur berpikir mendalam (Deep Learning) dan rubrik penilaian terlampir jelas.',
      areaPengembangan: 'Menyediakan materi pengayaan kontekstual bagi murid berkemampuan tinggi.',
    },
    {
      id: 'ub-2',
      aspek: '2. Pelaksanaan Pembelajaran',
      kekuatan: 'Apersepsi kontekstual dan pertanyaan pemantik sangat efektif menggugah nalar kritis kelas.',
      areaPengembangan: 'Mempertahankan ritme waktu diskusi agar sesi tanya jawab tidak terburu-buru.',
    },
    {
      id: 'ub-3',
      aspek: '3. Pengelolaan Kelas',
      kekuatan: 'Suasana kelas inklusif, ramah, dan guru membimbing seluruh kelompok secara adil tanpa diskriminasi.',
      areaPengembangan: 'Mempertegas kesepakatan penggunaan gawai untuk fokus referensi pembelajaran.',
    },
    {
      id: 'ub-4',
      aspek: '4. Asesmen Pembelajaran',
      kekuatan: 'Umpan balik formatif langsung diberikan kepada kelompok yang mengalami miskonsepsi.',
      areaPengembangan: 'Mengembangkan instrumen asesmen antarteman (peer-review) sederhana.',
    },
    {
      id: 'ub-5',
      aspek: '5. Refleksi & Tindak Lanjut',
      kekuatan: 'Guru memiliki sikap reflektif tinggi dan sangat terbuka terhadap masukan peningkatan mutu.',
      areaPengembangan: 'Mendokumentasikan praktik baik ini untuk dibagikan dalam Komunitas Belajar sekolah.',
    },
  ];

  const defaultRTL: PascaRencanaTindakLanjut[] = [
    {
      id: 'rtl-1',
      aspek: '1. Perencanaan',
      tindakLanjut: 'Menyempurnakan variasi rubrik asesmen formatif dan LKPD berdiferensiasi',
      penanggungJawab: 'Guru Mata Pelajaran',
      waktuPelaksanaan: '2 Minggu ke depan',
      status: 'Selesai',
    },
    {
      id: 'rtl-2',
      aspek: '2. Pelaksanaan',
      tindakLanjut: 'Menerapkan timer digital terpusat untuk membatasi presentasi dan memaksimalkan tanya jawab',
      penanggungJawab: 'Guru Mata Pelajaran',
      waktuPelaksanaan: 'Pertemuan berikutnya',
      status: 'Dalam Proses',
    },
    {
      id: 'rtl-3',
      aspek: '3. Pengelolaan Kelas',
      tindakLanjut: 'Meninjau kembali kesepakatan kelas terkait kedisiplinan dan apresiasi kelompok',
      penanggungJawab: 'Guru & Wali Kelas',
      waktuPelaksanaan: 'Awal bulan depan',
      status: 'Direncanakan',
    },
    {
      id: 'rtl-4',
      aspek: '4. Asesmen',
      tindakLanjut: 'Merancang lembar penilaian diri (self-assessment) pada akhir lingkup materi',
      penanggungJawab: 'Guru Mata Pelajaran',
      waktuPelaksanaan: 'Bulan berjalan',
      status: 'Direncanakan',
    },
    {
      id: 'rtl-5',
      aspek: '5. Pengembangan Profesional Guru',
      tindakLanjut: 'Mengikuti webinar kurikulum merdeka dan berbagi praktik baik di Kombel Sekolah',
      penanggungJawab: 'Guru & Tim Kombel',
      waktuPelaksanaan: 'Semester berjalan',
      status: 'Direncanakan',
    },
  ];

  const emptyRefleksi: PascaRefleksiGuru = {
    perasaan: '',
    halBaik: '',
    tantangan: '',
    responMurid: '',
    rencanaPerbaikan: '',
  };

  const emptyUmpanBalik: PascaUmpanBalik[] = [
    {
      id: 'ub-1',
      aspek: '1. Perencanaan Pembelajaran',
      kekuatan: '',
      areaPengembangan: '',
    },
    {
      id: 'ub-2',
      aspek: '2. Pelaksanaan Pembelajaran',
      kekuatan: '',
      areaPengembangan: '',
    },
    {
      id: 'ub-3',
      aspek: '3. Pengelolaan Kelas',
      kekuatan: '',
      areaPengembangan: '',
    },
    {
      id: 'ub-4',
      aspek: '4. Asesmen Pembelajaran',
      kekuatan: '',
      areaPengembangan: '',
    },
    {
      id: 'ub-5',
      aspek: '5. Refleksi & Tindak Lanjut',
      kekuatan: '',
      areaPengembangan: '',
    },
  ];

  const emptyRTL: PascaRencanaTindakLanjut[] = [
    {
      id: 'rtl-1',
      aspek: '1. Perencanaan',
      tindakLanjut: '',
      penanggungJawab: 'Guru Mata Pelajaran',
      waktuPelaksanaan: '',
      status: 'Direncanakan',
    },
    {
      id: 'rtl-2',
      aspek: '2. Pelaksanaan',
      tindakLanjut: '',
      penanggungJawab: 'Guru Mata Pelajaran',
      waktuPelaksanaan: '',
      status: 'Direncanakan',
    },
    {
      id: 'rtl-3',
      aspek: '3. Pengelolaan Kelas',
      tindakLanjut: '',
      penanggungJawab: 'Guru & Wali Kelas',
      waktuPelaksanaan: '',
      status: 'Direncanakan',
    },
    {
      id: 'rtl-4',
      aspek: '4. Asesmen',
      tindakLanjut: '',
      penanggungJawab: 'Guru Mata Pelajaran',
      waktuPelaksanaan: '',
      status: 'Direncanakan',
    },
    {
      id: 'rtl-5',
      aspek: '5. Pengembangan Profesional Guru',
      tindakLanjut: '',
      penanggungJawab: 'Guru & Tim Kombel',
      waktuPelaksanaan: '',
      status: 'Direncanakan',
    },
  ];

  const normalizeRTL = (rtls: PascaRencanaTindakLanjut[] | undefined): PascaRencanaTindakLanjut[] => {
    const targetAspects = [
      '1. Perencanaan',
      '2. Pelaksanaan',
      '3. Pengelolaan Kelas',
      '4. Asesmen',
      '5. Pengembangan Profesional Guru',
    ];

    if (!rtls || rtls.length === 0) return emptyRTL;

    return targetAspects.map((aspectName, idx) => {
      const existing = rtls.find((r) => {
        const a = (r.aspek || '').toLowerCase();
        if (idx === 0 && (a.includes('perencanaan') || a.startsWith('1.'))) return true;
        if (idx === 1 && (a.includes('pelaksanaan') || a.startsWith('2.'))) return true;
        if (idx === 2 && (a.includes('pengelolaan') || a.startsWith('3.'))) return true;
        if (idx === 3 && (a.includes('asesmen') || a.startsWith('4.'))) return true;
        if (idx === 4 && (a.includes('profesional') || a.includes('pkb') || a.startsWith('5.'))) return true;
        return false;
      }) || rtls[idx];

      if (existing) {
        return {
          ...existing,
          aspek: aspectName,
        };
      }
      return emptyRTL[idx];
    });
  };

  const [formData, setFormData] = useState<Instrument4PascaObservasi>(() => {
    const existing = instrumen4[selectedTeacherId];
    if (existing) {
      return {
        ...existing,
        rencanaTindakLanjut: normalizeRTL(existing.rencanaTindakLanjut),
      };
    }

    return {
      id: `inst4-${selectedTeacherId}`,
      teacherId: selectedTeacherId,
      tanggalKegiatan: new Date().toISOString().split('T')[0],
      refleksiGuru: emptyRefleksi,
      umpanBalik: emptyUmpanBalik,
      rencanaTindakLanjut: emptyRTL,
      catatanSupervisor: '',
      kesepakatanBersama: '',
      ttdPengawas: false,
      ttdKepalaSekolah: false,
      ttdGuru: false,
      isCompleted: false,
      updatedAt: new Date().toISOString(),
    };
  });

  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    const existing = instrumen4[selectedTeacherId];
    if (existing) {
      setFormData({
        ...existing,
        rencanaTindakLanjut: normalizeRTL(existing.rencanaTindakLanjut),
      });
    } else {
      setFormData({
        id: `inst4-${selectedTeacherId}`,
        teacherId: selectedTeacherId,
        tanggalKegiatan: new Date().toISOString().split('T')[0],
        refleksiGuru: emptyRefleksi,
        umpanBalik: emptyUmpanBalik,
        rencanaTindakLanjut: emptyRTL,
        catatanSupervisor: '',
        kesepakatanBersama: '',
        ttdPengawas: false,
        ttdKepalaSekolah: false,
        ttdGuru: false,
        isCompleted: false,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [selectedTeacherId, instrumen4]);

  const handleClearForm = () => {
    setFormData((prev) => ({
      ...prev,
      refleksiGuru: emptyRefleksi,
      umpanBalik: emptyUmpanBalik,
      rencanaTindakLanjut: emptyRTL,
      catatanSupervisor: '',
      kesepakatanBersama: '',
      isCompleted: false,
    }));
  };

  const handleRefleksiChange = (field: keyof PascaRefleksiGuru, val: string) => {
    setFormData((prev) => ({
      ...prev,
      refleksiGuru: {
        ...prev.refleksiGuru,
        [field]: val,
      },
    }));
  };

  const handleUmpanBalikChange = (id: string, field: 'kekuatan' | 'areaPengembangan', val: string) => {
    setFormData((prev) => ({
      ...prev,
      umpanBalik: prev.umpanBalik.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    }));
  };

  const handleRTLChange = (
    id: string,
    field: keyof PascaRencanaTindakLanjut,
    val: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      rencanaTindakLanjut: prev.rencanaTindakLanjut.map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    }));
  };

  const handleAddRTL = () => {
    const newItem: PascaRencanaTindakLanjut = {
      id: `rtl-custom-${Date.now()}`,
      aspek: 'Pengembangan Tambahan',
      tindakLanjut: '',
      penanggungJawab: 'Guru Mata Pelajaran',
      waktuPelaksanaan: '1 Bulan ke depan',
      status: 'Direncanakan',
    };
    setFormData((prev) => ({
      ...prev,
      rencanaTindakLanjut: [...prev.rencanaTindakLanjut, newItem],
    }));
  };

  const handleDeleteRTL = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      rencanaTindakLanjut: prev.rencanaTindakLanjut.filter((item) => item.id !== id),
    }));
  };

  const handleSave = () => {
    const updated: Instrument4PascaObservasi = {
      ...formData,
      isCompleted: true,
      updatedAt: new Date().toISOString(),
    };
    onSaveInstrument(updated);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi Berhasil Simpan Berkas */}
      {savedAlert && (
        <div className="fixed bottom-6 right-6 z-50 print:hidden animate-bounce flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-400">
          <CheckCircle className="w-5 h-5 text-white shrink-0" />
          <div>
            <p className="font-bold text-sm">Berhasil Simpan Berkas</p>
            <p className="text-[11px] text-emerald-100">Instrumen 4 & RTL untuk {currentTeacher.namaGuru} tersimpan</p>
          </div>
        </div>
      )}

      {/* Printable Kop Surat */}
      <div className="hidden print:block">
        <KopSurat
          school={school}
          documentTitle="INSTRUMEN 4: LEMBAR PASCA OBSERVASI & RENCANA TINDAK LANJUT SUPERVISI"
          subTitle={`Tahun Ajaran ${school.tahunAjaran} - Semester ${school.semester}`}
          nomorSurat={`424.0 / ${school.npsn} / INST-PASCA / 2024`}
        />
      </div>

      {/* Teacher Selection & Controls */}
      <div className="print:hidden space-y-4">
        <TeacherSelector
          teachers={teachers}
          selectedTeacherId={selectedTeacherId}
          onSelectTeacher={onSelectTeacher}
          label="Pilih Guru untuk Sesi Pasca Observasi:"
        />

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold">Format Pendampingan:</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-medium">
              Coaching & Percakapan Reflektif
            </span>
          </div>

          <div className="flex items-center gap-2">
            {savedAlert && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Berhasil Simpan Berkas
              </span>
            )}
            <button
              onClick={handleClearForm}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
              title="Kosongkan seluruh isian dan mulai sesi refleksi baru"
            >
              Kosongkan Form
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Instrumen</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Cetak Form</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Identity Sheet */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="border-b border-slate-200 pb-3 mb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-indigo-600 print:hidden" />
            <span>IDENTITAS DISKUSI PASCA OBSERVASI SUPERVISI</span>
          </h3>
          <p className="text-xs text-slate-500">
            Percakapan coaching berbasis apresiasi, refleksi kesadaran diri, dan komitmen pengembangan profesional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs md:text-sm">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">1. Nama Satuan Pendidikan</span>
            <span className="font-bold text-slate-900">{school.namaSekolah}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">2. Nama Guru yang Disupervisi</span>
            <span className="font-bold text-slate-900">{currentTeacher.namaGuru}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">3. Mata Pelajaran</span>
            <span className="font-bold text-indigo-700">{currentTeacher.mataPelajaran}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">4. Kelas / Fase</span>
            <span className="text-slate-900">{currentTeacher.kelasFase}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">5. Nama Supervisor / Pengawas</span>
            <span className="text-slate-900">{school.namaPengawas}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">6. Tanggal Diskusi Pasca Observasi</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              <input
                type="date"
                value={formData.tanggalKegiatan}
                onChange={(e) => setFormData({ ...formData, tanggalKegiatan: e.target.value })}
                className="font-medium text-slate-900 bg-transparent border-0 p-0 focus:ring-0 text-xs md:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section A: Refleksi Guru (5 Question Cards) */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-mono font-bold">
                A
              </span>
              <span>REFLEKSI DIRI GURU SETELAH PEMBELAJARAN (5 PERTANYAAN PEMANDU)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Guru menyampaikan penilaian mandiri mengenai proses, respon murid, dan kendala yang dihadapi
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs md:text-sm">
          {/* Card 1: Perasaan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
              <Smile className="w-4 h-4 text-amber-500" />
              <span>1. Bagaimana perasaan Anda saat dan setelah melaksanakan pembelajaran tadi?</span>
            </div>
            <textarea
              rows={2}
              value={formData.refleksiGuru.perasaan}
              onChange={(e) => handleRefleksiChange('perasaan', e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              placeholder="Ekspresi perasaan dan suasana batin guru saat mengajar..."
            />
          </div>

          {/* Card 2: Hal yang Berjalan Baik */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>2. Apa saja hal yang sudah berjalan dengan baik dan sesuai dengan rencana Modul Ajar?</span>
            </div>
            <textarea
              rows={2}
              value={formData.refleksiGuru.halBaik}
              onChange={(e) => handleRefleksiChange('halBaik', e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              placeholder="Momen keberhasilan, metode yang efektif, antusiasme belajar..."
            />
          </div>

          {/* Card 3: Tantangan / Kendala */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              <span>3. Apa tantangan atau kendala utama yang Anda hadapi selama pembelajaran berlangsung?</span>
            </div>
            <textarea
              rows={2}
              value={formData.refleksiGuru.tantangan}
              onChange={(e) => handleRefleksiChange('tantangan', e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              placeholder="Kendala waktu, sarana, miskonsepsi materi, atau kondisi murid..."
            />
          </div>

          {/* Card 4: Respon Murid */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>4. Bagaimana respon, keaktifan, dan tingkat keterlibatan murid dalam aktivitas kelas?</span>
            </div>
            <textarea
              rows={2}
              value={formData.refleksiGuru.responMurid}
              onChange={(e) => handleRefleksiChange('responMurid', e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              placeholder="Tingkat partisipasi kelompok, murid yang pasif vs aktif..."
            />
          </div>

          {/* Card 5: Rencana Perbaikan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>5. Apa rencana perbaikan atau inovasi yang akan Anda lakukan untuk pembelajaran berikutnya?</span>
            </div>
            <textarea
              rows={2}
              value={formData.refleksiGuru.rencanaPerbaikan}
              onChange={(e) => handleRefleksiChange('rencanaPerbaikan', e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              placeholder="Gagasan inovasi, diferensiasi baru, atau perbaikan strategi mengajar..."
            />
          </div>
        </div>
      </div>

      {/* Section B: Umpan Balik Supervisor Table across 5 aspects */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-mono font-bold">
              B
            </span>
            <span>UMPAN BALIK SUPERVISOR / PENGAWAS PENDAMPING (5 ASPEK UTAMA)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Apresiasi atas praktik baik yang telah muncul dan rekomendasi area pengembangan secara konstruktif
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-44">Aspek Penilaian</th>
                <th className="py-3 px-4 min-w-[260px]">Apresiasi / Kekuatan yang Tampak</th>
                <th className="py-3 px-4 min-w-[260px]">Area yang Perlu Ditingkatkan / Rekomendasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {formData.umpanBalik.map((ub) => (
                <tr key={ub.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900 align-top bg-slate-50/50">
                    {ub.aspek}
                  </td>
                  <td className="py-3 px-4 align-top">
                    <textarea
                      rows={2}
                      value={ub.kekuatan}
                      onChange={(e) => handleUmpanBalikChange(ub.id, 'kekuatan', e.target.value)}
                      className="w-full p-2 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-400 rounded-md focus:outline-hidden"
                      placeholder="Kekuatan / praktik baik..."
                    />
                  </td>
                  <td className="py-3 px-4 align-top">
                    <textarea
                      rows={2}
                      value={ub.areaPengembangan}
                      onChange={(e) => handleUmpanBalikChange(ub.id, 'areaPengembangan', e.target.value)}
                      className="w-full p-2 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-400 rounded-md focus:outline-hidden"
                      placeholder="Rekomendasi area pengembangan..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section C: Rencana Tindak Lanjut Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-mono font-bold">
                C
              </span>
              <span>RENCANA TINDAK LANJUT SUPERVISI YANG DISEPAKATI BERSAMA</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Komitmen implementasi perbaikan nyata beserta penanggung jawab, jadwal, dan progres
            </p>
          </div>
          <button
            onClick={handleAddRTL}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors print:hidden"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Butir RTL</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 text-center w-10">No</th>
                <th className="py-3 px-4 min-w-[160px]">Aspek Pengembangan</th>
                <th className="py-3 px-4 min-w-[260px]">Tindak Lanjut yang Disepakati</th>
                <th className="py-3 px-4 min-w-[160px]">Penanggung Jawab</th>
                <th className="py-3 px-4 min-w-[150px]">Waktu Pelaksanaan</th>
                <th className="py-3 px-3 text-center min-w-[120px]">Status Progres</th>
                <th className="py-3 px-3 text-center w-14 print:hidden">Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {formData.rencanaTindakLanjut.map((rtl, index) => (
                <tr key={rtl.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 text-center font-bold text-slate-500">{index + 1}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <input
                      type="text"
                      value={rtl.aspek}
                      onChange={(e) => handleRTLChange(rtl.id, 'aspek', e.target.value)}
                      className="w-full px-2 py-1 bg-transparent border-0 font-semibold text-slate-900 focus:ring-0 text-xs"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <textarea
                      rows={2}
                      value={rtl.tindakLanjut}
                      onChange={(e) => handleRTLChange(rtl.id, 'tindakLanjut', e.target.value)}
                      className="w-full p-2 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded focus:outline-hidden"
                      placeholder="Uraian tindak lanjut..."
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={rtl.penanggungJawab}
                      onChange={(e) => handleRTLChange(rtl.id, 'penanggungJawab', e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded"
                      placeholder="PJ kegiatan..."
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={rtl.waktuPelaksanaan}
                      onChange={(e) => handleRTLChange(rtl.id, 'waktuPelaksanaan', e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded"
                      placeholder="Target waktu..."
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <select
                      value={rtl.status}
                      onChange={(e) =>
                        handleRTLChange(
                          rtl.id,
                          'status',
                          e.target.value as 'Direncanakan' | 'Dalam Proses' | 'Selesai'
                        )
                      }
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border text-center ${
                        rtl.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : rtl.status === 'Dalam Proses'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="Direncanakan">Direncanakan</option>
                      <option value="Dalam Proses">Dalam Proses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-center print:hidden">
                    <button
                      onClick={() => handleDeleteRTL(rtl.id)}
                      className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Hapus baris RTL"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Narrative Summary & Joint Agreement */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600 print:hidden" />
            <span>CATATAN AKHIR SUPERVISOR & KESEPAKATAN BERSAMA</span>
          </h3>
        </div>

        <div className="space-y-4 text-xs md:text-sm">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Catatan Akhir Pendamping / Supervisor:
            </label>
            <textarea
              rows={3}
              value={formData.catatanSupervisor}
              onChange={(e) => setFormData({ ...formData, catatanSupervisor: e.target.value })}
              placeholder="Catatan apresiasi dan motivasi dari Pengawas/Kepala Sekolah..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Kesepakatan Bersama untuk Supervisi Lanjutan:
            </label>
            <textarea
              rows={2}
              value={formData.kesepakatanBersama}
              onChange={(e) => setFormData({ ...formData, kesepakatanBersama: e.target.value })}
              placeholder="Pernyataan komitmen bersama antara guru, kepala sekolah, dan pengawas..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end print:hidden">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Instrumen 4 & RTL</span>
          </button>
        </div>
      </div>

      {/* Signature Block */}
      <SignatureBlock
        school={school}
        teacher={currentTeacher}
        tanggalDokumen={formData.tanggalKegiatan}
        signedPengawas={formData.ttdPengawas}
        signedKepalaSekolah={formData.ttdKepalaSekolah}
        signedGuru={formData.ttdGuru}
        onToggleSignature={(role) => {
          if (role === 'pengawas') setFormData((p) => ({ ...p, ttdPengawas: !p.ttdPengawas }));
          if (role === 'kepala') setFormData((p) => ({ ...p, ttdKepalaSekolah: !p.ttdKepalaSekolah }));
          if (role === 'guru') setFormData((p) => ({ ...p, ttdGuru: !p.ttdGuru }));
        }}
      />
    </div>
  );
};
