import React from 'react';
import { Menu, Printer, Download, Sparkles, School } from 'lucide-react';
import { SchoolProfile } from '../types/supervision';

interface HeaderProps {
  title: string;
  subtitle: string;
  school: SchoolProfile;
  onOpenMobileMenu: () => void;
  onExportCSV?: () => void;
  onPrint?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  school,
  onOpenMobileMenu,
  onExportCSV,
  onPrint,
  rightAction,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-6 py-3.5 print:hidden">
      <div className="flex items-center justify-between gap-4">
        {/* Left Title & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                <School className="w-3 h-3 text-slate-500" />
                {school.namaSekolah}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{subtitle}</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {rightAction}

          {onExportCSV && (
            <button
              onClick={onExportCSV}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-semibold shadow-2xs hover:shadow-xs transition-all"
              title="Unduh Rekapitulasi Format Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export XLSX</span>
            </button>
          )}

          {onPrint && (
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-indigo-500/20 transition-all"
              title="Cetak Dokumen Resmi A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Cetak Dokumen</span>
              <span className="xs:hidden">Cetak</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-slate-200 text-xs font-medium text-slate-600">
            <span className="px-2 py-1 rounded bg-slate-100 text-[11px] font-mono text-slate-700">
              {school.tahunAjaran} ({school.semester})
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
