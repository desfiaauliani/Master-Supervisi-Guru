import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  BookMarked,
  School,
  MessageSquareQuote,
  Settings,
  ShieldCheck,
  ChevronRight,
  Printer,
  Sparkles,
} from 'lucide-react';
import { SchoolProfile, Teacher } from '../types/supervision';

export type NavigationTab =
  | 'dashboard'
  | 'master-data'
  | 'instrumen-1'
  | 'instrumen-2'
  | 'instrumen-3'
  | 'instrumen-4'
  | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  school: SchoolProfile;
  teachers: Teacher[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  school,
  teachers,
  isOpenMobile,
  onCloseMobile,
}) => {
  const completedTeachers = teachers.filter((t) => t.status === 'Selesai').length;

  const navItems = [
    {
      id: 'master-data' as NavigationTab,
      label: 'Identitas & Data Master',
      sublabel: 'Profil Sekolah, Pengawas & Guru',
      icon: Users,
      badge: `${teachers.length} Guru`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'instrumen-1' as NavigationTab,
      label: 'Instrumen 1: Administrasi',
      sublabel: '24 Butir Telaah Administrasi',
      icon: FileCheck2,
      badge: '24 Item',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'instrumen-2' as NavigationTab,
      label: 'Instrumen 2: Modul Ajar',
      sublabel: '20 Indikator RPM / Modul Ajar',
      icon: BookMarked,
      badge: '20 Indikator',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'instrumen-3' as NavigationTab,
      label: 'Instrumen 3: Observasi Kelas',
      sublabel: 'Pelaksanaan & Deep Learning',
      icon: School,
      badge: 'Skor 1-4',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'instrumen-4' as NavigationTab,
      label: 'Instrumen 4: Pasca Observasi',
      sublabel: 'Refleksi Guru, Feedback & RTL',
      icon: MessageSquareQuote,
      badge: '5 Aspek RTL',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'dashboard' as NavigationTab,
      label: 'Rekapitulasi & Analisis',
      sublabel: 'Laporan Rekapitulasi Terpadu',
      icon: LayoutDashboard,
      badge: `${completedTeachers}/${teachers.length}`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Pengaturan & Backup Data',
      sublabel: 'Import/Export JSON & Kop Surat',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out print:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  SupervisiDigital
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                  Master
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[160px]" title={school.namaSekolah}>
                {school.namaSekolah}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              TA {school.tahunAjaran}
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">
              Sem. {school.semester}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Supervisi
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold truncate leading-tight">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[10px] truncate mt-0.5 ${
                      isActive ? 'text-indigo-100' : 'text-slate-400'
                    }`}
                  >
                    {item.sublabel}
                  </p>
                </div>

                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Supervision Officer Mini Card */}
        <div className="p-3 m-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Petugas Supervisi</span>
          </div>
          <div className="text-[11px] space-y-1 text-slate-400">
            <p className="truncate">
              <span className="text-slate-500 font-medium">Pengawas:</span>{' '}
              <span className="text-slate-200 font-medium">{school.namaPengawas}</span>
            </p>
            <p className="truncate">
              <span className="text-slate-500 font-medium">Kepsek:</span>{' '}
              <span className="text-slate-200 font-medium">{school.namaKepalaSekolah}</span>
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="w-full mt-3 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Halaman Ini</span>
          </button>
        </div>
      </aside>
    </>
  );
};
