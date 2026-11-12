import React, { useState, useEffect } from 'react';
import {
  AppSupervisionData,
  Instrument2ModulAjar,
  INSTRUMEN_2_ITEMS,
  calculateInstrumen2Score,
} from '../types/supervision';
import { KopSurat } from './KopSurat';
import { SignatureBlock } from './SignatureBlock';
import { TeacherSelector } from './TeacherSelector';
import {
  CheckCircle,
  Save,
  Printer,
  Calendar,
  BookMarked,
  Check,
  X,
  FileText,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import {
  getModulAjarReferenceNote,
  isAutoModulAjarNote,
} from '../utils/modulAjarReferences';
import { PrintModal } from './PrintModal';

interface Instrument2ViewProps {
  data: AppSupervisionData;
  selectedTeacherId: string;
  onSelectTeacher: (id: string) => void;
  onSaveInstrument: (record: Instrument2ModulAjar) => void;
  onNavigateNext?: () => void;
}

export const Instrument2View: React.FC<Instrument2ViewProps> = ({
  data,
  selectedTeacherId,
  onSelectTeacher,
  onSaveInstrument,
  onNavigateNext,
}) => {
  const { school, teachers, instrumen2 } = data;
  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const [formData, setFormData] = useState<Instrument2ModulAjar>(() => {
    const existing = instrumen2[selectedTeacherId];
    if (existing) return existing;

    return {
      id: `inst2-${selectedTeacherId}`,
      teacherId: selectedTeacherId,
      tanggalTelaah: new Date().toISOString().split('T')[0],
      items: {},
      catatanTemuan: '',
      rekomendasi: '',
      tanggapanGuru: '',
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
    return !!instrumen2[selectedTeacherId]?.isCompleted;
  });
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isPrintBlank, setIsPrintBlank] = useState(false);

  const handleTriggerPrint = (isBlank: boolean) => {
    setIsPrintBlank(isBlank);
    setShowPrintModal(false);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  useEffect(() => {
    const existing = instrumen2[selectedTeacherId];
    if (existing) {
      setFormData(existing);
      setIsSavedAndComplete(!!existing.isCompleted);
    } else {
      setFormData({
        id: `inst2-${selectedTeacherId}`,
        teacherId: selectedTeacherId,
        tanggalTelaah: new Date().toISOString().split('T')[0],
        items: {},
        catatanTemuan: '',
        rekomendasi: '',
        tanggapanGuru: '',
        ttdPengawas: false,
        ttdKepalaSekolah: false,
        ttdGuru: false,
        isCompleted: false,
        updatedAt: new Date().toISOString(),
      });
      setIsSavedAndComplete(false);
    }
    setValidationAlert(null);
  }, [selectedTeacherId, instrumen2]);

  const scoreResult = calculateInstrumen2Score(formData.items);

  const handleToggleYa = (id: number, val: boolean) => {
    setFormData((prev) => {
      const current = prev.items[id];
      if (current && current.ya === val) {
        // Toggle off if clicked again
        const newItems = { ...prev.items };
        delete newItems[id];
        return { ...prev, items: newItems };
      }

      const currentCatatan = current?.catatan || '';
      let nextCatatan = currentCatatan;

      // Otomatis isi/perbarui catatan pengamatan & bukti penunjang sesuai indikator dan keterlaksanaan
      if (!currentCatatan.trim() || isAutoModulAjarNote(id, currentCatatan)) {
        nextCatatan = getModulAjarReferenceNote(id, val);
      }

      return {
        ...prev,
        items: {
          ...prev.items,
          [id]: {
            ya: val,
            catatan: nextCatatan,
          },
        },
      };
    });
  };

  const handleCatatanChange = (id: number, catatan: string) => {
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [id]: {
          ya: prev.items[id]?.ya ?? true,
          catatan,
        },
      },
    }));
  };

  const handleSetAll = (status: boolean) => {
    const newItems: Record<number, { ya: boolean; catatan: string }> = {};
    INSTRUMEN_2_ITEMS.forEach((it) => {
      newItems[it.id] = {
        ya: status,
        catatan: getModulAjarReferenceNote(it.id, status),
      };
    });
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleAutoFillAllCatatan = () => {
    setFormData((prev) => {
      const updatedItems = { ...prev.items };
      INSTRUMEN_2_ITEMS.forEach((it) => {
        const itemData = prev.items[it.id];
        const isYa = itemData ? itemData.ya : true;
        updatedItems[it.id] = {
          ya: isYa,
          catatan: getModulAjarReferenceNote(it.id, isYa),
        };
      });
      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const handleClearAll = () => {
    setFormData((prev) => ({
      ...prev,
      items: {},
      catatanTemuan: '',
      rekomendasi: '',
      tanggapanGuru: '',
      isCompleted: false,
    }));
    setIsSavedAndComplete(false);
  };

  // Logika cerdas: Menghasilkan referensi catatan dan rekomendasi modul ajar mengacu pada hasil penilaian 20 indikator
  const generateScoreBasedReferences = () => {
    const items = formData.items || {};
    const yaItems: { id: number; nama: string; deskripsi: string }[] = [];
    const tidakItems: { id: number; nama: string; deskripsi: string }[] = [];

    INSTRUMEN_2_ITEMS.forEach((def) => {
      const state = items[def.id];
      if (state) {
        if (state.ya) {
          yaItems.push(def);
        } else {
          tidakItems.push(def);
        }
      }
    });

    // Referensi Catatan Temuan / Keunggulan Rancangan Modul (A)
    const catatanReferensi: { label: string; text: string; badge?: string }[] = [];

    if (yaItems.length > 0) {
      const topNames = yaItems.slice(0, 3).map((i) => i.nama).join(', ');
      catatanReferensi.push({
        label: `Berdasarkan Indikator Terpenuhi (${yaItems.length}/${scoreResult.max})`,
        text: `Modul Ajar dirancang sangat baik dan memenuhi kriteria esensial kurikulum, terutama pada aspek: ${topNames}. Struktur modul lengkap dan kontekstual.`,
        badge: 'Sesuai Hasil Ya',
      });
    }

    if (scoreResult.percentage >= 85) {
      catatanReferensi.push({
        label: `Predikat Sangat Baik (${scoreResult.percentage}%)`,
        text: `Secara menyeluruh rancangan Modul Ajar (RPM) berada pada predikat Sangat Baik (${scoreResult.percentage}% ketercapaian). Langkah pembelajaran terstruktur dengan tahapan Memahami, Mengaplikasi, Merefleksi, dan Memuliakan.`,
        badge: 'Predikat',
      });
    } else if (scoreResult.percentage >= 70) {
      catatanReferensi.push({
        label: `Predikat Baik (${scoreResult.percentage}%)`,
        text: `Rancangan Modul Ajar memenuhi predikat Baik (${scoreResult.percentage}%). Komponen utama tujuan pembelajaran, asesmen, dan skenario inti telah terintegrasi dengan baik.`,
        badge: 'Predikat',
      });
    }

    catatanReferensi.push(
      {
        label: 'Diferensiasi & Kebutuhan Murid',
        text: 'Modul Ajar telah mengintegrasikan pemetaan kesiapan murid ke dalam diferensiasi proses dan konten yang akomodatif terhadap keragaman gaya belajar siswa.',
      },
      {
        label: 'Aktivitas Mendalam & Bermakna',
        text: 'Alur kegiatan inti memuat pertanyaan pemantik dan aktivitas eksplorasi konsep yang merangsang daya nalar kritis dan pemahaman konsep secara mendalam.',
      },
      {
        label: 'Integrasi Teknologi Digital',
        text: 'Pemanfaatan media ajar interaktif dan platform digital diintegrasikan secara efektif untuk memperkaya pengalaman belajar murid.',
      }
    );

    // Referensi Rekomendasi / Saran Penyempurnaan Modul Ajar (B)
    const rekomendasiReferensi: { label: string; text: string; badge?: string }[] = [];

    if (tidakItems.length > 0) {
      const needFixNames = tidakItems.slice(0, 3).map((i) => i.nama).join(', ');
      rekomendasiReferensi.push({
        label: `Fokus Perbaikan Komponen 'Tidak' (${tidakItems.length} Aspek)`,
        text: `Perlu melengkapi dan menyempurnakan komponen modul ajar yang belum terpenuhi (ditandai Tidak), khususnya pada aspek: ${needFixNames}.`,
        badge: 'Prioritas Perbaikan',
      });
    }

    // Rekomendasi spesifik bila item penting tertentu bernilai 'Tidak'
    if (items[21] && !items[21].ya) {
      rekomendasiReferensi.push({
        label: 'Rubrik & LKPD (Item 21)',
        text: 'Lampirkan Lembar Kerja Peserta Didik (LKPD) yang kontekstual beserta rubrik penilaian Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) secara lebih terperinci.',
        badge: 'Item 21',
      });
    }

    if (items[9] && !items[9].ya) {
      rekomendasiReferensi.push({
        label: 'Diferensiasi Pembelajaran (Item 9)',
        text: 'Pertegas skenario diferensiasi (konten, proses, atau produk) pada kegiatan inti agar kebutuhan siswa dengan kesiapan berbeda terlayani secara adil.',
        badge: 'Item 9',
      });
    }

    if (items[17] && !items[17].ya) {
      rekomendasiReferensi.push({
        label: 'Asesmen Diagnostik/Awal (Item 17)',
        text: 'Sertakan instrumen asesmen diagnostik di awal modul untuk memetakan kesiapan awal murid sebelum masuk ke materi pokok.',
        badge: 'Item 17',
      });
    }

    if (items[12] && !items[12].ya) {
      rekomendasiReferensi.push({
        label: 'Pemanfaatan Digital (Item 12)',
        text: 'Disarankan mengoptimalkan integrasi platform pembelajaran digital (kuis interaktif, video apersepsi, simulasi) guna meningkatkan partisipasi aktif murid.',
        badge: 'Item 12',
      });
    }

    rekomendasiReferensi.push(
      {
        label: 'Pengembangan Bersama di Kombel',
        text: 'Disarankan mereview dan membedah rancangan Modul Ajar bersama rekan guru serumpun dalam forum Komunitas Belajar (Kombel) sekolah.',
      },
      {
        label: 'Alokasi Waktu Fleksibel',
        text: 'Perlu penyesuaian perkiraan alokasi waktu per tahapan aktivitas agar kegiatan refleksi dan penutup tidak tergesa-gesa.',
      }
    );

    return {
      catatanReferensi,
      rekomendasiReferensi,
      yaItems,
      tidakItems,
    };
  };

  const { catatanReferensi, rekomendasiReferensi, yaItems, tidakItems } = generateScoreBasedReferences();

  // Tombol Otomatis: Menyusun narasi Catatan Temuan & Rekomendasi langsung dari penilaian 20 item
  const handleAutoGenerateFromScore = () => {
    let autoCatatan = '';
    let autoRekomendasi = '';

    if (yaItems.length > 0) {
      const topNames = yaItems.slice(0, 4).map((i) => i.nama).join(', ');
      autoCatatan = `Rancangan Modul Ajar guru memenuhi ${scoreResult.totalYa} dari ${scoreResult.max} kriteria (${scoreResult.percentage}% - Predikat ${scoreResult.predikat}). Keunggulan utama tampak pada pemenuhan aspek: ${topNames}, yang tersusun sistematis dan berpusat pada murid.`;
    } else {
      autoCatatan = `Rancangan Modul Ajar telah ditelaah dengan ketercapaian ${scoreResult.percentage}% (Predikat ${scoreResult.predikat}). Kerangka umum modul telah disusun oleh guru.`;
    }

    if (tidakItems.length > 0) {
      const needFixNames = tidakItems.map((i) => i.nama).join('; ');
      autoRekomendasi = `Disarankan untuk melengkapi komponen Modul Ajar yang belum terpenuhi: ${needFixNames}. Lakukan perbaikan rubrik dan instrumen pendukung sebelum diterapkan di kelas.`;
    } else if (scoreResult.percentage >= 90) {
      autoRekomendasi = `Rancangan modul ajar sudah sangat matang dan inovatif. Modul ini layak dijadikan referensi praktik baik (best practice) bagi guru lainnya di satuan pendidikan.`;
    } else {
      autoRekomendasi = `Lakukan penyelarasan berkala antara tujuan pembelajaran dengan asesmen formatif selama proses pembelajaran di kelas berlangsung.`;
    }

    setFormData((prev) => ({
      ...prev,
      catatanTemuan: autoCatatan,
      rekomendasi: autoRekomendasi,
    }));
  };

  const handleApplyReferensi = (field: 'catatanTemuan' | 'rekomendasi', templateText: string) => {
    setFormData((prev) => {
      const current = prev[field]?.trim() || '';
      if (!current) {
        return { ...prev, [field]: templateText };
      }
      return { ...prev, [field]: `${current}\n${templateText}` };
    });
  };

  const checkCompletion = () => {
    const unratedItems = INSTRUMEN_2_ITEMS.filter((item) => formData.items[item.id] === undefined);
    const errors: string[] = [];

    if (unratedItems.length > 0) {
      errors.push(`Masih ada ${unratedItems.length} butir modul ajar yang belum dinilai (pilih Ya/Tidak).`);
    }
    if (!formData.catatanTemuan?.trim()) {
      errors.push('Catatan Temuan / Keunggulan belum diisi.');
    }
    if (!formData.rekomendasi?.trim()) {
      errors.push('Rekomendasi Tindak Lanjut belum diisi.');
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

    const updated: Instrument2ModulAjar = {
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

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi Berhasil Simpan Berkas */}
      {savedAlert && (
        <div className="fixed bottom-6 right-6 z-50 print:hidden animate-bounce flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-400">
          <CheckCircle className="w-5 h-5 text-white shrink-0" />
          <div>
            <p className="font-bold text-sm">Berhasil Simpan Berkas</p>
            <p className="text-[11px] text-emerald-100">Instrumen 2 untuk {currentTeacher.namaGuru} tersimpan lengkap</p>
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
          documentTitle="INSTRUMEN 2: TELAAH MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN (RPM/MA)"
          subTitle={`Tahun Ajaran ${school.tahunAjaran} - Semester ${school.semester}`}
          nomorSurat={`423.8 / ${school.npsn} / INST-MA / 2024`}
        />
      </div>

      {/* Teacher Selection & Controls */}
      <div className="print:hidden space-y-4">
        <TeacherSelector
          teachers={teachers}
          selectedTeacherId={selectedTeacherId}
          onSelectTeacher={onSelectTeacher}
          label="Pilih Guru untuk Telaah Modul Ajar:"
        />

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Preset Penilaian:</span>
            <button
              onClick={() => handleSetAll(true)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Centang Semua &apos;Ya&apos;
            </button>
            <button
              onClick={() => handleSetAll(false)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Centang Semua &apos;Tidak&apos;
            </button>
            <button
              onClick={handleClearAll}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
              title="Kosongkan seluruh nilai dan mulai telaah baru"
            >
              Kosongkan Nilai
            </button>
            <button
              type="button"
              onClick={handleAutoFillAllCatatan}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1 shadow-2xs"
              title="Isi otomatis seluruh Catatan Pengamatan / Bukti Penunjang mengacu pada indikator & keterlaksanaan"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Isi Otomatis Bukti Penunjang</span>
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
              <span>Simpan Instrumen</span>
            </button>
            <button
              disabled={!isSavedAndComplete}
              onClick={onNavigateNext}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                isSavedAndComplete
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
              title={isSavedAndComplete ? 'Lanjut ke Instrumen 3' : 'Simpan instrumen dengan isian lengkap terlebih dahulu'}
            >
              <span>Instrumen Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-2xs hover:shadow-xs"
              title="Cetak dokumen terisi atau blangko kosong dalam format PDF"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Cetak Form (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Identity Sheet */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="border-b border-slate-200 pb-3 mb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600 print:hidden" />
            <span>IDENTITAS TELAAH PERANGKAT MODUL AJAR (RPM/MA)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Kesesuaian rancangan modul ajar berbasis Pembelajaran Mendalam (Deep Learning) & Diferensiasi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-sm md:text-base">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-700">1. Nama Sekolah</span>
            <span className="font-bold text-slate-900">{school.namaSekolah}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-700">2. Nama Guru Penyusun</span>
            <span className="font-bold text-slate-900">{currentTeacher.namaGuru}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-700">3. Mata Pelajaran</span>
            <span className="font-bold text-indigo-700">{currentTeacher.mataPelajaran}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-700">4. Kelas / Fase</span>
            <span className="text-slate-900">{currentTeacher.kelasFase}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-700">5. Alokasi Jam Tatap Muka</span>
            <span className="text-slate-900">{currentTeacher.jamTatapMuka} JTM</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-700">6. Tanggal Telaah Modul</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              <input
                type="date"
                value={formData.tanggalTelaah}
                onChange={(e) => setFormData({ ...formData, tanggalTelaah: e.target.value })}
                className="font-medium text-slate-900 bg-transparent border-0 p-0 focus:ring-0 text-sm md:text-base"
              />
            </div>
          </div>
        </div>

        {/* Real-time Calculation Summary Badge Bar */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-sm ${scoreResult.totalYa > 0 && !isPrintBlank ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {isPrintBlank ? '-' : scoreResult.grade}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                  Hasil Ketercapaian Modul Ajar:
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreResult.badgeColor}`}>
                  {isPrintBlank ? 'Blangko Observasi' : scoreResult.predikat}
                </span>
              </div>
              <p className="text-sm md:text-base font-extrabold text-slate-900">
                {isPrintBlank
                  ? 'Blangko Instrumen Kosong (Siap Diisi Manual)'
                  : Object.keys(formData.items).length > 0
                  ? `Keterpenuhan: ${scoreResult.totalYa} dari ${scoreResult.max} Indikator (${scoreResult.percentage}%)`
                  : 'Keterpenuhan: Belum Diisi / Nilai Kosong'}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600">
            Metode Penilaian: Ceklis Keterpenuhan Komponen (Ya = Memenuhi, Tidak = Belum Memenuhi)
          </div>
        </div>
      </div>

      {/* 20 Indicators Checklist Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            Daftar Indikator Telaah Modul Ajar / RPM ({INSTRUMEN_2_ITEMS.length} Indikator)
          </h3>
          <span className="text-xs font-mono text-slate-500">Standar Kurikulum Merdeka</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold uppercase tracking-wider text-xs md:text-sm">
                <th className="py-3 px-3 text-center w-10">No</th>
                <th className="py-3 px-4 min-w-[280px]">Indikator Komponen Modul Ajar</th>
                <th className="py-3 px-3 text-center w-36">Keterlaksanaan</th>
                <th className="py-3 px-4 min-w-[220px]">Catatan Pengamatan / Bukti Penunjang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {INSTRUMEN_2_ITEMS.map((item) => {
                const itemData = formData.items[item.id];
                const hasAnswer = itemData !== undefined;
                const isYa = hasAnswer && itemData.ya === true;
                const isTidak = hasAnswer && itemData.ya === false;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-500 text-sm align-top">{item.id}</td>
                    <td className="py-3 px-4 align-top">
                      <div className="font-bold text-slate-900 text-sm md:text-base">{item.nama}</div>
                      <div className="text-xs md:text-sm text-slate-600 mt-1 leading-snug">{item.deskripsi}</div>
                    </td>
                    <td className="py-3 px-3 text-center align-top">
                      {/* On-screen Ya/Tidak buttons */}
                      <div className="print:hidden inline-flex rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleToggleYa(item.id, true)}
                          className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1 ${
                            isYa
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>Ya</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleYa(item.id, false)}
                          className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1 ${
                            isTidak
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <X className="w-3 h-3" />
                          <span>Tidak</span>
                        </button>
                      </div>
                      {/* Print-friendly status */}
                      <div className="hidden print:block text-center font-bold text-sm">
                        {isPrintBlank ? (
                          <div className="flex justify-center gap-3 text-xs text-slate-500 font-mono">
                            <span>[ &nbsp; ] Ya</span>
                            <span>[ &nbsp; ] Tidak</span>
                          </div>
                        ) : hasAnswer ? (
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold border ${
                              isYa
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            {isYa ? 'Ya (Memenuhi)' : 'Tidak (Belum)'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 align-top">
                      {/* On-screen input */}
                      <div className="print:hidden relative flex items-center">
                        <input
                          type="text"
                          placeholder={
                            hasAnswer
                              ? getModulAjarReferenceNote(item.id, itemData.ya)
                              : 'Pilih Ya/Tidak untuk catatan bukti penunjang otomatis...'
                          }
                          value={itemData?.catatan || ''}
                          onChange={(e) => handleCatatanChange(item.id, e.target.value)}
                          className="w-full pr-7 px-3 py-2 text-xs md:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-400 rounded-md focus:outline-hidden transition-colors"
                          title="Catatan Pengamatan / Bukti Penunjang terisi otomatis sesuai indikator & keterlaksanaan. Bebas diedit."
                        />
                        {hasAnswer && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCatatanChange(
                                item.id,
                                getModulAjarReferenceNote(item.id, itemData.ya)
                              )
                            }
                            title="Isi / Kembalikan ke Catatan Bukti Penunjang Otomatis"
                            className="absolute right-1 text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-slate-100 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {/* Print-friendly text / ruled blank line */}
                      <div className="hidden print:block text-xs md:text-sm leading-relaxed text-slate-800">
                        {isPrintBlank ? (
                          <div className="border-b border-dashed border-slate-400 h-6"></div>
                        ) : (
                          itemData?.catatan || '-'
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 text-xs md:text-sm border-t-2 border-slate-300">
                <td colSpan={2} className="py-3 px-4 text-right">
                  TOTAL INDIKATOR TERPENUHI (YA):
                </td>
                <td className="py-3 px-3 text-center text-amber-700 text-base">
                  {isPrintBlank ? '-' : Object.keys(formData.items).length > 0 ? `${scoreResult.totalYa} / ${scoreResult.max}` : '-'}
                </td>
                <td className="py-3 px-4 text-slate-800">
                  {isPrintBlank ? (
                    <span className="text-slate-500 font-normal italic">Blangko untuk telaah modul ajar manual</span>
                  ) : Object.keys(formData.items).length > 0 ? (
                    <>Persentase: <span className="text-amber-700">{scoreResult.percentage}%</span> ({scoreResult.predikat})</>
                  ) : (
                    <span className="text-slate-400 font-normal">Belum ada indikator yang dinilai</span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Qualitative Feedback Sections */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 print:hidden" />
              <span>CATATAN TEMUAN & REKOMENDASI MODUL AJAR</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Referensi temuan dan saran rekomendasi mengacu secara otomatis pada pemenuhan {INSTRUMEN_2_ITEMS.length} indikator Modul Ajar (RPM)
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoGenerateFromScore}
            className="print:hidden text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg border border-indigo-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
            title="Susun draf Catatan Temuan & Rekomendasi otomatis mengacu pada skor saat ini"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate Otomatis dari Hasil Telaah</span>
          </button>
        </div>

        <div className="space-y-4 text-xs md:text-sm">
          {/* Bagian A */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <label className="block font-semibold text-slate-800">
                A. Catatan Temuan / Keunggulan Rancangan Modul:
              </label>
              <span className="text-[11px] text-slate-400 print:hidden italic">
                *Teks di bawah bebas diedit atau disesuaikan
              </span>
            </div>

            {/* Referensi Temuan / Keunggulan (Print Hidden) */}
            <div className="print:hidden bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pilih Referensi Keunggulan (Mengacu Hasil Ya):</span>
                </span>
                {yaItems.length > 0 && (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                    {yaItems.length} Indikator Terpenuhi (Ya)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {catatanReferensi.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyReferensi('catatanTemuan', item.text)}
                    title={item.text}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-all shadow-2xs flex items-center gap-1.5 text-left border ${
                      item.badge === 'Sesuai Hasil Ya'
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
              value={formData.catatanTemuan}
              onChange={(e) => setFormData({ ...formData, catatanTemuan: e.target.value })}
              placeholder="Tuliskan apresiasi, model inovatif, atau diferensiasi yang diterapkan atau klik referensi di atas..."
              className="print:hidden w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed font-normal text-xs md:text-sm"
            />
            {/* Print representation */}
            <div className="hidden print:block text-xs md:text-sm">
              {isPrintBlank ? (
                <div className="space-y-3 pt-1">
                  <div className="border-b border-dashed border-slate-400 h-5"></div>
                  <div className="border-b border-dashed border-slate-400 h-5"></div>
                  <div className="border-b border-dashed border-slate-400 h-5"></div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {formData.catatanTemuan || '-'}
                </div>
              )}
            </div>
          </div>

          {/* Bagian B */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <label className="block font-semibold text-slate-800 text-xs md:text-sm">
                B. Rekomendasi / Saran Penyempurnaan Modul Ajar:
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
                  <span>Pilih Rekomendasi Penyempurnaan (Mengacu Indikator Belum Ada):</span>
                </span>
                {tidakItems.length > 0 && (
                  <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-medium">
                    {tidakItems.length} Komponen Perlu Dilengkapi (Tidak)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rekomendasiReferensi.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyReferensi('rekomendasi', item.text)}
                    title={item.text}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-all shadow-2xs flex items-center gap-1.5 text-left border ${
                      item.badge === 'Prioritas Perbaikan'
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
              value={formData.rekomendasi}
              onChange={(e) => setFormData({ ...formData, rekomendasi: e.target.value })}
              placeholder="Tuliskan rekomendasi perbaikan instrumen LKPD, rubrik, atau alur waktu atau klik referensi di atas..."
              className="print:hidden w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed font-normal text-xs md:text-sm"
            />
            {/* Print representation */}
            <div className="hidden print:block text-xs md:text-sm">
              {isPrintBlank ? (
                <div className="space-y-3 pt-1">
                  <div className="border-b border-dashed border-slate-400 h-5"></div>
                  <div className="border-b border-dashed border-slate-400 h-5"></div>
                  <div className="border-b border-dashed border-slate-400 h-5"></div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {formData.rekomendasi || '-'}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1 text-xs md:text-sm">
              C. Tanggapan Guru yang Disupervisi:
            </label>
            <textarea
              rows={3}
              value={formData.tanggapanGuru}
              onChange={(e) => setFormData({ ...formData, tanggapanGuru: e.target.value })}
              placeholder="Tanggapan dan komitmen revisi modul..."
              className="print:hidden w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs md:text-sm"
            />
            {/* Print representation */}
            <div className="hidden print:block text-xs md:text-sm">
              {isPrintBlank ? (
                <div className="space-y-3 pt-1">
                  <div className="border-b border-dashed border-slate-400 h-5"></div>
                  <div className="border-b border-dashed border-slate-400 h-5"></div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {formData.tanggapanGuru || '-'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="text-xs">
            {validationAlert ? (
              <span className="flex items-center gap-1.5 text-rose-600 font-bold animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Isian Belum Lengkap: {validationAlert}
              </span>
            ) : !isSavedAndComplete ? (
              <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Lengkapi seluruh 21 butir penilaian dan klik "Simpan Instrumen 2" untuk mengaktifkan instrumen berikutnya.
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Instrumen 2 telah tersimpan lengkap. Silakan lanjut ke Instrumen 3.
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Instrumen 2</span>
            </button>
            <button
              disabled={!isSavedAndComplete}
              onClick={onNavigateNext}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isSavedAndComplete
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
              title={isSavedAndComplete ? 'Lanjut ke Instrumen 3' : 'Simpan instrumen dengan isian lengkap terlebih dahulu'}
            >
              <span>Instrumen Berikutnya (Instrumen 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Signature Block */}
      <SignatureBlock
        school={school}
        teacher={currentTeacher}
        tanggalDokumen={formData.tanggalTelaah}
        signedPengawas={formData.ttdPengawas}
        signedKepalaSekolah={formData.ttdKepalaSekolah}
        signedGuru={formData.ttdGuru}
        isBlankPrint={isPrintBlank}
        onToggleSignature={(role) => {
          if (role === 'pengawas') setFormData((p) => ({ ...p, ttdPengawas: !p.ttdPengawas }));
          if (role === 'kepala') setFormData((p) => ({ ...p, ttdKepalaSekolah: !p.ttdKepalaSekolah }));
          if (role === 'guru') setFormData((p) => ({ ...p, ttdGuru: !p.ttdGuru }));
        }}
      />

      {/* Print Options Modal */}
      <PrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentTitle="INSTRUMEN 2: TELAAH MODUL AJAR (RPM/MA)"
        teacherName={currentTeacher.namaGuru}
        onPrintFilled={() => handleTriggerPrint(false)}
        onPrintBlank={() => handleTriggerPrint(true)}
      />
    </div>
  );
};
