import React from 'react';
import {
  Printer,
  FileCheck2,
  FileText,
  X,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  teacherName?: string;
  onPrintFilled: () => void;
  onPrintBlank: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  teacherName,
  onPrintFilled,
  onPrintBlank,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs print:hidden animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden transition-all">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-700 to-indigo-850 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Printer className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Cetak Form & Simpan PDF</h3>
              <p className="text-xs text-indigo-200 mt-0.5">Pilih format pencetakan sesuai kebutuhan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
            <span className="font-semibold text-slate-900">Dokumen:</span> {documentTitle}
            {teacherName && (
              <span className="block mt-0.5 text-slate-600">
                <span className="font-semibold text-slate-900">Guru Sasaran:</span> {teacherName}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {/* Option 1: Cetak Dokumen Terisi */}
            <div
              onClick={onPrintFilled}
              className="group p-4 rounded-xl border-2 border-indigo-200 hover:border-indigo-600 bg-indigo-50/40 hover:bg-indigo-50 cursor-pointer transition-all shadow-2xs hover:shadow-md flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700">
                    1. Cetak Dokumen Terisi (PDF)
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Data Lengkap
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Mencetak formulir lengkap beserta seluruh nilai, catatan pengamatan supervisor, rekomendasi, dan verifikasi tanda tangan digital.
                </p>
                <div className="mt-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 group-hover:underline">
                    <Printer className="w-3.5 h-3.5" />
                    Buka Cetak Terisi
                  </span>
                </div>
              </div>
            </div>

            {/* Option 2: Cetak Form Kosong / Blangko */}
            <div
              onClick={onPrintBlank}
              className="group p-4 rounded-xl border-2 border-slate-200 hover:border-sky-500 bg-white hover:bg-sky-50/50 cursor-pointer transition-all shadow-2xs hover:shadow-md flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-sky-700">
                    2. Cetak Form Kosong / Blangko (PDF)
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                    Blangko Observasi
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Mencetak blangko instrumen kosong dengan kop resmi, kotak skor kosong untuk penilaian manual pena/pensil, dan garis catatan berbaris rapi.
                </p>
                <div className="mt-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 group-hover:underline">
                    <Printer className="w-3.5 h-3.5" />
                    Buka Cetak Blangko Kosong
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Tip Banner */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Tips Simpan Berkas PDF:</span> Pada jendela cetak browser yang muncul, ganti pilihan <span className="font-semibold underline">Destination / Tujuan</span> menjadi <span className="font-semibold underline">&quot;Save as PDF&quot; (Simpan sebagai PDF)</span>.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
