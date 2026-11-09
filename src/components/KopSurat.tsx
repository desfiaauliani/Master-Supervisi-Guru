import React from 'react';
import { SchoolProfile } from '../types/supervision';

interface KopSuratProps {
  school: SchoolProfile;
  documentTitle?: string;
  subTitle?: string;
  nomorSurat?: string;
}

export const KopSurat: React.FC<KopSuratProps> = ({
  school,
  documentTitle,
  subTitle,
  nomorSurat,
}) => {
  return (
    <div className="w-full text-slate-900 border-b-4 border-double border-slate-900 pb-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left Official Garuda / Logo Badge */}
        <div className="w-20 h-20 shrink-0 flex items-center justify-center border-2 border-slate-800 rounded-xl bg-slate-50 p-1 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl">🏛️</span>
            <span className="text-[9px] font-bold tracking-tighter uppercase text-slate-700 mt-0.5">Tut Wuri</span>
          </div>
        </div>

        {/* Center Header Details */}
        <div className="flex-1 text-center space-y-0.5">
          <p className="text-xs uppercase font-semibold tracking-wider text-slate-700">
            {school.dinasPendidikan || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
          </p>
          <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-slate-950">
            {school.namaSekolah}
          </h1>
          <p className="text-xs font-medium text-slate-600">
            NPSN: <span className="font-semibold text-slate-800">{school.npsn}</span> | {school.alamatSekolah}, {school.kelurahanKecamatan}
          </p>
          <p className="text-[11px] text-slate-500">
            {school.kotaKabupaten}, {school.provinsi} | Telp/Email: {school.teleponEmail} | Web: {school.website}
          </p>
        </div>

        {/* Right Academic Year Stamp / Badge */}
        <div className="w-20 h-20 shrink-0 flex items-center justify-center border-2 border-slate-800 rounded-xl bg-slate-50 p-1 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl">🎓</span>
            <span className="text-[8px] font-bold text-slate-700 leading-tight">SUPERVISI AKADEMIK</span>
          </div>
        </div>
      </div>

      {documentTitle && (
        <div className="mt-5 pt-3 border-t border-slate-300 text-center">
          <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-slate-900 underline decoration-2 underline-offset-4">
            {documentTitle}
          </h2>
          {subTitle && (
            <p className="text-xs font-medium text-slate-700 mt-1">{subTitle}</p>
          )}
          {nomorSurat && (
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">Nomor: {nomorSurat}</p>
          )}
        </div>
      )}
    </div>
  );
};
