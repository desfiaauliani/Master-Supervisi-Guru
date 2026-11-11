import React, { useState, useEffect } from 'react';
import {
  AppSupervisionData,
  Teacher,
  SchoolProfile,
  Instrument1Admin,
  Instrument2ModulAjar,
  Instrument3Observasi,
  Instrument4PascaObservasi,
} from './types/supervision';
import {
  loadSupervisionData,
  saveSupervisionData,
  getInitialSupervisionData,
  exportRecapToCSV,
} from './utils/storage';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MasterDataView } from './components/MasterDataView';
import { Instrument1View } from './components/Instrument1View';
import { Instrument2View } from './components/Instrument2View';
import { Instrument3View } from './components/Instrument3View';
import { Instrument4View } from './components/Instrument4View';
import { SettingsBackupView } from './components/SettingsBackupView';

export default function App() {
  const [data, setData] = useState<AppSupervisionData>(() => loadSupervisionData());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('master-data');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(() => {
    const loaded = loadSupervisionData();
    return loaded.teachers[0]?.id || '';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync state to local storage whenever data changes
  useEffect(() => {
    saveSupervisionData(data);
  }, [data]);

  // Keep selected teacher valid
  useEffect(() => {
    if (data.teachers.length > 0) {
      const exists = data.teachers.some((t) => t.id === selectedTeacherId);
      if (!exists) {
        setSelectedTeacherId(data.teachers[0].id);
      }
    }
  }, [data.teachers, selectedTeacherId]);

  // Handlers for School Profile
  const handleUpdateSchool = (newSchool: SchoolProfile) => {
    setData((prev) => ({
      ...prev,
      school: newSchool,
    }));
  };

  // Handlers for Teachers
  const handleAddTeacher = (newTeacher: Teacher) => {
    setData((prev) => ({
      ...prev,
      teachers: [newTeacher, ...prev.teachers],
    }));
    setSelectedTeacherId(newTeacher.id);
  };

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    setData((prev) => ({
      ...prev,
      teachers: prev.teachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t)),
    }));
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setData((prev) => {
      const newTeachers = prev.teachers.filter((t) => t.id !== teacherId);
      const newInst1 = { ...prev.instrumen1 };
      delete newInst1[teacherId];
      const newInst2 = { ...prev.instrumen2 };
      delete newInst2[teacherId];
      const newInst3 = { ...prev.instrumen3 };
      delete newInst3[teacherId];
      const newInst4 = { ...prev.instrumen4 };
      delete newInst4[teacherId];

      return {
        ...prev,
        teachers: newTeachers,
        instrumen1: newInst1,
        instrumen2: newInst2,
        instrumen3: newInst3,
        instrumen4: newInst4,
      };
    });
  };

  // Handlers for Instruments
  const handleSaveInstrument1 = (record: Instrument1Admin) => {
    setData((prev) => ({
      ...prev,
      instrumen1: {
        ...prev.instrumen1,
        [record.teacherId]: record,
      },
      // update teacher status if not already finished
      teachers: prev.teachers.map((t) =>
        t.id === record.teacherId && t.status === 'Belum Disupervisi'
          ? { ...t, status: 'Proses' }
          : t
      ),
    }));
  };

  const handleSaveInstrument2 = (record: Instrument2ModulAjar) => {
    setData((prev) => ({
      ...prev,
      instrumen2: {
        ...prev.instrumen2,
        [record.teacherId]: record,
      },
      teachers: prev.teachers.map((t) =>
        t.id === record.teacherId && t.status === 'Belum Disupervisi'
          ? { ...t, status: 'Proses' }
          : t
      ),
    }));
  };

  const handleSaveInstrument3 = (record: Instrument3Observasi) => {
    setData((prev) => ({
      ...prev,
      instrumen3: {
        ...prev.instrumen3,
        [record.teacherId]: record,
      },
      teachers: prev.teachers.map((t) =>
        t.id === record.teacherId && t.status === 'Belum Disupervisi'
          ? { ...t, status: 'Proses' }
          : t
      ),
    }));
  };

  const handleSaveInstrument4 = (record: Instrument4PascaObservasi) => {
    setData((prev) => ({
      ...prev,
      instrumen4: {
        ...prev.instrumen4,
        [record.teacherId]: record,
      },
      teachers: prev.teachers.map((t) =>
        t.id === record.teacherId ? { ...t, status: 'Selesai' } : t
      ),
    }));
  };

  // Quick navigation from dashboard
  const handleNavigateToInstrument = (
    instrumentTab: 'instrumen-1' | 'instrumen-2' | 'instrumen-3' | 'instrumen-4',
    teacherId: string
  ) => {
    if (teacherId) setSelectedTeacherId(teacherId);
    setCurrentTab(instrumentTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImportData = (imported: AppSupervisionData) => {
    setData(imported);
    if (imported.teachers.length > 0) {
      setSelectedTeacherId(imported.teachers[0].id);
    }
  };

  const handleResetData = () => {
    const initial = getInitialSupervisionData();
    setData(initial);
    setSelectedTeacherId(initial.teachers[0].id);
  };

  // Tab Header Details
  const getHeaderInfo = () => {
    switch (currentTab) {
      case 'dashboard':
        return {
          title: 'Rekapitulasi & Analisis Supervisi',
          subtitle: 'Pemantauan Indeks Mutu Pembelajaran & Rekap Nilai Seluruh Guru',
        };
      case 'master-data':
        return {
          title: 'Identitas & Data Master',
          subtitle: 'Pengaturan Profil Satuan Pendidikan, Pejabat & Guru Sasaran',
        };
      case 'instrumen-1':
        return {
          title: 'Instrumen 1: Telaah Administrasi Pembelajaran',
          subtitle: 'Evaluasi 24 Butir Dokumen Perencanaan dan Administrasi Guru',
        };
      case 'instrumen-2':
        return {
          title: 'Instrumen 2: Telaah Modul Ajar (RPM / MA)',
          subtitle: 'Pemeriksaan 20 Indikator Deep Learning & Diferensiasi Modul',
        };
      case 'instrumen-3':
        return {
          title: 'Instrumen 3: Observasi Pembelajaran di Kelas',
          subtitle: 'Pengamatan Langsung Praktik Mengajar & Bukti Pembelajaran Mendalam',
        };
      case 'instrumen-4':
        return {
          title: 'Instrumen 4: Pasca Observasi Supervisi',
          subtitle: 'Refleksi Diri Guru, Coaching Umpan Balik & Rencana Tindak Lanjut',
        };
      case 'settings':
        return {
          title: 'Pengaturan & Backup Data',
          subtitle: 'Ekspor Berkas JSON, Dokumen Excel XLSX, dan Petunjuk Cetak',
        };
      default:
        return {
          title: 'SupervisiDigital Master',
          subtitle: 'Sistem Manajemen Supervisi Akademik Terpadu',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        school={data.school}
        teachers={data.teachers}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          school={data.school}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onExportCSV={() => exportRecapToCSV(data)}
          onPrint={() => window.print()}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              data={data}
              onNavigateToInstrument={handleNavigateToInstrument}
              onNavigateToMasterData={() => setCurrentTab('master-data')}
              onExportCSV={() => exportRecapToCSV(data)}
            />
          )}

          {currentTab === 'master-data' && (
            <MasterDataView
              data={data}
              onUpdateSchool={handleUpdateSchool}
              onAddTeacher={handleAddTeacher}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
            />
          )}

          {currentTab === 'instrumen-1' && (
            <Instrument1View
              data={data}
              selectedTeacherId={selectedTeacherId}
              onSelectTeacher={setSelectedTeacherId}
              onSaveInstrument={handleSaveInstrument1}
              onNavigateNext={() => {
                setCurrentTab('instrumen-2');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentTab === 'instrumen-2' && (
            <Instrument2View
              data={data}
              selectedTeacherId={selectedTeacherId}
              onSelectTeacher={setSelectedTeacherId}
              onSaveInstrument={handleSaveInstrument2}
              onNavigateNext={() => {
                setCurrentTab('instrumen-3');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentTab === 'instrumen-3' && (
            <Instrument3View
              data={data}
              selectedTeacherId={selectedTeacherId}
              onSelectTeacher={setSelectedTeacherId}
              onSaveInstrument={handleSaveInstrument3}
              onNavigateNext={() => {
                setCurrentTab('instrumen-4');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentTab === 'instrumen-4' && (
            <Instrument4View
              data={data}
              selectedTeacherId={selectedTeacherId}
              onSelectTeacher={setSelectedTeacherId}
              onSaveInstrument={handleSaveInstrument4}
              onNavigateNext={() => {
                setCurrentTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsBackupView
              data={data}
              onImportData={handleImportData}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
