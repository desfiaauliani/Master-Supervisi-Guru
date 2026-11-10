import React, { useState, useEffect } from 'react';
import {
  AppSupervisionData,
  Teacher,
  SchoolProfile,
  Instrument1Admin,
  INSTRUMEN_1_ITEMS,
  calculateInstrumen1Score,
} from '../types/supervision';
import { KopSurat } from './KopSurat';
import { SignatureBlock } from './SignatureBlock';
import { TeacherSelector } from './TeacherSelector';
import {
  CheckCircle,
  Save,
  Printer,
  Sparkles,
  Award,
  Calendar,
  FileCheck2,
  FileText,
  MessageSquare,
} from 'lucide-react';

interface Instrument1ViewProps {
  data: AppSupervisionData;
  selectedTeacherId: string;
  onSelectTeacher: (id: string) => void;
  onSaveInstrument: (record: Instrument1Admin) => void;
}

export const Instrument1View: React.FC<Instrument1ViewProps> = ({
  data,
  selectedTeacherId,
  onSelectTeacher,
  onSaveInstrument,
}) => {
  const { school, teachers, instrumen1 } = data;
  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  // Local Form State
  const [formData, setFormData] = useState<Instrument1Admin>(() => {
    const existing = instrumen1[selectedTeacherId];
    if (existing) return existing;

    return {
      id: `inst1-${selectedTeacherId}`,
      teacherId: selectedTeacherId,
      tanggalTelaah: new Date().toISOString().split('T')[0],
      scores: {},
      catatanItem: {},
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

  // Sync state when teacher selection changes
  useEffect(() => {
    const existing = instrumen1[selectedTeacherId];
    if (existing) {
      setFormData(existing);
    } else {
      setFormData({
        id: `inst1-${selectedTeacherId}`,
        teacherId: selectedTeacherId,
        tanggalTelaah: new Date().toISOString().split('T')[0],
        scores: {},
        catatanItem: {},
        catatanTemuan: '',
        rekomendasi: '',
        tanggapanGuru: '',
        ttdPengawas: false,
        ttdKepalaSekolah: false,
        ttdGuru: false,
        isCompleted: false,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [selectedTeacherId, instrumen1]);

  const scoreResult = calculateInstrumen1Score(formData.scores);

  const handleScoreChange = (itemId: number, score: number) => {
    setFormData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [itemId]: prev.scores[itemId] === score ? 0 : score,
      },
    }));
  };

  const handleCatatanChange = (itemId: number, val: string) => {
    setFormData((prev) => ({
      ...prev,
      catatanItem: {
        ...prev.catatanItem,
        [itemId]: val,
      },
    }));
  };

  const handleQuickFill = (val: number) => {
    const newScores: Record<number, number> = {};
    INSTRUMEN_1_ITEMS.forEach((item) => {
      newScores[item.id] = val;
    });
    setFormData((prev) => ({ ...prev, scores: newScores }));
  };

  // Fungsi cerdas: Membuat referensi kontekstual berdasarkan skor riil indikator yang dinilai
  const generateScoreBasedReferences = () => {
    const scores = formData.scores || {};
    const ratedItems = Object.entries(scores).map(([k, v]) => ({ id: Number(k), score: Number(v) }));
    
    // Identifikasi indikator dengan skor tertinggi (Kelebihan / Kekuatan: Skor 4 atau 5)
    const highItems = ratedItems
      .filter((item) => item.score >= 4)
      .map((item) => {
        const def = INSTRUMEN_1_ITEMS.find((d) => d.id === item.id);
        return { ...item, nama: def?.nama || `Item ${item.id}` };
      });

    // Identifikasi indikator yang butuh tindak lanjut / perbaikan (Skor 1, 2, atau 3)
    const lowItems = ratedItems
      .filter((item) => item.score > 0 && item.score <= 3)
      .map((item) => {
        const def = INSTRUMEN_1_ITEMS.find((d) => d.id === item.id);
        return { ...item, nama: def?.nama || `Item ${item.id}` };
      });

    // Referensi Catatan Temuan Berdasarkan Skor Riil
    const catatanReferensi: { label: string; text: string; badge?: string }[] = [];
    
    if (highItems.length > 0) {
      const topNames = highItems.slice(0, 3).map((i) => i.nama).join(', ');
      catatanReferensi.push({
        label: `Berdasarkan Nilai Unggul (${highItems.length} Dokumen)`,
        text: `Guru menunjukkan pengadministrasian yang sangat baik dan terstruktur, terutama pada aspek: ${topNames}. Dokumen tersedia lengkap, rapi, dan mutakhir.`,
        badge: 'Sesuai Skor Tinggi',
      });
    }

    if (scoreResult.percentage >= 85) {
      catatanReferensi.push({
        label: `Capaian Predikat Sangat Baik (${scoreResult.percentage}%)`,
        text: `Secara keseluruhan kelengkapan administrasi pembelajaran telah mencapai predikat Sangat Baik (${scoreResult.percentage}%). Perangkat ajar dan perangkat evaluasi tersusun sistematis selaras dengan implementasi Kurikulum Merdeka.`,
        badge: 'Predikat',
      });
    } else if (scoreResult.percentage >= 70) {
      catatanReferensi.push({
        label: `Capaian Predikat Baik (${scoreResult.percentage}%)`,
        text: `Kelengkapan administrasi pembelajaran berada pada kategori Baik (${scoreResult.percentage}%). Mayoritas dokumen pokok perencanaan dan penilaian telah terpenuhi dengan baik.`,
        badge: 'Predikat',
      });
    }

    catatanReferensi.push(
      {
        label: 'Asesmen & Diferensiasi',
        text: 'Dokumen asesmen awal pembelajaran telah dimanfaatkan secara efektif dalam pemetaan kebutuhan belajar murid serta penyusunan modul ajar berdiferensiasi.',
      },
      {
        label: 'Tertib Administrasi Harian',
        text: 'Buku jurnal mengajar harian, presensi murid, dan rekapitulasi nilai formatif-sumatif dikelola secara tertib, konsisten, dan akuntabel.',
      },
      {
        label: 'Pengarsipan Portofolio',
        text: 'Buku refleksi pembelajaran dan bukti bimbingan belajar murid terdokumentasi dengan baik dalam portofolio guru.',
      }
    );

    // Referensi Rekomendasi Tindak Lanjut Berdasarkan Skor Riil
    const rekomendasiReferensi: { label: string; text: string; badge?: string }[] = [];

    if (lowItems.length > 0) {
      const lowNames = lowItems.slice(0, 3).map((i) => i.nama).join(', ');
      rekomendasiReferensi.push({
        label: `Fokus Perbaikan Skor Rendah (${lowItems.length} Dokumen)`,
        text: `Perlu peningkatan dan tindak lanjut perbaikan pada dokumen yang masih belum optimal (skor ≤ 3), khususnya: ${lowNames}. Disarankan melengkapi komponen instrumen dan bukti fisik pendukung.`,
        badge: 'Rekomendasi Prioritas',
      });
    }

    // Rekomendasi spesifik bila item tertentu memiliki skor rendah
    if (scores[14] && scores[14] <= 3) {
      rekomendasiReferensi.push({
        label: 'Program Remedial & Pengayaan (Item 14)',
        text: 'Disarankan menyusun format dan jadwal pelaksanaan program perbaikan (remedial) serta pengayaan secara lebih terstruktur berbasis analisis hasil asesmen.',
        badge: 'Item 14',
      });
    }

    if (scores[15] && scores[15] <= 3) {
      rekomendasiReferensi.push({
        label: 'Buku Refleksi Pembelajaran (Item 15)',
        text: 'Tingkatkan keteraturan pengisian buku refleksi mengajar berkala guna mengevaluasi efektivitas metode pembelajaran dan respon keterlibatan murid.',
        badge: 'Item 15',
      });
    }

    if (scores[4] && scores[4] <= 3) {
      rekomendasiReferensi.push({
        label: 'Pemanfaatan Asesmen Awal (Item 4)',
        text: 'Perlu melampirkan dokumentasi instrumen asesmen diagnostik/awal dan analisis hasilnya sebagai rujukan diferensiasi konten/proses pada Modul Ajar.',
        badge: 'Item 4',
      });
    }

    rekomendasiReferensi.push(
      {
        label: 'Kolaborasi di Komunitas Belajar (Kombel)',
        text: 'Disarankan mendiskusikan perangkat pembelajaran dan rubrik asesmen bersama rekan sejawat dalam forum Komunitas Belajar (Kombel) sekolah.',
      },
      {
        label: 'Digitalisasi & Cadangan Cloud',
        text: 'Disarankan membuat salinan digital (scan/PDF) dari seluruh perangkat administrasi dan menyimpannya di Google Drive sekolah agar memudahkan pemantauan berkelanjutan.',
      }
    );

    return {
      catatanReferensi,
      rekomendasiReferensi,
      highItems,
      lowItems,
    };
  };

  const { catatanReferensi, rekomendasiReferensi, highItems, lowItems } = generateScoreBasedReferences();

  // Tombol Otomatis: Menyusun draf lengkap Catatan & Rekomendasi berdasarkan seluruh hasil instrumen saat ini
  const handleAutoGenerateFromScore = () => {
    let autoCatatan = '';
    let autoRekomendasi = '';

    if (highItems.length > 0) {
      const topNames = highItems.slice(0, 4).map((i) => i.nama).join(', ');
      autoCatatan = `Kelengkapan administrasi pembelajaran guru mencapai skor ${scoreResult.total}/${scoreResult.max} (${scoreResult.percentage}% - Predikat ${scoreResult.predikat}). Kelebihan utama tampak pada dokumen: ${topNames}, yang telah tersusun sangat rapi, lengkap, dan sesuai ketentuan kurikulum.`;
    } else {
      autoCatatan = `Administrasi pembelajaran telah dinilai dengan capaian skor ${scoreResult.total}/${scoreResult.max} (${scoreResult.percentage}% - Predikat ${scoreResult.predikat}). Beberapa dokumen pokok telah mulai dipersiapkan guru.`;
    }

    if (lowItems.length > 0) {
      const needFixNames = lowItems.map((i) => i.nama).join('; ');
      autoRekomendasi = `Direkomendasikan untuk segera melengkapi dan menyempurnakan dokumen yang masih belum optimal: ${needFixNames}. Guru diharapkan memanfaatkan forum Komunitas Belajar (Kombel) sekolah untuk saling berbagi praktik baik penyusunan administrasi.`;
    } else if (scoreResult.percentage >= 90) {
      autoRekomendasi = `Pertahankan kualitas pengadministrasian yang sangat baik ini dan dapat dijadikan model praktik baik (best practice) bagi rekan guru lainnya di lingkungan sekolah.`;
    } else {
      autoRekomendasi = `Lakukan peninjauan berkala terhadap seluruh dokumen administrasi dan pastikan dokumentasi asesmen formatif-sumatif diarsipkan secara rapi.`;
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

  const handleClearScores = () => {
    setFormData((prev) => ({
      ...prev,
      scores: {},
      catatanItem: {},
      catatanTemuan: '',
      rekomendasi: '',
      tanggapanGuru: '',
      isCompleted: false,
    }));
  };

  const handleSave = () => {
    const updated: Instrument1Admin = {
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
            <p className="text-[11px] text-emerald-100">Instrumen 1 untuk {currentTeacher.namaGuru} tersimpan</p>
          </div>
        </div>
      )}

      {/* Printable Kop Surat */}
      <div className="hidden print:block">
        <KopSurat
          school={school}
          documentTitle="INSTRUMEN 1: TELAAH ADMINISTRASI PERENCANAAN PEMBELAJARAN"
          subTitle={`Tahun Ajaran ${school.tahunAjaran} - Semester ${school.semester}`}
          nomorSurat={`423.7 / ${school.npsn} / INST-ADM / 2024`}
        />
      </div>

      {/* Teacher Selection & Header Info (Print Hidden) */}
      <div className="print:hidden space-y-4">
        <TeacherSelector
          teachers={teachers}
          selectedTeacherId={selectedTeacherId}
          onSelectTeacher={onSelectTeacher}
          label="Pilih Guru untuk Telaah Administrasi:"
        />

        {/* Quick Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Preset Nilai Cepat:</span>
            <button
              onClick={() => handleQuickFill(5)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              Semua 5 (Amat Baik)
            </button>
            <button
              onClick={() => handleQuickFill(4)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              Semua 4 (Baik)
            </button>
            <button
              onClick={() => handleQuickFill(3)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
            >
              Semua 3 (Cukup)
            </button>
            <button
              onClick={handleClearScores}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
              title="Kosongkan seluruh nilai dan mulai penilaian baru"
            >
              Kosongkan Nilai
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
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Cetak Form</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Identity Sheet in Document / Print Layout */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="border-b border-slate-200 pb-3 mb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600 print:hidden" />
            <span>IDENTITAS PEMBELAJARAN GURU TERKAIT</span>
          </h3>
          <p className="text-xs text-slate-500">
            Terisi otomatis dari data master profil guru dan satuan pendidikan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs md:text-sm">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">1. Nama Satuan Pendidikan</span>
            <span className="font-bold text-slate-900">{school.namaSekolah}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">2. Nama Guru yang Ditelaah</span>
            <span className="font-bold text-slate-900">{currentTeacher.namaGuru}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">3. NIP / NUPTK</span>
            <span className="font-mono text-slate-900">{currentTeacher.nip || '-'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">4. Pangkat / Golongan</span>
            <span className="text-slate-900">{currentTeacher.pangkatGolongan}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">5. Mata Pelajaran</span>
            <span className="font-bold text-indigo-700">{currentTeacher.mataPelajaran}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">6. Kelas / Fase</span>
            <span className="text-slate-900">{currentTeacher.kelasFase}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">7. Jumlah Jam Tatap Muka</span>
            <span className="font-bold text-slate-900">{currentTeacher.jamTatapMuka} Jam / Minggu</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="font-semibold text-slate-600">8. Tanggal Telaah Administrasi</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              <input
                type="date"
                value={formData.tanggalTelaah}
                onChange={(e) => setFormData({ ...formData, tanggalTelaah: e.target.value })}
                className="font-medium text-slate-900 bg-transparent border-0 p-0 focus:ring-0 text-xs md:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Real-time Calculation Summary Badge Bar */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-sm ${scoreResult.total > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {scoreResult.grade}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                  Hasil Ketercapaian:
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreResult.badgeColor}`}>
                  {scoreResult.predikat}
                </span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">
                {scoreResult.total > 0
                  ? `Skor Perolehan: ${scoreResult.total} / ${scoreResult.max} (${scoreResult.percentage}%)`
                  : 'Skor Perolehan: Belum Diisi / Nilai Kosong'}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-700">Skala Penilaian:</span>
            <span>1 = Sangat Kurang | 2 = Kurang | 3 = Cukup | 4 = Baik | 5 = Amat Baik</span>
          </div>
        </div>
      </div>

      {/* Evaluation Table: 16 Items */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            Tabel Evaluasi Butir Administrasi Pembelajaran ({INSTRUMEN_1_ITEMS.length} Butir)
          </h3>
          <span className="text-xs font-mono text-slate-500">Maksimum Skor: {scoreResult.max}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 text-center w-10">No</th>
                <th className="py-3 px-4 min-w-[280px]">Komponen & Butir Administrasi</th>
                <th className="py-3 px-3 text-center w-40">
                  Skala Nilai (1 - 5)
                  <span className="block text-[9px] font-normal text-slate-500">1: SK s.d 5: SB</span>
                </th>
                <th className="py-3 px-4 min-w-[220px]">Catatan Pengawas / Rekomendasi Khusus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {INSTRUMEN_1_ITEMS.map((item, idx) => {
                const currentScore = formData.scores[item.id] || 0;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs md:text-sm">{item.nama}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.deskripsi}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleScoreChange(item.id, val)}
                            className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                              currentScore === val
                                ? val >= 4
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : val === 3
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Catatan butir (opsional)..."
                        value={formData.catatanItem[item.id] || ''}
                        onChange={(e) => handleCatatanChange(item.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-400 rounded-md focus:outline-hidden"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 text-xs md:text-sm border-t-2 border-slate-300">
                <td colSpan={2} className="py-3 px-4 text-right">
                  TOTAL JUMLAH SKOR (MAX 120):
                </td>
                <td className="py-3 px-3 text-center text-indigo-700 text-base">
                  {scoreResult.total > 0 ? scoreResult.total : '-'}
                </td>
                <td className="py-3 px-4 text-slate-800">
                  {scoreResult.total > 0 ? (
                    <>Ketercapaian: <span className="text-indigo-700">{scoreResult.percentage}%</span> ({scoreResult.predikat})</>
                  ) : (
                    <span className="text-slate-400 font-normal">Belum ada nilai yang diisi</span>
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
              <span>CATATAN KUALITATIF & REKOMENDASI PENGEMBANGAN</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Referensi saran dan temuan otomatis menyesuaikan dengan rincian skor indikator di atas
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoGenerateFromScore}
            className="print:hidden text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg border border-indigo-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
            title="Susun draf Catatan Temuan & Rekomendasi otomatis mengacu pada skor saat ini"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate Otomatis dari Hasil Nilai</span>
          </button>
        </div>

        <div className="space-y-4 text-xs md:text-sm">
          {/* Bagian A */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <label className="block font-semibold text-slate-800">
                A. Catatan Temuan / Kelebihan Administrasi:
              </label>
              <span className="text-[11px] text-slate-400 print:hidden italic">
                *Teks di bawah bebas diedit atau disesuaikan
              </span>
            </div>

            {/* Referensi Sesuai Hasil Penilaian (Print Hidden) */}
            <div className="print:hidden bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pilih Referensi Temuan (Mengacu Skor Indikator):</span>
                </span>
                {highItems.length > 0 && (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                    {highItems.length} Dokumen Unggul
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
                      item.badge === 'Sesuai Skor Tinggi'
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
              placeholder="Tuliskan temuan positif, kelengkapan, dan kerapian administrasi atau klik referensi di atas yang mengacu pada skor..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed font-normal"
            />
          </div>

          {/* Bagian B */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <label className="block font-semibold text-slate-800">
                B. Rekomendasi Tindak Lanjut / Saran Perbaikan:
              </label>
              <span className="text-[11px] text-slate-400 print:hidden italic">
                *Teks di bawah bebas diedit atau disesuaikan
              </span>
            </div>

            {/* Referensi Rekomendasi Sesuai Hasil Penilaian (Print Hidden) */}
            <div className="print:hidden bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pilih Rekomendasi Tindak Lanjut (Mengacu Skor Indikator):</span>
                </span>
                {lowItems.length > 0 && (
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                    {lowItems.length} Dokumen Perlu Perbaikan (Skor ≤ 3)
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
                      item.badge === 'Rekomendasi Prioritas'
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
              placeholder="Tuliskan saran perbaikan dokumen yang masih belum lengkap atau klik referensi di atas yang mengacu pada skor..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed font-normal"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              C. Tanggapan Guru yang Disupervisi:
            </label>
            <textarea
              rows={3}
              value={formData.tanggapanGuru}
              onChange={(e) => setFormData({ ...formData, tanggapanGuru: e.target.value })}
              placeholder="Tanggapan, komitmen, atau rencana perbaikan dari guru..."
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
            <span>Simpan Instrumen 1</span>
          </button>
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
        onToggleSignature={(role) => {
          if (role === 'pengawas') setFormData((p) => ({ ...p, ttdPengawas: !p.ttdPengawas }));
          if (role === 'kepala') setFormData((p) => ({ ...p, ttdKepalaSekolah: !p.ttdKepalaSekolah }));
          if (role === 'guru') setFormData((p) => ({ ...p, ttdGuru: !p.ttdGuru }));
        }}
      />
    </div>
  );
};
