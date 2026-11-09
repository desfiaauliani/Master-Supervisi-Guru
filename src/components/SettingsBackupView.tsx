import React, { useRef, useState } from 'react';
import { AppSupervisionData } from '../types/supervision';
import { exportBackupJSON, exportRecapToCSV } from '../utils/storage';
import {
  Download,
  Upload,
  RotateCcw,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Database,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface SettingsBackupViewProps {
  data: AppSupervisionData;
  onImportData: (importedData: AppSupervisionData) => void;
  onResetData: () => void;
}

export const SettingsBackupView: React.FC<SettingsBackupViewProps> = ({
  data,
  onImportData,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleExportJSON = () => {
    exportBackupJSON(data);
  };

  const handleExportCSV = () => {
    exportRecapToCSV(data);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as AppSupervisionData;

        // Basic structural validation
        if (!parsed.school || !parsed.teachers || !parsed.instrumen1) {
          throw new Error('Format file JSON supervisi tidak valid');
        }

        if (confirm('Import data akan menimpa data yang sedang aktif di aplikasi. Lanjutkan?')) {
          onImportData(parsed);
          setImportStatus('Data berhasil diimport dan disinkronkan!');
          setTimeout(() => setImportStatus(null), 4000);
        }
      } catch (err: any) {
        alert(`Gagal mengimpor file backup: ${err.message || 'File JSON rusak'}`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (
      confirm(
        'PERINGATAN: Seluruh data saat ini akan dikembalikan ke data percontohan awal (1 Guru Contoh). Tindakan ini tidak dapat dibatalkan jika belum dibackup. Lanjutkan?'
      )
    ) {
      onResetData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base md:text-lg">
              Manajemen Penyimpanan & Backup Data
            </h3>
            <p className="text-xs text-slate-500">
              Amankan arsip data supervisi, lakukan ekspor berkas, atau pulihkan data dari file cadangan lokal
            </p>
          </div>
        </div>

        {importStatus && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{importStatus}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span>Data aplikasi berhasil direset ke data contoh standar!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Card 1: JSON Backup Export */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Unduh Cadangan Lengkap (JSON Backup)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mengekspor seluruh identitas sekolah, daftar guru, skor 4 instrumen, catatan kualitatif, dan lembar rencana tindak lanjut ke dalam 1 berkas JSON terenkripsi aman di perangkat Anda.
              </p>
            </div>

            <button
              onClick={handleExportJSON}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Backup (.json)</span>
            </button>
          </div>

          {/* Card 2: JSON Backup Import */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Pulihkan Data dari Berkas (.JSON)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Muat kembali data supervisi yang sebelumnya telah Anda unduh. Seluruh rekapitulasi, nilai telaah, dan data guru akan dipulihkan secara instan.
              </p>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="upload-json-input"
              />
              <label
                htmlFor="upload-json-input"
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Pilih Berkas Backup (.json)</span>
              </label>
            </div>
          </div>

          {/* Card 3: Export XLSX Recap */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Ekspor Tabel Rekapitulasi (Excel .xlsx)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mengekstrak data ringkasan nilai Instrumen 1, 2, 3, dan status RTL setiap guru ke dalam format workbook Microsoft Excel (.xlsx) dengan kolom rapi dan kop rekapitulasi resmi.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Unduh Dokumen Excel (.xlsx)</span>
            </button>
          </div>

          {/* Card 4: Reset Demo Data */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Reset ke Data Simulasi Standar</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mengembalikan basis data aplikasi ke contoh 1 profil guru lengkap (SMA Negeri 1 Teladan) dengan skor komposit dan catatan coaching realistis.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-semibold text-xs rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Reset Data ke Contoh Standar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printing & Layout Guidelines */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 font-bold text-slate-900 text-sm md:text-base">
          <Printer className="w-4 h-4 text-indigo-600" />
          <span>Petunjuk Cetak Dokumen Resmi & Ekspor PDF</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
            <span className="font-bold text-slate-900 block mb-1">1. Format Kertas</span>
            <p>
              Pilih ukuran kertas <strong>A4 (210 x 297 mm)</strong> dengan orientasi <strong>Portrait</strong> untuk seluruh lembar instrumen atau <strong>Landscape</strong> untuk rekapitulasi tabel besar.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
            <span className="font-bold text-slate-900 block mb-1">2. Opsi Margin & Header</span>
            <p>
              Pada dialog printer browser (Ctrl + P), atur <strong>Margin: Default / Minimal</strong> dan hilangkan centang <em>&apos;Header and Footer&apos;</em> bawaan browser agar kop surat sekolah tampil murni.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
            <span className="font-bold text-slate-900 block mb-1">3. Simpan sebagai PDF</span>
            <p>
              Pilih opsi tujuan printer <strong>&apos;Save as PDF&apos;</strong> untuk menghasilkan berkas digital resmi siap kirim ke Dinas Pendidikan atau arsip akreditasi sekolah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
