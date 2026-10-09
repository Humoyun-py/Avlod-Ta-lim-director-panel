import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Copy,
  Check,
  Printer,
  Eye,
  Trash2,
  Coins,
  CreditCard,
  BookOpen,
  Layers,
  UserCheck,
  ShieldAlert,
  Download,
  KeyRound,
  Sparkles,
  Phone
} from 'lucide-react';
import { DirectorService } from '../services/mockService';
import { Course, Group, Student } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Drawer } from '../components/common/Drawer';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { EmptyState } from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/Skeleton';
import { Pagination } from '../components/common/Pagination';
import { useToast } from '../context/ToastContext';

export const StudentsPage: React.FC = () => {
  const { success, error, info } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals & Drawers
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ id: string; pass: string; name: string } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState<'overview' | 'attendance' | 'payments' | 'coins' | 'course'>('overview');

  // Confirmation Delete
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; student: Student | null }>({
    isOpen: false,
    student: null
  });

  // Copied State
  const [copiedField, setCopiedField] = useState<'id' | 'pass' | null>(null);

  // Add Student Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    courseId: '',
    groupId: '',
    monthlyPayment: 1200000
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [stu, crs, grp] = await Promise.all([
        DirectorService.getStudents(),
        DirectorService.getCourses(),
        DirectorService.getGroups()
      ]);
      setStudents(stu);
      setCourses(crs);
      setGroups(grp);
      if (crs.length > 0 && !formData.courseId) {
        setFormData(prev => ({
          ...prev,
          courseId: crs[0].id,
          groupId: grp[0]?.id || ''
        }));
      }
    } catch {
      error('Xatolik', 'O‘quvchilar ma’lumotini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.includes(searchQuery) ||
      s.phone.includes(searchQuery);

    const matchesCourse = courseFilter === 'all' || s.courseId === courseFilter;
    const matchesGroup = groupFilter === 'all' || s.groupId === groupFilter;
    const matchesPayment = paymentFilter === 'all' || s.paymentStatus === paymentFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesCourse && matchesGroup && matchesPayment && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      error('Xatolik', 'Ism va familiya kiritilishi shart');
      return;
    }

    const selectedCourse = courses.find(c => c.id === formData.courseId) || courses[0];
    const selectedGroup = groups.find(g => g.id === formData.groupId) || groups[0];

    try {
      const result = await DirectorService.createStudent({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || '+998 90 000 00 00',
        courseId: selectedCourse?.id || 'c-1',
        courseName: selectedCourse?.name || 'Frontend Web Development',
        groupId: selectedGroup?.id || 'g-1',
        groupName: selectedGroup?.name || 'FE-14',
        teacherName: selectedGroup?.teacherName || 'Sardorbek Alimov',
        monthlyPayment: Number(formData.monthlyPayment) || 1200000
      });

      setAddModalOpen(false);
      setCreatedCredentials({
        id: result.generatedId,
        pass: result.generatedPassword,
        name: `${formData.firstName} ${formData.lastName}`
      });
      setCredentialsModalOpen(true);
      success('Muvaffaqiyatli', 'Yangi o‘quvchi ro‘yxatga olindi va login yaratildi');

      // Reset
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        courseId: courses[0]?.id || '',
        groupId: groups[0]?.id || '',
        monthlyPayment: 1200000
      });
      loadData();
    } catch {
      error('Xatolik', 'Talaba qo‘shishda xatolik yuz berdi');
    }
  };

  const copyToClipboard = (text: string, field: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    info('Nusxalandi', `${field === 'id' ? 'Student ID' : 'Parol'} buferga nusxalandi`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      await DirectorService.deleteStudent(id);
      setDeleteConfirm({ isOpen: false, student: null });
      loadData();
      success('O‘chirildi', 'O‘quvchi tizimdan muvaffaqiyatli o‘chirildi');
    } catch {
      error('Xatolik', 'O‘chirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            O‘quvchilar (Students)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Akademiyadagi barcha talabalar, unikal ID kartalari, to‘lov va davomat ko‘rsatkichlari
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5C42FD] hover:bg-[#4d33eb] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#5C42FD]/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Filter Bar (Search, Course, Group, Payment, Status) */}
      <div className="bg-white p-4 rounded-2xl border border-[#E9EAF3] space-y-3 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Ism, 8-xonali ID yoki telefon..."
              className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden"
            />
          </div>

          {/* Course Filter */}
          <div>
            <select
              value={courseFilter}
              onChange={e => {
                setCourseFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-hidden"
            >
              <option value="all">Barcha kurslar</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Group Filter */}
          <div>
            <select
              value={groupFilter}
              onChange={e => {
                setGroupFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-hidden"
            >
              <option value="all">Barcha guruhlar</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={e => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-hidden"
            >
              <option value="all">To‘lov statusi (Hammasi)</option>
              <option value="paid">Paid (To‘langan)</option>
              <option value="pending">Pending (Kutilmoqda)</option>
              <option value="overdue">Overdue (Kechikkan)</option>
              <option value="blocked">Blocked (Bloklangan)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <TableSkeleton rows={6} columns={8} />
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          title="O‘quvchilar topilmadi"
          description="Ushbu filtrlarga mos keluvchi o‘quvchilar mavjud emas."
          icon={GraduationCap}
          actionText="Yangi talaba qo‘shish"
          onAction={() => setAddModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E9EAF3] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9FE] text-gray-500 font-bold border-b border-[#F0F1F7] tracking-wider uppercase text-[11px]">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">ID (8-raqam)</th>
                  <th className="px-5 py-4">Kurs</th>
                  <th className="px-5 py-4">Guruh</th>
                  <th className="px-5 py-4">Oylik To‘lov</th>
                  <th className="px-5 py-4">To‘lov Holati</th>
                  <th className="px-5 py-4 text-center">Davomat</th>
                  <th className="px-5 py-4 text-center">Coins</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {paginatedStudents.map(student => (
                  <tr
                    key={student.id}
                    className="hover:bg-[#FAF9FE] transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedStudent(student);
                      setDetailsDrawerOpen(true);
                    }}
                  >
                    {/* Student Info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5C42FD] font-bold text-xs flex items-center justify-center shrink-0">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-[#5C42FD] transition-colors">
                            {student.fullName}
                          </p>
                          <p className="text-[10px] text-gray-400">{student.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* 8-Digit Unique ID */}
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-[#5C42FD] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 tracking-wider">
                        {student.studentId}
                      </span>
                    </td>

                    {/* Course */}
                    <td className="px-5 py-3.5 text-gray-700 truncate max-w-[150px]">
                      {student.courseName}
                    </td>

                    {/* Group */}
                    <td className="px-5 py-3.5 font-medium text-gray-900">
                      {student.groupName}
                    </td>

                    {/* Monthly Payment */}
                    <td className="px-5 py-3.5 font-bold text-gray-900">
                      {student.monthlyPayment.toLocaleString()} UZS
                    </td>

                    {/* Payment Status */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={student.paymentStatus} size="sm" />
                    </td>

                    {/* Attendance % */}
                    <td className="px-5 py-3.5 text-center">
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {student.attendanceRate}%
                      </span>
                    </td>

                    {/* Coin Balance */}
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
                        <Coins className="w-3 h-3" />
                        <span>{student.coins}</span>
                      </span>
                    </td>

                    {/* Account Status */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={student.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td
                      className="px-5 py-3.5 text-right space-x-1"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(student);
                          setDetailsDrawerOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#5C42FD] hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Ko‘rish"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ isOpen: true, student })}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStudents.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* CREATE STUDENT MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Yangi Talaba Qo‘shish"
        subtitle="Talabani ro‘yxatga oling. Tizim avtomatik tarzda 8 xonali ID va xavfsiz parol yaratadi."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Ism <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Azizbek"
                className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Familiya <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Sobirov"
                className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs focus:outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Telefon raqami
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+998 90 123 45 67"
              className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs focus:outline-hidden transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Kursni tanlang
              </label>
              <select
                value={formData.courseId}
                onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs focus:outline-hidden transition-all cursor-pointer"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Guruhni tanlang
              </label>
              <select
                value={formData.groupId}
                onChange={e => setFormData({ ...formData, groupId: e.target.value })}
                className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs focus:outline-hidden transition-all cursor-pointer"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.teacherName})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Oylik to‘lov summasi (UZS)
            </label>
            <input
              type="number"
              value={formData.monthlyPayment}
              onChange={e => setFormData({ ...formData, monthlyPayment: Number(e.target.value) })}
              step="50000"
              className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs focus:outline-hidden font-bold transition-all"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#5C42FD] hover:bg-[#4d33eb] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Saqlash va Login yaratish
            </button>
          </div>
        </form>
      </Modal>

      {/* CREDENTIALS SUCCESS MODAL (Prompt spec 13) */}
      <Modal
        isOpen={credentialsModalOpen}
        onClose={() => setCredentialsModalOpen(false)}
        title="Student successfully created"
        subtitle="Yangi talaba uchun avtomatik tizim hisobi muvaffaqiyatli shakllantirildi"
        maxWidth="md"
      >
        {createdCredentials && (
          <div className="space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900">{createdCredentials.name}</h4>
              <p className="text-xs text-gray-500 mt-0.5">Avlod Ta’lim talabalar tizimiga kirish ma’lumotlari</p>
            </div>

            <div className="space-y-3 bg-[#FAF9FE] p-4 rounded-2xl border border-[#E9EAF3] text-left">
              {/* 8-Digit Student ID */}
              <div>
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Student ID (8 xonali raqam)
                </span>
                <div className="flex items-center justify-between mt-1 bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="font-mono text-base font-extrabold text-[#5C42FD] tracking-wider">
                    {createdCredentials.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdCredentials.id, 'id')}
                    className="p-1.5 text-gray-400 hover:text-[#5C42FD] rounded-lg transition-colors cursor-pointer"
                    title="Copy ID"
                  >
                    {copiedField === 'id' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 6-Alphanumeric Password */}
              <div>
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Password (6 belgili xavfsiz parol)
                </span>
                <div className="flex items-center justify-between mt-1 bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="font-mono text-base font-extrabold text-gray-900 tracking-wider">
                    {createdCredentials.pass}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdCredentials.pass, 'pass')}
                    className="p-1.5 text-gray-400 hover:text-[#5C42FD] rounded-lg transition-colors cursor-pointer"
                    title="Copy Password"
                  >
                    {copiedField === 'pass' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons: Copy ID, Copy Password, Print Credentials, Close */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => copyToClipboard(createdCredentials.id, 'id')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy ID</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(createdCredentials.pass, 'pass')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Password</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                  info('Chop etish', 'Talaba ID kartasi printerga yuborilmoqda');
                }}
                className="col-span-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#5C42FD] hover:bg-[#4d33eb] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Credentials (ID Kartani chiqarish)</span>
              </button>

              <button
                type="button"
                onClick={() => setCredentialsModalOpen(false)}
                className="col-span-2 text-xs font-semibold text-gray-500 hover:text-gray-800 py-1 cursor-pointer"
              >
                Close (Yopish)
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* STUDENT DETAILS DRAWER (Tabs: Overview, Attendance, Payments, Coins, Course) */}
      <Drawer
        isOpen={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        title={selectedStudent?.fullName || 'Talaba Profili'}
        subtitle={`ID: ${selectedStudent?.studentId} • Guruh: ${selectedStudent?.groupName}`}
        width="xl"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="bg-[#FAF9FE] p-4 rounded-2xl border border-[#E9EAF3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#5C42FD] text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {selectedStudent.firstName[0]}
                  {selectedStudent.lastName[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{selectedStudent.fullName}</h4>
                  <p className="text-xs text-gray-500">ID: {selectedStudent.studentId}</p>
                </div>
              </div>
              <StatusBadge status={selectedStudent.status} />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 gap-4 text-xs font-bold">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'attendance', label: 'Attendance' },
                { id: 'payments', label: 'Payments' },
                { id: 'coins', label: 'Coins' },
                { id: 'course', label: 'Course' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDetailsTab(t.id as any)}
                  className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                    detailsTab === t.id
                      ? 'border-[#5C42FD] text-[#5C42FD]'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {detailsTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[11px] block">Telefon raqami</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">{selectedStudent.phone}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[11px] block">Ustoz (Mentor)</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">{selectedStudent.teacherName}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[11px] block">Oylik To‘lov</span>
                    <span className="font-bold text-[#5C42FD] mt-0.5 block">{selectedStudent.monthlyPayment.toLocaleString()} UZS</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[11px] block">To‘lov Holati</span>
                    <div className="mt-1"><StatusBadge status={selectedStudent.paymentStatus} size="sm" /></div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance */}
            {detailsTab === 'attendance' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-emerald-800 font-bold block">Davomat foizi</span>
                    <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{selectedStudent.attendanceRate}%</span>
                  </div>
                  <UserCheck className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-gray-500 text-[11px]">Dars qoldirishlar soni me’yordan oshmagan.</p>
              </div>
            )}

            {/* Payments */}
            {detailsTab === 'payments' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-white rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">Joriy oy to‘lovi</span>
                    <p className="text-gray-400 text-[11px]">{selectedStudent.monthlyPayment.toLocaleString()} so‘m</p>
                  </div>
                  <StatusBadge status={selectedStudent.paymentStatus} size="sm" />
                </div>
              </div>
            )}

            {/* Coins */}
            {detailsTab === 'coins' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                  <div>
                    <span className="text-amber-800 font-bold block">Avlod Coin Balansi</span>
                    <span className="text-2xl font-black text-amber-600 mt-0.5 block">{selectedStudent.coins} coin</span>
                  </div>
                  <Coins className="w-8 h-8 text-amber-500" />
                </div>
                <p className="text-gray-500 text-[11px]">Do‘kondan hoodie, noutbuk sumkasi yoki dasturchi gadjetlariga almashtirish mumkin.</p>
              </div>
            )}

            {/* Course */}
            {detailsTab === 'course' && (
              <div className="p-4 bg-white rounded-xl border border-gray-100 text-xs space-y-2">
                <h5 className="font-bold text-gray-900">{selectedStudent.courseName}</h5>
                <p className="text-gray-500">Guruh: <span className="font-semibold text-gray-900">{selectedStudent.groupName}</span></p>
                <p className="text-gray-500">O‘qituvchi: <span className="font-semibold text-gray-900">{selectedStudent.teacherName}</span></p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* CONFIRMATION DELETE */}
      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, student: null })}
        onConfirm={() => {
          if (deleteConfirm.student) handleDelete(deleteConfirm.student.id);
        }}
        title="O‘quvchini o‘chirish"
        message={`${deleteConfirm.student?.fullName} tizimdan to‘liq o‘chiriladi. Ushbu amalni qaytarib bo‘lmaydi!`}
        confirmText="O‘chirish"
        variant="danger"
      />
    </div>
  );
};
