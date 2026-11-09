import React from 'react';
import { Teacher } from '../types/supervision';
import { UserCheck, ChevronDown, BookOpen, GraduationCap } from 'lucide-react';

interface TeacherSelectorProps {
  teachers: Teacher[];
  selectedTeacherId: string;
  onSelectTeacher: (id: string) => void;
  label?: string;
  className?: string;
}

export const TeacherSelector: React.FC<TeacherSelectorProps> = ({
  teachers,
  selectedTeacherId,
  onSelectTeacher,
  label = 'Pilih Guru yang Disupervisi:',
  className = '',
}) => {
  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-3 shadow-xs ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {label}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                {currentTeacher ? currentTeacher.namaGuru : 'Belum Memilih Guru'}
              </span>
              {currentTeacher && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-800">
                  {currentTeacher.mataPelajaran}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative min-w-[240px]">
          <select
            value={selectedTeacherId}
            onChange={(e) => onSelectTeacher(e.target.value)}
            className="w-full appearance-none bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs md:text-sm font-medium border border-slate-300 rounded-lg py-2 pl-3 pr-8 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.namaGuru} ({t.mataPelajaran} - {t.kelasFase})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {currentTeacher && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
          <div>
            <span className="text-slate-400 block">NIP/NUPTK:</span>
            <span className="font-mono font-medium text-slate-800">{currentTeacher.nip || '-'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Pangkat / Gol:</span>
            <span className="font-medium text-slate-800">{currentTeacher.pangkatGolongan}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Kelas / Fase:</span>
            <span className="font-medium text-slate-800 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-slate-500" />
              {currentTeacher.kelasFase}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Beban Mengajar:</span>
            <span className="font-medium text-slate-800 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-500" />
              {currentTeacher.jamTatapMuka} Jam Tatap Muka
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
