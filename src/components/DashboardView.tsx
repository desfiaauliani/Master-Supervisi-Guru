import React, { useState, useMemo } from 'react';
import {
  AppSupervisionData,
  calculateInstrumen1Score,
  calculateInstrumen2Score,
  calculateInstrumen3Score,
  calculateCompositeGrade,
  Teacher,
} from '../types/supervision';
import {
  Users,
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Edit3,
  Printer,
  Award,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { KopSurat } from './KopSurat';
import { SignatureBlock } from './SignatureBlock';

interface DashboardViewProps {
  data: AppSupervisionData;
  onNavigateToInstrument: (instrumentTab: 'instrumen-1' | 'instrumen-2' | 'instrumen-3' | 'instrumen-4', teacherId: string) => void;
  onNavigateToMasterData: () => void;
  onExportCSV: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onNavigateToInstrument,
  onNavigateToMasterData,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { school, teachers, instrumen1, instrumen2, instrumen3, instrumen4 } = data;

  // Subjects list for filter dropdown
  const uniqueSubjects = useMemo(() => {
    const set = new Set(teachers.map((t) => t.mataPelajaran));
    return Array.from(set);
  }, [teachers]);

  // Analytics Calculations
  const stats = useMemo(() => {
    const totalTeachers = teachers.length;
    const completedTeachers = teachers.filter((t) => t.status === 'Selesai').length;
    const needsFollowUp = teachers.filter((t) => t.status === 'Perlu Tindak Lanjut').length;
    const inProgress = teachers.filter((t) => t.status === 'Proses').length;
    const notStarted = teachers.filter((t) => t.status === 'Belum Disupervisi').length;
    const completionRate = totalTeachers > 0 ? Math.round((completedTeachers / totalTeachers) * 100) : 0;

    // Calculate averages for each instrument
    const scoresInst1: number[] = [];
    const scoresInst2: number[] = [];
    const scoresInst3: number[] = [];

    teachers.forEach((t) => {
      const i1 = instrumen1[t.id];
      if (i1 && i1.isCompleted) {
        const sc = calculateInstrumen1Score(i1.scores);
        if (sc.total > 0) scoresInst1.push(sc.percentage);
      }

      const i2 = instrumen2[t.id];
      if (i2 && i2.isCompleted) {
        const sc = calculateInstrumen2Score(i2.items);
        if (sc.totalYa > 0) scoresInst2.push(sc.percentage);
      }

      const i3 = instrumen3[t.id];
      if (i3 && i3.isCompleted) {
        const sc = calculateInstrumen3Score(i3.scores);
        if (sc.total > 0) scoresInst3.push(sc.percentage);
      }
    });

    const avgInst1 = scoresInst1.length > 0 ? Number((scoresInst1.reduce((a, b) => a + b, 0) / scoresInst1.length).toFixed(1)) : 0;
    const avgInst2 = scoresInst2.length > 0 ? Number((scoresInst2.reduce((a, b) => a + b, 0) / scoresInst2.length).toFixed(1)) : 0;
    const avgInst3 = scoresInst3.length > 0 ? Number((scoresInst3.reduce((a, b) => a + b, 0) / scoresInst3.length).toFixed(1)) : 0;

    const validAvgs = [avgInst1, avgInst2, avgInst3].filter((s) => s > 0);
    const overallAverage = validAvgs.length > 0 ? Number((validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length).toFixed(1)) : 0;

    return {
      totalTeachers,
      completedTeachers,
      needsFollowUp,
      inProgress,
      notStarted,
      completionRate,
      avgInst1,
      avgInst2,
      avgInst3,
      overallAverage,
    };
  }, [teachers, instrumen1, instrumen2, instrumen3]);

  // Filtered Teacher List
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchSearch =
        t.namaGuru.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSubject = subjectFilter === 'ALL' || t.mataPelajaran === subjectFilter;
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;

      return matchSearch && matchSubject && matchStatus;
    });
  }, [teachers, searchTerm, subjectFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Printable Official Kop Surat (Only visible in Print) */}
      <div className="hidden print:block">
        <KopSurat
          school={school}
          documentTitle="REKAPITULASI HASIL SUPERVISI AKADEMIK GURU"
          subTitle={`Tahun Ajaran ${school.tahunAjaran} - Semester ${school.semester}`}
          nomorSurat={`421.3 / ${school.npsn} / SUP-AKD / 2024`}
        />
      </div>

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden print:hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sistem Penjaminan Mutu & Supervisi Pembelajaran</span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            Pusat Analisis & Rekapitulasi Supervisi Akademik
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Selamat datang di portal supervisi akademik <span className="text-white font-semibold">{school.namaSekolah}</span>. 
            Pantau keterlaksanaan telaah administrasi, modul ajar mendalam, observasi di kelas, serta pembinaan rencana tindak lanjut secara terintegrasi.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToInstrument('instrumen-1', teachers[0]?.id || '')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs md:text-sm font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Mulai Entri Supervisi</span>
            </button>
            <button
              onClick={onExportCSV}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Unduh Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Cetak Rekap Resmi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 print:grid-cols-5 print:gap-2">
        {/* Card 1: Total Guru */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Guru</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.totalTeachers}</span>
            <span className="text-xs text-slate-500">Orang</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{stats.completedTeachers} selesai ({stats.completionRate}%)</span>
          </div>
        </div>

        {/* Card 2: Rata-rata Administrasi */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Administrasi</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
              Inst. 1
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-700">{stats.avgInst1}%</span>
            <span className="text-xs text-slate-500">Rerata</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.avgInst1)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Rata-rata Modul Ajar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Modul Ajar</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
              Inst. 2
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">{stats.avgInst2}%</span>
            <span className="text-xs text-slate-500">Rerata</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.avgInst2)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 4: Rata-rata Observasi */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Observasi Kelas</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">
              Inst. 3
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-700">{stats.avgInst3}%</span>
            <span className="text-xs text-slate-500">Rerata</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.avgInst3)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 5: Ketercapaian Mutu */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Indeks Mutu</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">
              {stats.overallAverage > 0 ? `${stats.overallAverage}%` : '-'}
            </span>
            {stats.overallAverage > 0 ? (
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {stats.overallAverage >= 90 ? 'A (Sangat Baik)' : stats.overallAverage >= 80 ? 'B (Baik)' : 'C (Cukup)'}
              </span>
            ) : (
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                Belum Dinilai
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            <span>Standar Kurikulum Merdeka</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs print:hidden">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama guru, NIP, atau mata pelajaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Mata Pelajaran</option>
              {uniqueSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Proses">Dalam Proses</option>
              <option value="Perlu Tindak Lanjut">Perlu Tindak Lanjut</option>
              <option value="Belum Disupervisi">Belum Disupervisi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master Recap Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base">
              Rekapitulasi Hasil Supervisi Akademik Seluruh Guru
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredTeachers.length} dari {teachers.length} guru terdaftar
            </p>
          </div>
          <button
            onClick={onNavigateToMasterData}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 print:hidden"
          >
            <span>Kelola Guru</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 text-center w-10">No</th>
                <th className="py-3 px-4 min-w-[200px]">Identitas Guru</th>
                <th className="py-3 px-3 min-w-[140px]">Mapel & Kelas</th>
                <th className="py-3 px-3 text-center min-w-[90px]">
                  Inst. 1
                  <span className="block text-[9px] font-normal text-slate-500">Administrasi</span>
                </th>
                <th className="py-3 px-3 text-center min-w-[90px]">
                  Inst. 2
                  <span className="block text-[9px] font-normal text-slate-500">Modul Ajar</span>
                </th>
                <th className="py-3 px-3 text-center min-w-[90px]">
                  Inst. 3
                  <span className="block text-[9px] font-normal text-slate-500">Observasi</span>
                </th>
                <th className="py-3 px-3 text-center min-w-[90px]">
                  Inst. 4
                  <span className="block text-[9px] font-normal text-slate-500">Pasca & RTL</span>
                </th>
                <th className="py-3 px-3 text-center min-w-[100px]">
                  Nilai Akhir
                  <span className="block text-[9px] font-normal text-slate-500">Komposit</span>
                </th>
                <th className="py-3 px-3 text-center min-w-[110px]">Status</th>
                <th className="py-3 px-4 text-center min-w-[120px] print:hidden">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data guru yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, index) => {
                  const inst1 = instrumen1[teacher.id];
                  const inst2 = instrumen2[teacher.id];
                  const inst3 = instrumen3[teacher.id];
                  const inst4 = instrumen4[teacher.id];

                  const score1 = inst1 ? calculateInstrumen1Score(inst1.scores) : null;
                  const score2 = inst2 ? calculateInstrumen2Score(inst2.items) : null;
                  const score3 = inst3 ? calculateInstrumen3Score(inst3.scores) : null;

                  const p1 = score1 ? score1.percentage : 0;
                  const p2 = score2 ? score2.percentage : 0;
                  const p3 = score3 ? score3.percentage : 0;

                  const composite = calculateCompositeGrade(p1, p2, p3, !!inst4?.isCompleted);

                  const rtlCount = inst4 ? inst4.rencanaTindakLanjut?.length || 0 : 0;

                  // Status badge styling
                  let statusBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (teacher.status === 'Selesai') {
                    statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                  } else if (teacher.status === 'Perlu Tindak Lanjut') {
                    statusBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
                  } else if (teacher.status === 'Proses') {
                    statusBadgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
                  }

                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-center font-medium text-slate-500">{index + 1}</td>

                      {/* Identitas Guru */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{teacher.namaGuru}</div>
                        <div className="text-[11px] font-mono text-slate-500">NIP. {teacher.nip || '-'}</div>
                        <div className="text-[10px] text-slate-500">{teacher.pangkatGolongan}</div>
                      </td>

                      {/* Mapel & Kelas */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{teacher.mataPelajaran}</div>
                        <div className="text-[11px] text-slate-500">{teacher.kelasFase}</div>
                        <div className="text-[10px] text-slate-500">{teacher.jamTatapMuka} JTM</div>
                      </td>

                      {/* Instrumen 1 */}
                      <td className="py-3 px-3 text-center">
                        {score1 && score1.total > 0 ? (
                          <div>
                            <span className="font-bold text-slate-900 text-xs">{score1.percentage}%</span>
                            <span className={`block text-[10px] font-semibold px-1 py-0.2 rounded border mx-auto w-fit mt-0.5 ${score1.badgeColor}`}>
                              {score1.predikat}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>

                      {/* Instrumen 2 */}
                      <td className="py-3 px-3 text-center">
                        {score2 && score2.totalYa > 0 ? (
                          <div>
                            <span className="font-bold text-slate-900 text-xs">{score2.percentage}%</span>
                            <span className={`block text-[10px] font-semibold px-1 py-0.2 rounded border mx-auto w-fit mt-0.5 ${score2.badgeColor}`}>
                              {score2.totalYa}/20 Ya
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>

                      {/* Instrumen 3 */}
                      <td className="py-3 px-3 text-center">
                        {score3 && score3.total > 0 ? (
                          <div>
                            <span className="font-bold text-slate-900 text-xs">{score3.percentage}%</span>
                            <span className={`block text-[10px] font-semibold px-1 py-0.2 rounded border mx-auto w-fit mt-0.5 ${score3.badgeColor}`}>
                              {score3.predikat}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>

                      {/* Instrumen 4 */}
                      <td className="py-3 px-3 text-center">
                        {inst4 && inst4.isCompleted ? (
                          <div>
                            <span className="text-emerald-700 font-semibold text-xs flex items-center justify-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Lengkap
                            </span>
                            <span className="text-[10px] text-slate-500 block">{rtlCount} RTL Disepakati</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">Belum</span>
                        )}
                      </td>

                      {/* Nilai Akhir Komposit */}
                      <td className="py-3 px-3 text-center">
                        {composite.averagePercentage > 0 ? (
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-sm font-extrabold text-slate-900">
                                {composite.averagePercentage}%
                              </span>
                              <span className="text-xs font-bold text-indigo-700">
                                ({composite.grade})
                              </span>
                            </div>
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border mt-0.5 ${composite.badgeClass}`}>
                              {composite.predikat.split(' ')[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeClass}`}>
                          {teacher.status}
                        </span>
                      </td>

                      {/* Aksi Cepat */}
                      <td className="py-3 px-4 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onNavigateToInstrument('instrumen-1', teacher.id)}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                            title="Buka Instrumen Telaah Administrasi"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onNavigateToInstrument('instrumen-3', teacher.id)}
                            className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                            title="Buka Observasi Kelas"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onNavigateToInstrument('instrumen-4', teacher.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Buka Pasca Observasi & RTL"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Notes for Print & System */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-700">Keterangan Skala Nilai:</span>{' '}
            <span className="font-medium text-emerald-700">Sangat Baik (A): &ge; 90%</span> |{' '}
            <span className="font-medium text-blue-700">Baik (B): 80 - 89.9%</span> |{' '}
            <span className="font-medium text-amber-700">Cukup (C): 70 - 79.9%</span> |{' '}
            <span className="font-medium text-rose-700">Kurang (D): &lt; 70%</span>
          </div>
          <div className="text-slate-400">
            Dicetak melalui Sistem SupervisiDigital Master
          </div>
        </div>
      </div>

      {/* Official Signatures at bottom of printed recap */}
      <div className="hidden print:block">
        <SignatureBlock
          school={school}
          teacher={teachers[0] || {
            id: 'mock',
            namaGuru: 'Koordinator MGMP / Perwakilan Guru',
            nip: '19750101 200003 1 002',
            pangkatGolongan: 'Pembina, IV/a',
            mataPelajaran: 'Koordinator Pembelajaran',
            kelasFase: 'Fase E & F',
            jamTatapMuka: 24,
            tanggalSupervisi: '',
            status: 'Selesai',
          }}
          isPrintMode={true}
        />
      </div>
    </div>
  );
};
