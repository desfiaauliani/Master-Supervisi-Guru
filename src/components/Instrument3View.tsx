import React, { useState, useEffect } from 'react';
import {
  AppSupervisionData,
  Instrument3Observasi,
  INSTRUMEN_3_ITEMS,
  calculateInstrumen3Score,
} from '../types/supervision';
import { KopSurat } from './KopSurat';
import { SignatureBlock } from './SignatureBlock';
import { TeacherSelector } from './TeacherSelector';
import {
  CheckCircle,
  Save,
  Printer,
  Calendar,
  School,
  Sparkles,
  HeartHandshake,
  FileText,
  Clock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import {
  getObservasiReferenceNote,
  isAutoReferenceNote,
} from '../utils/observasiReferences';

interface Instrument3ViewProps {
  data: AppSupervisionData;
  selectedTeacherId: string;
  onSelectTeacher: (id: string) => void;
  onSaveInstrument: (record: Instrument3Observasi) => void;
  onNavigateNext?: () => void;
}

export const Instrument3View: React.FC<Instrument3ViewProps> = ({
  data,
  selectedTeacherId,
  onSelectTeacher,
  onSaveInstrument,
  onNavigateNext,
}) => {
  const { school, teachers, instrumen3 } = data;
  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const [formData, setFormData] = useState<Instrument3Observasi>(() => {
    const existing = instrumen3[selectedTeacherId];
    if (existing) return existing;

    return {
      id: `inst3-${selectedTeacherId}`,
      teacherId: selectedTeacherId,
      tanggalObservasi: new Date().toISOString().split('T')[0],
      jamKe: '',
      materiPokok: '',
      scores: {},
      catatanPerIndikator: {},
      buktiPembelajaran: {
        keselarasan: '',
        kerangka: '',
        memahami: '',
        mengaplikasi: '',
        merefleksi: '',
        memuliakan: '',
        mengakomodir: '',
      },
      catatanSupervisor: '',
      rekomendasiPerbaikan: '',
      tindakLanjut: '',
      ttdPengawas: false,
      ttdKepalaSekolah: false,
      ttdGuru: false,
      isCompleted: false,
      updatedAt: new Date().toISOString(),
    };
  });

  const [savedAlert, setSavedAlert] = useState(false);
  const [validationAlert, setValidationAlert] = useState<string | null>(null);
  const [isSavedAndComplete, setIsSavedAndComplete] = useState<boolean>(() => {
    return !!instrumen3[selectedTeacherId]?.isCompleted;
  });

  useEffect(() => {
    const existing = instrumen3[selectedTeacherId];
    if (existing) {
      setFormData(existing);
      setIsSavedAndComplete(!!existing.isCompleted);
    } else {
      setFormData({
        id: `inst3-${selectedTeacherId}`,
        teacherId: selectedTeacherId,
        tanggalObservasi: new Date().toISOString().split('T')[0],
        jamKe: '',
        materiPokok: '',
        scores: {},
        catatanPerIndikator: {},
        buktiPembelajaran: {
          keselarasan: '',
          kerangka: '',
          memahami: '',
          mengaplikasi: '',
          merefleksi: '',
          memuliakan: '',
          mengakomodir: '',
        },
        catatanSupervisor: '',
        rekomendasiPerbaikan: '',
        tindakLanjut: '',
        ttdPengawas: false,
        ttdKepalaSekolah: false,
        ttdGuru: false,
        isCompleted: false,
        updatedAt: new Date().toISOString(),
      });
      setIsSavedAndComplete(false);
    }
    setValidationAlert(null);
  }, [selectedTeacherId, instrumen3, currentTeacher]);

  const scoreResult = calculateInstrumen3Score(formData.scores);

  const handleScoreChange = (id: number, val: number) => {
    setFormData((prev) => {
      const isUnselecting = prev.scores[id] === val;
      const nextScore = isUnselecting ? 0 : val;
      const newScores = {
        ...prev.scores,
        [id]: nextScore,
      };

      const currentNote = prev.catatanPerIndikator[id] || '';
      let nextNote = currentNote;

      if (isUnselecting) {
        if (isAutoReferenceNote(id, currentNote)) {
          nextNote = '';
        }
      } else {
        // Otomatis isi catatan pengamat mengacu pada fokus indikator & petunjuk skor jika kosong atau memakai referensi otomatis sebelumnya
        if (!currentNote.trim() || isAutoReferenceNote(id, currentNote)) {
          nextNote = getObservasiReferenceNote(id, nextScore);
        }
      }

      return {
        ...prev,
        scores: newScores,
        catatanPerIndikator: {
          ...prev.catatanPerIndikator,
          [id]: nextNote,
        },
      };
    });
  };

  const handleCatatanIndikatorChange = (id: number, text: string) => {
    setFormData((prev) => ({
      ...prev,
      catatanPerIndikator: {
        ...prev.catatanPerIndikator,
        [id]: text,
      },
    }));
  };

  const handleQuickFill = (val: number) => {
    const newScores: Record<number, number> = {};
    const newCatatan: Record<number, string> = { ...formData.catatanPerIndikator };
    INSTRUMEN_3_ITEMS.forEach((item) => {
      newScores[item.id] = val;
      // Isi catatan referensi otomatis mengacu pada fokus indikator dan skala skor petunjuk
      newCatatan[item.id] = getObservasiReferenceNote(item.id, val);
    });
    setFormData((prev) => ({
      ...prev,
      scores: newScores,
      catatanPerIndikator: newCatatan,
    }));
  };

  const handleAutoFillAllCatatan = () => {
    setFormData((prev) => {
      const updatedCatatan = { ...prev.catatanPerIndikator };
      INSTRUMEN_3_ITEMS.forEach((item) => {
        const sc = prev.scores[item.id] || 4;
        updatedCatatan[item.id] = getObservasiReferenceNote(item.id, sc);
      });
      return {
        ...prev,
        catatanPerIndikator: updatedCatatan,
      };
    });
  };

  const handleClearScores = () => {
    setFormData((prev) => ({
      ...prev,
      scores: {},
      catatanPerIndikator: {},
      buktiPembelajaran: {
        keselarasan: '',
        kerangka: '',
        memahami: '',
        mengaplikasi: '',
        merefleksi: '',
        memuliakan: '',
        mengakomodir: '',
      },
      catatanSupervisor: '',
      rekomendasiPerbaikan: '',
      tindakLanjut: '',
      isCompleted: false,
    }));
    setIsSavedAndComplete(false);
  };

  // Logika cerdas: Menghasilkan referensi catatan, rekomendasi, dan tindak lanjut mengacu pada hasil skor observasi 24 indikator
  const generateScoreBasedReferences = () => {
    const scores = formData.scores || {};
    const ratedItems = Object.entries(scores).map(([k, v]) => ({ id: Number(k), score: Number(v) }));

    // Indikator Unggul (Skor 4 = Sangat Baik)
    const highItems = ratedItems
      .filter((item) => item.score === 4)
      .map((item) => {
        const def = INSTRUMEN_3_ITEMS.find((d) => d.id === item.id);
        return { ...item, nama: def?.nama || `Item ${item.id}`, sectionTitle: def?.sectionTitle || '' };
      });

    // Indikator yang perlu ditingkatkan (Skor 1 atau 2 = Kurang / Tidak Tampak)
    const lowItems = ratedItems
      .filter((item) => item.score > 0 && item.score <= 2)
      .map((item) => {
        const def = INSTRUMEN_3_ITEMS.find((d) => d.id === item.id);
        return { ...item, nama: def?.nama || `Item ${item.id}`, sectionTitle: def?.sectionTitle || '' };
      });

    // Indikator Cukup Baik (Skor 3)
    const goodItems = ratedItems
      .filter((item) => item.score === 3)
      .map((item) => {
        const def = INSTRUMEN_3_ITEMS.find((d) => d.id === item.id);
        return { ...item, nama: def?.nama || `Item ${item.id}` };
      });

    // --- Referensi A: Catatan Keseluruhan Supervisor ---
    const catatanReferensi: { label: string; text: string; badge?: string }[] = [];

    if (highItems.length > 0) {
      const topNames = highItems.slice(0, 3).map((i) => i.nama).join(', ');
      catatanReferensi.push({
        label: `Aspek Sangat Baik (${highItems.length} Indikator)`,
        text: `Pembelajaran di kelas berlangsung sangat aktif dan interaktif. Guru menunjukkan kompetensi pedagogis yang luar biasa, terutama pada: ${topNames}. Keterlibatan murid tampak nyata dan suasana kelas menyenangkan.`,
        badge: 'Skor 4 (Sangat Baik)',
      });
    }

    if (scoreResult.percentage >= 85) {
      catatanReferensi.push({
        label: `Capaian Sangat Baik (${scoreResult.percentage}%)`,
        text: `Pelaksanaan pembelajaran di kelas mencapai predikat Sangat Baik (${scoreResult.percentage}%). Alur pembelajaran mendalam (Deep Learning) terimplementasi dengan baik mulai dari tahap memahami konsep hingga refleksi makna bersama murid.`,
        badge: 'Predikat',
      });
    } else if (scoreResult.percentage >= 70) {
      catatanReferensi.push({
        label: `Capaian Baik (${scoreResult.percentage}%)`,
        text: `Pembelajaran berjalan dengan baik (${scoreResult.percentage}%) dan kondusif. Mayoritas tujuan pembelajaran berhasil dicapai dan interaksi guru-murid berjalan komunikatif.`,
        badge: 'Predikat',
      });
    }

    catatanReferensi.push(
      {
        label: 'Pengelolaan Kelas & Positif',
        text: 'Manajemen kelas sangat efektif dengan penerapan disiplin positif tanpa hukuman. Murid merasa aman secara psikologis untuk berpendapat dan bekerja sama dalam kelompok.',
      },
      {
        label: 'Apersepsi & Motivasi Bermakna',
        text: 'Tahap pendahuluan dieksekusi dengan sangat memikat melalui pertanyaan pemantik kontekstual yang mengaitkan materi ajar dengan pengalaman keseharian murid.',
      },
      {
        label: 'Pemberian Umpan Balik Aktif',
        text: 'Guru secara aktif berkeliling memfasilitasi kerja kelompok dan memberikan umpan balik formatif langsung (scaffolding) bagi murid yang membutuhkan bantuan.',
      }
    );

    // --- Referensi B: Rekomendasi / Saran Perbaikan ---
    const rekomendasiReferensi: { label: string; text: string; badge?: string }[] = [];

    if (lowItems.length > 0) {
      const lowNames = lowItems.slice(0, 3).map((i) => i.nama).join(', ');
      rekomendasiReferensi.push({
        label: `Prioritas Perbaikan Skor Rendah (${lowItems.length} Indikator)`,
        text: `Fokus perbaikan utama ditujukan pada aspek yang belum optimal (skor ≤ 2), khususnya: ${lowNames}. Guru disarankan merancang strategi intervensi yang lebih terstruktur.`,
        badge: 'Perlu Perbaikan',
      });
    }

    // Rekomendasi spesifik bila item tertentu memiliki skor rendah
    if (scores[15] && scores[15] <= 2) {
      rekomendasiReferensi.push({
        label: 'Diferensiasi & Scaffolding (Item 15)',
        text: 'Perlu penguatan diferensiasi proses belajar; berikan variasi lembar kerja atau tantangan bertingkat untuk mengakomodasi murid berkecepatan belajar tinggi dan lambat.',
        badge: 'Item 15',
      });
    }

    if (scores[6] && scores[6] <= 2) {
      rekomendasiReferensi.push({
        label: 'Refleksi Terbimbing (Item 6)',
        text: 'Alokasikan waktu minimal 5-10 menit di akhir sesi untuk memfasilitasi refleksi metakognitif murid agar simpulan pembelajaran lahir dari pemahaman murid sendiri.',
        badge: 'Item 6',
      });
    }

    if (scores[18] && scores[18] <= 2) {
      rekomendasiReferensi.push({
        label: 'Umpan Balik Formatif (Item 18)',
        text: 'Tingkatkan pemberian umpan balik spesifik yang berfokus pada proses usaha murid, bukan sekadar menilai benar atau salah.',
        badge: 'Item 18',
      });
    }

    if (scores[8] && scores[8] <= 2) {
      rekomendasiReferensi.push({
        label: 'Pemanfaatan Media/Digital (Item 8)',
        text: 'Optimalkan penggunaan media pembelajaran visual/digital atau alat peraga nyata agar materi abstrak lebih mudah dipahami oleh murid.',
        badge: 'Item 8',
      });
    }

    rekomendasiReferensi.push(
      {
        label: 'Manajemen Waktu Sesi Belajar',
        text: 'Disarankan membuat time-keeper pada setiap sintaks pembelajaran agar fase eksplorasi kelompok tidak memotong porsi presentasi dan refleksi penutup.',
      },
      {
        label: 'Pemberdayaan Suara Murid (Student Voice)',
        text: 'Berikan ruang lebih leluasa bagi murid yang pemalu untuk menyampaikan gagasan melalui papan tempel (sticky note) atau papan digital interaktif.',
      }
    );

    // --- Referensi C: Rencana Tindak Lanjut Awal ---
    const tindakLanjutReferensi: { label: string; text: string; badge?: string }[] = [];

    if (lowItems.length > 0) {
      tindakLanjutReferensi.push({
        label: 'Konsultasi Pasca Observasi',
        text: `Mendiskusikan strategi pembenahan indikator ${lowItems.slice(0, 2).map((i) => i.nama).join(' & ')} pada sesi coaching dialog pasca observasi bersama supervisor.`,
        badge: 'Tindak Lanjut Prioritas',
      });
    }

    tindakLanjutReferensi.push(
      {
        label: 'Sharing di Komunitas Belajar (Kombel)',
        text: 'Membagikan rekaman/pengalaman praktik mengajar dan mendiskusikan variasi teknik asesmen formatif dalam forum Kombel guru mata pelajaran sekolah.',
      },
      {
        label: 'Peer Observation / Mengamati Rekan',
        text: 'Melakukan observasi silang (peer teaching observation) ke kelas rekan guru sejawat untuk mengadopsi variasi strategi manajemen diferensiasi kelas.',
      },
      {
        label: 'Penyempurnaan Modul Ajar Sesi Berikut',
        text: 'Menyelaraskan kembali rubrik asesmen kinerja dan lembar aktivitas LKPD pada modul ajar untuk topik pertemuan berikutnya.',
      },
      {
        label: 'Pengembangan Mandiri di PMM',
        text: 'Mempelajari modul pelatihan mandiri di Platform Merdeka Mengajar (PMM) terkait Pembelajaran Berdiferensiasi dan Asesmen Formatif Efektif.',
      }
    );

    return {
      catatanReferensi,
      rekomendasiReferensi,
      tindakLanjutReferensi,
      highItems,
      lowItems,
      goodItems,
    };
  };

  const {
    catatanReferensi,
    rekomendasiReferensi,
    tindakLanjutReferensi,
    highItems,
    lowItems,
  } = generateScoreBasedReferences();

  // Tombol Otomatis: Menyusun draf A, B, dan C mengacu pada hasil pengamatan di kelas
  const handleAutoGenerateFromScore = () => {
    let autoCatatan = '';
    let autoRekomendasi = '';
    let autoTindakLanjut = '';

    if (highItems.length > 0) {
      const topNames = highItems.slice(0, 3).map((i) => i.nama).join(', ');
      autoCatatan = `Observasi kelas menunjukkan kinerja pembelajaran yang sangat baik dengan perolehan skor ${scoreResult.total}/${scoreResult.max} (${scoreResult.percentage}% - Predikat ${scoreResult.predikat}). Kekuatan menonjol teramati pada: ${topNames}. Hubungan interaktif guru-murid terbangun secara kondusif dan inklusif.`;
    } else {
      autoCatatan = `Pembelajaran telah diobservasi dengan perolehan skor ${scoreResult.total}/${scoreResult.max} (${scoreResult.percentage}% - Predikat ${scoreResult.predikat}). Guru telah berupaya mengelola tahapan kelas sesuai rancangan kegiatan.`;
    }

    if (lowItems.length > 0) {
      const lowNames = lowItems.map((i) => i.nama).join('; ');
      autoRekomendasi = `Disarankan untuk memberikan penekanan perbaikan pada aspek: ${lowNames}. Pengelolaan alokasi waktu dan penguatan diferensiasi proses belajar perlu ditingkatkan.`;
      autoTindakLanjut = `Melakukan pendalaman teknis pada sesi dialog pasca observasi, merancang ulang lembar kerja siswa, dan mendiskusikan strategi kelas bersama forum Komunitas Belajar (Kombel) sekolah.`;
    } else if (scoreResult.percentage >= 85) {
      autoRekomendasi = `Pertahankan praktik pembelajaran interaktif ini. Guru dapat memperluas penerapan pembelajaran mendalam (Deep Learning) dengan memfasilitasi murid menyusun proyek aksi nyata berbasis isu lingkungan sekitar.`;
      autoTindakLanjut = `Menjadikan video/skenario pembelajaran ini sebagai bahan berbagi praktik baik (best practice) pada pertemuan Komunitas Belajar tingkat sekolah/MGMP.`;
    } else {
      autoRekomendasi = `Tingkatkan pengawasan dan bimbingan langsung kepada kelompok belajar yang memerlukan bantuan lebih intensif.`;
      autoTindakLanjut = `Menyusun jadwal pendampingan reflektif berkala bersama pengawas pendamping / kepala sekolah.`;
    }

    setFormData((prev) => ({
      ...prev,
      catatanSupervisor: autoCatatan,
      rekomendasiPerbaikan: autoRekomendasi,
      tindakLanjut: autoTindakLanjut,
    }));
  };

  const handleApplyReferensi = (
    field: 'catatanSupervisor' | 'rekomendasiPerbaikan' | 'tindakLanjut',
    templateText: string
  ) => {
    setFormData((prev) => {
      const current = prev[field]?.trim() || '';
      if (!current) {
        return { ...prev, [field]: templateText };
      }
      return { ...prev, [field]: `${current}\n${templateText}` };
    });
  };

  const checkCompletion = () => {
    const unratedItems = INSTRUMEN_3_ITEMS.filter(
      (item) => !formData.scores[item.id] || formData.scores[item.id] === 0
    );
    const errors: string[] = [];

    if (unratedItems.length > 0) {
      errors.push(`Masih ada ${unratedItems.length} indikator observasi yang belum diberi nilai (1-4).`);
    }
    if (!formData.catatanSupervisor?.trim()) {
      errors.push('Catatan Pengamatan Supervisor (Bagian A) belum diisi.');
    }
    if (!formData.rekomendasiPerbaikan?.trim()) {
      errors.push('Rekomendasi Perbaikan (Bagian B) belum diisi.');
    }
    if (!formData.tindakLanjut?.trim()) {
      errors.push('Tindak Lanjut yang Disepakati (Bagian C) belum diisi.');
    }

    return {
      isComplete: errors.length === 0,
      errors,
    };
  };

  const handleSave = () => {
    const validation = checkCompletion();
    if (!validation.isComplete) {
      setValidationAlert(validation.errors.join(' '));
      setSavedAlert(false);
      setTimeout(() => setValidationAlert(null), 5000);
      return;
    }

    const updated: Instrument3Observasi = {
      ...formData,
      isCompleted: true,
      updatedAt: new Date().toISOString(),
    };
    onSaveInstrument(updated);
    setValidationAlert(null);
    setSavedAlert(true);
    setIsSavedAndComplete(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  // Group indicators by section
  const sections = [
    { key: 'A', title: 'A. Perencanaan di Kelas' },
    { key: 'B', title: 'B. Pelaksanaan Pembelajaran' },
    { key: 'C', title: 'C. Pengelolaan Kelas & Suasana Belajar' },
    { key: 'D', title: 'D. IMPLEMENTASI PEMBELAJARAN MENDALAM' },
    { key: 'E', title: 'E. Asesmen Pembelajaran' },
    { key: 'F', title: 'F. Refleksi & Komunikasi Pembelajaran Guru' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi Berhasil Simpan Berkas */}
      {savedAlert && (
        <div className="fixed bottom-6 right-6 z-50 print:hidden animate-bounce flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-400">
          <CheckCircle className="w-5 h-5 text-white shrink-0" />
          <div>
            <p className="font-bold text-sm">Berhasil Simpan Berkas</p>
            <p className="text-[11px] text-emerald-100">Instrumen 3 untuk {currentTeacher.namaGuru} tersimpan</p>
          </div>
        </div>
      )}

      {/* Toast Notifikasi Isian Belum Lengkap */}
      {validationAlert && (
        <div className="fixed bottom-6 right-6 z-50 print:hidden animate-bounce flex items-start gap-2.5 bg-rose-600 text-white px-4 py-3 rounded-xl shadow-xl border border-rose-400 max-w-md">
          <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Isian Belum Lengkap!</p>
            <p className="text-xs text-rose-100 mt-0.5">{validationAlert}</p>
          </div>
        </div>
      )}

      {/* Printable Kop Surat */}
      <div className="hidden print:block">
        <KopSurat
          school={school}
          documentTitle="INSTRUMEN 3: OBSERVASI PELAKSANAAN PEMBELAJARAN DI KELAS"
          subTitle={`Tahun Ajaran ${school.tahunAjaran} - Semester ${school.semester}`}
          nomorSurat={`423.9 / ${school.npsn} / INST-OBS / 2024`}
        />
      </div>

      {/* Teacher Selection & Controls */}
      <div className="print:hidden space-y-4">
        <TeacherSelector
          teachers={teachers}
          selectedTeacherId={selectedTeacherId}
          onSelectTeacher={onSelectTeacher}
          label="Pilih Guru untuk Observasi Kelas:"
        />

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Preset Nilai Observasi:</span>
            <button
              onClick={() => handleQuickFill(4)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              Semua 4 (Sangat Baik)
            </button>
            <button
              onClick={() => handleQuickFill(3)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              Semua 3 (Baik)
            </button>
            <button
              onClick={() => handleQuickFill(2)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
            >
              Semua 2 (Kurang)
            </button>
            <button
              onClick={handleClearScores}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
              title="Kosongkan seluruh nilai dan mulai observasi baru"
            >
              Kosongkan Nilai
            </button>
            <button
              type="button"
              onClick={handleAutoFillAllCatatan}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1 shadow-2xs"
              title="Isi otomatis seluruh Catatan Pengamat mengacu pada indikator & skala skor"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Isi Otomatis Catatan Pengamat</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {savedAlert && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Berhasil Simpan Berkas
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Observasi</span>
            </button>
            <button
              disabled={!isSavedAndComplete}
              onClick={onNavigateNext}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                isSavedAndComplete
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
              title={isSavedAndComplete ? 'Lanjut ke Instrumen 4' : 'Simpan instrumen dengan isian lengkap terlebih dahulu'}
            >
              <span>Instrumen Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
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

      {/* Observation Meta & Scoring Guide */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <School className="w-5 h-5 text-indigo-600 print:hidden" />
            <span>LEMBAR OBSERVASI PROSES PEMBELAJARAN DI KELAS</span>
          </h3>
          <p className="text-xs text-slate-500">
            Penilaian autentik keterlaksanaan pembelajaran berdiferensiasi dan pendekatan mendalam (Deep Learning)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs md:text-sm">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">1. Nama Satuan Pendidikan</span>
            <span className="font-bold text-slate-900">{school.namaSekolah}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">2. Nama Guru yang Diobservasi</span>
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
            <span className="font-semibold text-slate-600">5. Hari / Tanggal Observasi</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              <input
                type="date"
                value={formData.tanggalObservasi}
                onChange={(e) => setFormData({ ...formData, tanggalObservasi: e.target.value })}
                className="font-medium text-slate-900 bg-transparent border-0 p-0 focus:ring-0 text-xs md:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">6. Jam / Waktu Pelaksanaan</span>
            <input
              type="text"
              value={formData.jamKe}
              onChange={(e) => setFormData({ ...formData, jamKe: e.target.value })}
              className="text-right font-medium text-slate-900 bg-transparent border-0 p-0 focus:ring-0 text-xs md:text-sm"
              placeholder="Contoh: Jam 08.00 - 09.30"
            />
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row md:justify-between py-1 border-b border-slate-100 gap-1">
            <span className="font-semibold text-slate-600">7. Materi Pokok / Topik Pembelajaran:</span>
            <input
              type="text"
              value={formData.materiPokok}
              onChange={(e) => setFormData({ ...formData, materiPokok: e.target.value })}
              className="font-semibold text-slate-900 bg-transparent border-0 p-0 focus:ring-0 text-xs md:text-sm flex-1 md:text-right"
              placeholder="Tuliskan topik / materi pokok yang diajarkan..."
            />
          </div>
        </div>

        {/* Scoring Guide Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-sm ${scoreResult.total > 0 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {scoreResult.grade}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                  Hasil Observasi Kelas:
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreResult.badgeColor}`}>
                  {scoreResult.predikat}
                </span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">
                {scoreResult.total > 0
                  ? `Total Skor: ${scoreResult.total} / ${scoreResult.max} (${scoreResult.percentage}%)`
                  : 'Total Skor: Belum Diisi / Nilai Kosong'}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 font-medium space-x-2">
            <span className="font-bold text-slate-800">Petunjuk Skor:</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">1 = Tidak Tampak</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">2 = Kurang</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">3 = Baik</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">4 = Sangat Baik</span>
          </div>
        </div>
      </div>

      {/* Observation Indicator Table Grouped by Sections A-F */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            Indikator Fokus Pengamatan Aktivitas Pembelajaran
          </h3>
          <p className="text-xs text-slate-500">
            Mencakup perencanaan di kelas, pelaksanaan, manajemen kelas, pembelajaran mendalam, asesmen, dan refleksi
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {sections.map((sec) => {
            const sectionItems = INSTRUMEN_3_ITEMS.filter((item) => item.section === sec.key);
            if (sectionItems.length === 0) return null;

            // Section D: Implementasi Pembelajaran Mendalam with format matching A, B, C, E, F
            if (sec.key === 'D') {
              const subSections = [
                { title: '1. Keselarasan', items: sectionItems.filter((i) => i.subSection === '1. Keselarasan') },
                { title: '2. Kerangka Pembelajaran', items: sectionItems.filter((i) => i.subSection === '2. Kerangka Pembelajaran') },
                { title: '3. Langkah Pembelajaran', items: sectionItems.filter((i) => i.subSection === '3. Langkah Pembelajaran') },
              ];

              return (
                <div key={sec.key} className="p-4 md:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs md:text-sm uppercase tracking-wide flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-mono font-bold">
                        {sec.key}
                      </span>
                      <span>{sec.title}</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {sectionItems.length} Indikator
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px]">
                          <th className="py-2 px-2 text-center w-8">No</th>
                          <th className="py-2 px-3 min-w-[260px]">Fokus Indikator & Deskripsi</th>
                          <th className="py-2 px-2 text-center w-36">Skala Nilai (1-4)</th>
                          <th className="py-2 px-3 min-w-[200px]">Catatan Pengamat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {subSections.map((subSec) => (
                          <React.Fragment key={subSec.title}>
                            {/* Sub-section Header Divider Row */}
                            <tr className="bg-sky-50/70 border-y border-sky-100">
                              <td colSpan={4} className="py-2 px-3 font-bold text-sky-900 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                  <span>{subSec.title}</span>
                                </div>
                              </td>
                            </tr>

                            {subSec.items.map((item) => {
                              const curScore = formData.scores[item.id] || 0;
                              return (
                                <tr key={item.id} className="hover:bg-slate-50/50">
                                  <td className="py-2.5 px-2 text-center font-bold text-slate-500 align-top">
                                    {item.id}
                                  </td>
                                  <td className="py-2.5 px-3 align-top">
                                    {item.highlightHeader && (
                                      <div className="bg-[#fce4d6] text-amber-950 font-bold px-2 py-0.5 rounded text-xs inline-block mb-1 border border-orange-200">
                                        {item.highlightHeader}
                                      </div>
                                    )}

                                    {item.id === 9 && (
                                      <div className="font-bold text-slate-900 mb-1">
                                        Implementasi perencanaan selaras dengan perencanaan pembelajaran:
                                      </div>
                                    )}

                                    {((item.id >= 11 && item.id <= 15) || (item.id >= 19 && item.id <= 20)) && (
                                      <div className="font-bold text-slate-900 leading-snug">
                                        {item.deskripsi}
                                      </div>
                                    )}

                                    {item.subItems && item.subItems.length > 0 && (
                                      <div className="space-y-1 pl-1 mt-0.5">
                                        {item.subItems.map((si, sIdx) => (
                                          <div key={sIdx} className="flex items-start gap-1.5 text-slate-700 text-xs">
                                            <span className="font-semibold text-slate-600 shrink-0">{si.label}</span>
                                            <span className="leading-snug">{si.text}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-2.5 px-2 text-center align-top">
                                    <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                                      {[1, 2, 3, 4].map((v) => (
                                        <button
                                          key={v}
                                          type="button"
                                          onClick={() => handleScoreChange(item.id, v)}
                                          className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                                            curScore === v
                                              ? v >= 3
                                                ? 'bg-indigo-600 text-white shadow-xs'
                                                : 'bg-rose-600 text-white shadow-xs'
                                              : 'text-slate-600 hover:bg-slate-200'
                                          }`}
                                          title={`Pilih Skor ${v}`}
                                        >
                                          {v}
                                        </button>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 align-top">
                                    <div className="relative flex items-center">
                                      <input
                                        type="text"
                                        placeholder={
                                          curScore > 0
                                            ? getObservasiReferenceNote(item.id, curScore)
                                            : 'Pilih skala (1-4) untuk referensi catatan otomatis...'
                                        }
                                        value={formData.catatanPerIndikator[item.id] || ''}
                                        onChange={(e) => handleCatatanIndikatorChange(item.id, e.target.value)}
                                        className="w-full pr-7 px-2.5 py-1 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-400 rounded-md focus:outline-hidden transition-colors"
                                        title="Catatan pengamat terisi otomatis mengacu pada fokus indikator dan petunjuk skor. Bebas disunting."
                                      />
                                      {curScore > 0 && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCatatanIndikatorChange(
                                              item.id,
                                              getObservasiReferenceNote(item.id, curScore)
                                            )
                                          }
                                          title="Isi / Kembalikan ke Referensi Skor Otomatis"
                                          className="absolute right-1 text-slate-400 hover:text-indigo-600 p-0.5 rounded hover:bg-slate-100 transition-colors"
                                        >
                                          <Sparkles className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }

            return (
              <div key={sec.key} className="p-4 md:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs md:text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-mono font-bold">
                      {sec.key}
                    </span>
                    <span>{sec.title}</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {sectionItems.length} Indikator
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px]">
                        <th className="py-2 px-2 text-center w-8">No</th>
                        <th className="py-2 px-3 min-w-[260px]">Fokus Indikator & Deskripsi</th>
                        <th className="py-2 px-2 text-center w-36">Skala Nilai (1-4)</th>
                        <th className="py-2 px-3 min-w-[200px]">Catatan Pengamat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {sectionItems.map((item) => {
                        const curScore = formData.scores[item.id] || 0;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-2 text-center font-bold text-slate-500">{item.id}</td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900">{item.nama}</div>
                              <div className="text-[11px] text-slate-500 leading-snug">{item.deskripsi}</div>
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                                {[1, 2, 3, 4].map((v) => (
                                  <button
                                    key={v}
                                    type="button"
                                    onClick={() => handleScoreChange(item.id, v)}
                                    className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                                      curScore === v
                                        ? v >= 3
                                          ? 'bg-indigo-600 text-white shadow-xs'
                                          : 'bg-rose-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {v}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="relative flex items-center">
                                <input
                                  type="text"
                                  placeholder={
                                    curScore > 0
                                      ? getObservasiReferenceNote(item.id, curScore)
                                      : 'Pilih skala (1-4) untuk referensi catatan otomatis...'
                                  }
                                  value={formData.catatanPerIndikator[item.id] || ''}
                                  onChange={(e) => handleCatatanIndikatorChange(item.id, e.target.value)}
                                  className="w-full pr-7 px-2.5 py-1 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-400 rounded-md focus:outline-hidden transition-colors"
                                  title="Catatan pengamat terisi otomatis mengacu pada fokus indikator dan petunjuk skor. Bebas disunting."
                                />
                                {curScore > 0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCatatanIndikatorChange(
                                        item.id,
                                        getObservasiReferenceNote(item.id, curScore)
                                      )
                                    }
                                    title="Isi / Kembalikan ke Referensi Skor Otomatis"
                                    className="absolute right-1 text-slate-400 hover:text-indigo-600 p-0.5 rounded hover:bg-slate-100 transition-colors"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Qualitative Feedback & Follow-up */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 print:hidden" />
              <span>KESIMPULAN PENGAMATAN, REKOMENDASI & TINDAK LANJUT</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Referensi catatan, rekomendasi, dan tindak lanjut mengacu secara langsung pada 24 indikator pengamatan kelas
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoGenerateFromScore}
            className="print:hidden text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg border border-indigo-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
            title="Susun draf Catatan, Rekomendasi, dan Tindak Lanjut otomatis mengacu pada skor observasi saat ini"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate Otomatis dari Hasil Observasi</span>
          </button>
        </div>

        <div className="space-y-4 text-xs md:text-sm">
          {/* Bagian A */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <label className="block font-semibold text-slate-800">
                A. Catatan Keseluruhan Supervisor:
              </label>
              <span className="text-[11px] text-slate-400 print:hidden italic">
                *Teks di bawah bebas diedit atau disesuaikan
              </span>
            </div>

            {/* Referensi Catatan Supervisor (Print Hidden) */}
            <div className="print:hidden bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pilih Referensi Catatan Pengamatan (Mengacu Skor Unggul):</span>
                </span>
                {highItems.length > 0 && (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                    {highItems.length} Indikator Skor 4 (Sangat Baik)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {catatanReferensi.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyReferensi('catatanSupervisor', item.text)}
                    title={item.text}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-all shadow-2xs flex items-center gap-1.5 text-left border ${
                      item.badge === 'Skor 4 (Sangat Baik)'
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                        : 'bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-slate-400 text-[10px]">+</span>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={4}
              value={formData.catatanSupervisor}
              onChange={(e) => setFormData({ ...formData, catatanSupervisor: e.target.value })}
              placeholder="Catatan menyeluruh mengenai atmosfer pembelajaran dan performa mengajar atau klik referensi di atas..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed font-normal"
            />
          </div>

          {/* Bagian B */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <label className="block font-semibold text-slate-800">
                B. Rekomendasi / Saran Perbaikan:
              </label>
              <span className="text-[11px] text-slate-400 print:hidden italic">
                *Teks di bawah bebas diedit atau disesuaikan
              </span>
            </div>

            {/* Referensi Rekomendasi (Print Hidden) */}
            <div className="print:hidden bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pilih Rekomendasi Perbaikan (Mengacu Indikator Skor Rendah):</span>
                </span>
                {lowItems.length > 0 && (
                  <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-medium">
                    {lowItems.length} Indikator Perlu Penguatan (Skor ≤ 2)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rekomendasiReferensi.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyReferensi('rekomendasiPerbaikan', item.text)}
                    title={item.text}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-all shadow-2xs flex items-center gap-1.5 text-left border ${
                      item.badge === 'Perlu Perbaikan'
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-300 font-semibold'
                        : item.badge
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 font-medium'
                        : 'bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-slate-400 text-[10px]">+</span>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={4}
              value={formData.rekomendasiPerbaikan}
              onChange={(e) => setFormData({ ...formData, rekomendasiPerbaikan: e.target.value })}
              placeholder="Aspek-aspek teknis atau pedagogis yang perlu diperbaiki pada sesi berikutnya atau klik referensi di atas..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed font-normal"
            />
          </div>

          {/* Bagian C */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <label className="block font-semibold text-slate-800">
                C. Rencana Tindak Lanjut Awal:
              </label>
              <span className="text-[11px] text-slate-400 print:hidden italic">
                *Teks di bawah bebas diedit atau disesuaikan
              </span>
            </div>

            {/* Referensi Tindak Lanjut (Print Hidden) */}
            <div className="print:hidden bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Pilih Referensi Tindak Lanjut Awal:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tindakLanjutReferensi.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyReferensi('tindakLanjut', item.text)}
                    title={item.text}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-all shadow-2xs flex items-center gap-1.5 text-left border ${
                      item.badge === 'Tindak Lanjut Prioritas'
                        ? 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-300 font-semibold'
                        : 'bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-slate-400 text-[10px]">+</span>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={formData.tindakLanjut}
              onChange={(e) => setFormData({ ...formData, tindakLanjut: e.target.value })}
              placeholder="Tindak lanjut yang akan didiskusikan lebih lanjut pada sesi pasca observasi atau klik referensi di atas..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed font-normal"
            />
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 print:hidden">
          <div className="text-xs text-slate-500">
            {!isSavedAndComplete ? (
              <span className="text-amber-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Lengkapi seluruh 24 indikator & catatan A, B, C lalu simpan untuk membuka Instrumen Berikutnya
              </span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Instrumen 3 telah lengkap & tersimpan. Silakan lanjut ke Instrumen Berikutnya.
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Instrumen 3</span>
            </button>
            <button
              disabled={!isSavedAndComplete}
              onClick={onNavigateNext}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isSavedAndComplete
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
              title={isSavedAndComplete ? 'Lanjut ke Instrumen 4' : 'Simpan instrumen dengan isian lengkap terlebih dahulu'}
            >
              <span>Instrumen Berikutnya (Instrumen 4)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Signature Block */}
      <SignatureBlock
        school={school}
        teacher={currentTeacher}
        tanggalDokumen={formData.tanggalObservasi}
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
