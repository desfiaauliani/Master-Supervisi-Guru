import React from 'react';
import { SchoolProfile, Teacher } from '../types/supervision';
import { CheckCircle2 } from 'lucide-react';

interface SignatureBlockProps {
  school: SchoolProfile;
  teacher: Teacher;
  tanggalDokumen?: string;
  signedPengawas?: boolean;
  signedKepalaSekolah?: boolean;
  signedGuru?: boolean;
  onToggleSignature?: (role: 'pengawas' | 'kepala' | 'guru') => void;
  isPrintMode?: boolean;
  isBlankPrint?: boolean;
}

export const SignatureBlock: React.FC<SignatureBlockProps> = ({
  school,
  teacher,
  tanggalDokumen,
  signedPengawas = true,
  signedKepalaSekolah = true,
  signedGuru = true,
  onToggleSignature,
  isPrintMode = false,
  isBlankPrint = false,
}) => {
  const displayDate = isBlankPrint
    ? '........................, .................... 202...'
    : tanggalDokumen
    ? new Date(tanggalDokumen).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  return (
    <div className="w-full mt-8 pt-6 border-t-2 border-slate-300 print:border-slate-800 text-slate-800 break-inside-avoid">
      <div className="text-right text-sm md:text-base mb-4 font-semibold text-slate-800">
        <span>{school.kotaKabupaten.replace('Kota ', '').replace('Kabupaten ', '')}, {displayDate}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm md:text-base">
        {/* Kolom 1: Supervisor / Pengawas Pendamping */}
        <div className="flex flex-col justify-between items-center h-48 p-3 rounded-lg border border-transparent print:border-0 hover:border-slate-200 transition-colors">
          <div>
            <p className="font-semibold text-slate-800">Supervisor /</p>
            <p className="font-bold text-slate-900">Pengawas Pendamping</p>
          </div>

          <div className="my-auto flex flex-col items-center">
            {isBlankPrint ? (
              <div className="h-16 flex items-center justify-center">
                {/* Blank space for wet ink signature */}
              </div>
            ) : signedPengawas ? (
              <div
                onClick={() => onToggleSignature && onToggleSignature('pengawas')}
                className={`flex flex-col items-center cursor-pointer select-none group ${isPrintMode ? '' : 'hover:opacity-80'}`}
                title="Tanda Tangan Digital Pengawas"
              >
                <div className="w-28 h-12 border-2 border-indigo-500 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-700 text-xs font-mono tracking-tighter">
                  <div className="text-center">
                    <CheckCircle2 className="w-4 h-4 mx-auto text-indigo-600 mb-0.5" />
                    <span className="font-bold">TERVERIFIKASI</span>
                  </div>
                </div>
                <span className="text-xs text-indigo-700 font-mono mt-0.5 font-medium">Digital Signature</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onToggleSignature && onToggleSignature('pengawas')}
                className="text-xs px-2 py-1 border border-dashed border-slate-400 text-slate-500 rounded hover:bg-slate-50 print:hidden"
              >
                [Klik TTD]
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="font-bold text-slate-900 underline decoration-1 underline-offset-2">
              {school.namaPengawas}
            </p>
            <p className="text-xs text-slate-700 font-medium">NIP. {school.nipPengawas}</p>
            <p className="text-xs text-slate-600">{school.pangkatGolPengawas}</p>
          </div>
        </div>

        {/* Kolom 2: Kepala Sekolah */}
        <div className="flex flex-col justify-between items-center h-48 p-3 rounded-lg border border-transparent print:border-0 hover:border-slate-200 transition-colors">
          <div>
            <p className="font-semibold text-slate-800">Mengetahui,</p>
            <p className="font-bold text-slate-900">Kepala {school.namaSekolah}</p>
          </div>

          <div className="my-auto flex flex-col items-center">
            {isBlankPrint ? (
              <div className="h-16 flex items-center justify-center">
                {/* Blank space for wet ink signature */}
              </div>
            ) : signedKepalaSekolah ? (
              <div
                onClick={() => onToggleSignature && onToggleSignature('kepala')}
                className={`flex flex-col items-center cursor-pointer select-none group ${isPrintMode ? '' : 'hover:opacity-80'}`}
                title="Tanda Tangan Digital Kepala Sekolah"
              >
                <div className="w-28 h-12 border-2 border-blue-500 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 text-xs font-mono tracking-tighter">
                  <div className="text-center">
                    <CheckCircle2 className="w-4 h-4 mx-auto text-blue-600 mb-0.5" />
                    <span className="font-bold">TERVERIFIKASI</span>
                  </div>
                </div>
                <span className="text-xs text-blue-700 font-mono mt-0.5 font-medium">Digital Signature</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onToggleSignature && onToggleSignature('kepala')}
                className="text-xs px-2 py-1 border border-dashed border-slate-400 text-slate-500 rounded hover:bg-slate-50 print:hidden"
              >
                [Klik TTD]
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="font-bold text-slate-900 underline decoration-1 underline-offset-2">
              {school.namaKepalaSekolah}
            </p>
            <p className="text-xs text-slate-700 font-medium">NIP. {school.nipKepalaSekolah}</p>
            <p className="text-xs text-slate-600">{school.pangkatGolKepalaSekolah}</p>
          </div>
        </div>

        {/* Kolom 3: Guru yang Disupervisi */}
        <div className="flex flex-col justify-between items-center h-48 p-3 rounded-lg border border-transparent print:border-0 hover:border-slate-200 transition-colors">
          <div>
            <p className="font-semibold text-slate-800">Guru yang Disupervisi,</p>
            <p className="text-xs text-slate-600 font-medium">Mata Pelajaran: {teacher.mataPelajaran}</p>
          </div>

          <div className="my-auto flex flex-col items-center">
            {isBlankPrint ? (
              <div className="h-16 flex items-center justify-center">
                {/* Blank space for wet ink signature */}
              </div>
            ) : signedGuru ? (
              <div
                onClick={() => onToggleSignature && onToggleSignature('guru')}
                className={`flex flex-col items-center cursor-pointer select-none group ${isPrintMode ? '' : 'hover:opacity-80'}`}
                title="Tanda Tangan Digital Terverifikasi"
              >
                <div className="w-28 h-12 border-2 border-emerald-500 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700 text-xs font-mono tracking-tighter">
                  <div className="text-center">
                    <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-600 mb-0.5" />
                    <span className="font-bold">TERVERIFIKASI</span>
                  </div>
                </div>
                <span className="text-xs text-emerald-700 font-mono mt-0.5 font-medium">Digital Signature</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onToggleSignature && onToggleSignature('guru')}
                className="text-xs px-2 py-1 border border-dashed border-slate-400 text-slate-500 rounded hover:bg-slate-50 print:hidden"
              >
                [Klik TTD]
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="font-bold text-slate-900 underline decoration-1 underline-offset-2">
              {teacher.namaGuru}
            </p>
            <p className="text-xs text-slate-700 font-medium">NIP/NUPTK. {teacher.nip || '-'}</p>
            <p className="text-xs text-slate-600">{teacher.pangkatGolongan}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
