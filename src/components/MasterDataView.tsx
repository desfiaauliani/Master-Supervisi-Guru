import React, { useState } from 'react';
import {
  AppSupervisionData,
  SchoolProfile,
  Teacher,
  SupervisionStatus,
} from '../types/supervision';
import {
  Building2,
  UserCog,
  UserPlus,
  Users,
  Edit2,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
} from 'lucide-react';

interface MasterDataViewProps {
  data: AppSupervisionData;
  onUpdateSchool: (school: SchoolProfile) => void;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  data,
  onUpdateSchool,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'school' | 'supervisors'>('teachers');
  
  // School Profile Local State
  const [schoolForm, setSchoolForm] = useState<SchoolProfile>({ ...data.school });
  const [schoolSavedNotice, setSchoolSavedNotice] = useState(false);

  // Teacher Modal State
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherForm, setTeacherForm] = useState<Omit<Teacher, 'id'>>({
    namaGuru: '',
    nip: '',
    pangkatGolongan: 'Penata Muda, III/a',
    mataPelajaran: '',
    kelasFase: 'Kelas X / Fase E',
    jamTatapMuka: 24,
    tanggalSupervisi: new Date().toISOString().split('T')[0],
    status: 'Belum Disupervisi',
    noHp: '',
    email: '',
  });

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchool(schoolForm);
    setSchoolSavedNotice(true);
    setTimeout(() => setSchoolSavedNotice(false), 3000);
  };

  const handleOpenAddTeacher = () => {
    setEditingTeacherId(null);
    setTeacherForm({
      namaGuru: '',
      nip: '',
      pangkatGolongan: 'Penata Muda, III/a',
      mataPelajaran: '',
      kelasFase: 'Kelas X / Fase E',
      jamTatapMuka: 24,
      tanggalSupervisi: new Date().toISOString().split('T')[0],
      status: 'Belum Disupervisi',
      noHp: '',
      email: '',
    });
    setIsTeacherModalOpen(true);
  };

  const handleOpenEditTeacher = (teacher: Teacher) => {
    setEditingTeacherId(teacher.id);
    setTeacherForm({
      namaGuru: teacher.namaGuru,
      nip: teacher.nip,
      pangkatGolongan: teacher.pangkatGolongan,
      mataPelajaran: teacher.mataPelajaran,
      kelasFase: teacher.kelasFase,
      jamTatapMuka: teacher.jamTatapMuka,
      tanggalSupervisi: teacher.tanggalSupervisi,
      status: teacher.status,
      noHp: teacher.noHp || '',
      email: teacher.email || '',
    });
    setIsTeacherModalOpen(true);
  };

  const handleSubmitTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.namaGuru.trim()) return;

    if (editingTeacherId) {
      onUpdateTeacher({
        id: editingTeacherId,
        ...teacherForm,
      });
    } else {
      const newTeacher: Teacher = {
        id: `t-${Date.now()}`,
        ...teacherForm,
      };
      onAddTeacher(newTeacher);
    }
    setIsTeacherModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs md:text-sm border-b-2 transition-all ${
            activeTab === 'teachers'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Guru ({data.teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('school')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs md:text-sm border-b-2 transition-all ${
            activeTab === 'school'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Profil Satuan Pendidikan</span>
        </button>

        <button
          onClick={() => setActiveTab('supervisors')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs md:text-sm border-b-2 transition-all ${
            activeTab === 'supervisors'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCog className="w-4 h-4" />
          <span>Kepala Sekolah & Pengawas</span>
        </button>
      </div>

      {/* Tab Content 1: Teachers CRUD */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm md:text-base">
                Kelola Data Guru yang Disupervisi
              </h3>
              <p className="text-xs text-slate-500">
                Data guru otomatis terhubung pada seluruh instrumen penilaian supervisi dan kop dokumen resmi.
              </p>
            </div>
            <button
              onClick={handleOpenAddTeacher}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Guru Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3 text-center w-10">No</th>
                    <th className="py-3 px-4">Nama Lengkap & NIP</th>
                    <th className="py-3 px-4">Pangkat / Golongan</th>
                    <th className="py-3 px-4">Mata Pelajaran</th>
                    <th className="py-3 px-4">Kelas / Fase</th>
                    <th className="py-3 px-3 text-center">Beban (JTM)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {data.teachers.map((teacher, idx) => (
                    <tr key={teacher.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 text-center text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{teacher.namaGuru}</div>
                        <div className="text-[11px] font-mono text-slate-500">NIP. {teacher.nip || '-'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{teacher.pangkatGolongan}</td>
                      <td className="py-3 px-4 font-semibold text-indigo-700">{teacher.mataPelajaran}</td>
                      <td className="py-3 px-4 text-slate-600">{teacher.kelasFase}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">{teacher.jamTatapMuka} Jam</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            teacher.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : teacher.status === 'Perlu Tindak Lanjut'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : teacher.status === 'Proses'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {teacher.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditTeacher(teacher)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
                            title="Edit Data Guru"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus guru ${teacher.namaGuru}? Data instrumen terkait akan terhapus.`)) {
                                onDeleteTeacher(teacher.id);
                              }
                            }}
                            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Hapus Guru"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: School Profile Form */}
      {activeTab === 'school' && (
        <form onSubmit={handleSaveSchool} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Identitas Satuan Pendidikan</h3>
              <p className="text-xs text-slate-500">
                Informasi ini digunakan pada kop surat resmi, lembar pengesahan, dan dokumen cetak instrumen.
              </p>
            </div>
            {schoolSavedNotice && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fadeIn">
                <CheckCircle className="w-3.5 h-3.5" /> Tersimpan!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan *</label>
              <input
                type="text"
                required
                value={schoolForm.namaSekolah}
                onChange={(e) => setSchoolForm({ ...schoolForm, namaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPSN (Nomor Pokok Sekolah Nasional) *</label>
              <input
                type="text"
                required
                value={schoolForm.npsn}
                onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Instansi Pembina / Dinas Pendidikan *</label>
              <input
                type="text"
                required
                value={schoolForm.dinasPendidikan}
                onChange={(e) => setSchoolForm({ ...schoolForm, dinasPendidikan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Sekolah *</label>
              <input
                type="text"
                required
                value={schoolForm.alamatSekolah}
                onChange={(e) => setSchoolForm({ ...schoolForm, alamatSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelurahan / Kecamatan</label>
              <input
                type="text"
                value={schoolForm.kelurahanKecamatan}
                onChange={(e) => setSchoolForm({ ...schoolForm, kelurahanKecamatan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                value={schoolForm.kotaKabupaten}
                onChange={(e) => setSchoolForm({ ...schoolForm, kotaKabupaten: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
              <input
                type="text"
                value={schoolForm.provinsi}
                onChange={(e) => setSchoolForm({ ...schoolForm, provinsi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telepon & Email</label>
              <input
                type="text"
                value={schoolForm.teleponEmail}
                onChange={(e) => setSchoolForm({ ...schoolForm, teleponEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran Aktif *</label>
              <input
                type="text"
                required
                value={schoolForm.tahunAjaran}
                onChange={(e) => setSchoolForm({ ...schoolForm, tahunAjaran: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                placeholder="2024/2025"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester *</label>
              <select
                value={schoolForm.semester}
                onChange={(e) => setSchoolForm({ ...schoolForm, semester: e.target.value as 'Ganjil' | 'Genap' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Satuan Pendidikan</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Content 3: Leadership & Supervisors */}
      {activeTab === 'supervisors' && (
        <form onSubmit={handleSaveSchool} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kepala Sekolah Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-slate-900 font-bold text-sm">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Data Kepala Satuan Pendidikan</span>
              </div>

              <div className="space-y-3 text-xs md:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={schoolForm.namaKepalaSekolah}
                    onChange={(e) => setSchoolForm({ ...schoolForm, namaKepalaSekolah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP (Nomor Induk Pegawai) *</label>
                  <input
                    type="text"
                    required
                    value={schoolForm.nipKepalaSekolah}
                    onChange={(e) => setSchoolForm({ ...schoolForm, nipKepalaSekolah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pangkat / Golongan Ruang</label>
                  <input
                    type="text"
                    value={schoolForm.pangkatGolKepalaSekolah}
                    onChange={(e) => setSchoolForm({ ...schoolForm, pangkatGolKepalaSekolah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="Pembina Tingkat I, IV/b"
                  />
                </div>
              </div>
            </div>

            {/* Pengawas Pendamping Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-slate-900 font-bold text-sm">
                <UserCog className="w-4 h-4 text-indigo-600" />
                <span>Data Pengawas Pendamping / Supervisor</span>
              </div>

              <div className="space-y-3 text-xs md:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Pengawas & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={schoolForm.namaPengawas}
                    onChange={(e) => setSchoolForm({ ...schoolForm, namaPengawas: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP Pengawas *</label>
                  <input
                    type="text"
                    required
                    value={schoolForm.nipPengawas}
                    onChange={(e) => setSchoolForm({ ...schoolForm, nipPengawas: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pangkat / Golongan Pengawas</label>
                  <input
                    type="text"
                    value={schoolForm.pangkatGolPengawas}
                    onChange={(e) => setSchoolForm({ ...schoolForm, pangkatGolPengawas: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="Pembina Utama Madya, IV/d"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Perubahan identitas pejabat akan otomatis terupdate pada seluruh lembar tanda tangan dokumen supervisi.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Pejabat</span>
            </button>
          </div>
        </form>
      )}

      {/* Modal Add / Edit Teacher */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                {editingTeacherId ? 'Edit Data Guru' : 'Tambah Guru Sasaran Supervisi'}
              </h3>
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTeacher} className="mt-4 space-y-3.5 text-xs md:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dra. Nurhasanah, M.Pd."
                  value={teacherForm.namaGuru}
                  onChange={(e) => setTeacherForm({ ...teacherForm, namaGuru: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP / NUPTK</label>
                  <input
                    type="text"
                    placeholder="19800101 200501 1 002"
                    value={teacherForm.nip}
                    onChange={(e) => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    placeholder="Penata Muda, III/a"
                    value={teacherForm.pangkatGolongan}
                    onChange={(e) => setTeacherForm({ ...teacherForm, pangkatGolongan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran *</label>
                  <input
                    type="text"
                    required
                    placeholder="Biologi / IPA"
                    value={teacherForm.mataPelajaran}
                    onChange={(e) => setTeacherForm({ ...teacherForm, mataPelajaran: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas / Fase *</label>
                  <input
                    type="text"
                    required
                    placeholder="Kelas XI / Fase F"
                    value={teacherForm.kelasFase}
                    onChange={(e) => setTeacherForm({ ...teacherForm, kelasFase: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Tatap Muka (JTM)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={teacherForm.jamTatapMuka}
                    onChange={(e) => setTeacherForm({ ...teacherForm, jamTatapMuka: Number(e.target.value) || 24 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Supervisi</label>
                  <select
                    value={teacherForm.status}
                    onChange={(e) => setTeacherForm({ ...teacherForm, status: e.target.value as SupervisionStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                  >
                    <option value="Belum Disupervisi">Belum Disupervisi</option>
                    <option value="Proses">Dalam Proses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Perlu Tindak Lanjut">Perlu Tindak Lanjut</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  {editingTeacherId ? 'Simpan Pembaruan' : 'Tambahkan Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
