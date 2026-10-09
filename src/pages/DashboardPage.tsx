import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Layers,
  DollarSign,
  Wallet,
  Clock,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  Plus,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { RevenueChart } from '../components/charts/RevenueChart';
import { StudentsGrowthChart } from '../components/charts/StudentsGrowthChart';
import { AttendanceChart } from '../components/charts/AttendanceChart';
import { PaymentStatsChart } from '../components/charts/PaymentStatsChart';
import { StatusBadge } from '../components/common/StatusBadge';
import { DirectorService } from '../services/mockService';
import { Payment, ShopOrder, Student, Teacher } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pay, stu, ord, tch] = await Promise.all([
          DirectorService.getPayments(),
          DirectorService.getStudents(),
          DirectorService.getOrders(),
          DirectorService.getTeachers()
        ]);
        setPayments(pay);
        setStudents(stu);
        setOrders(ord);
        setTeachers(tch);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalStudentsCount = 294; // Total across all groups in academy
  const activeStudentsCount = 281;
  const blockedStudentsCount = 13;

  const totalTeachersCount = teachers.length || 6;
  const activeTeachersCount = teachers.filter(t => t.status === 'active').length || 5;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-[#F2EFFF] p-6 rounded-3xl border border-[#E9EAF3] shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-wider uppercase text-[#5C42FD] bg-purple-50 px-2.5 py-1 rounded-md">
            Director Boshqaruvi
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Xush kelibsiz, Sardor Rahmonov
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Avlod Ta'lim akademiyasining umumiy ko‘rsatkichlari, moliyaviy oqimlari va talabalar dinamikasi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/director/payments')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>To‘lovlarni ko‘rish</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/director/students')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#5C42FD] hover:bg-[#4d33eb] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#5C42FD]/30 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi O‘quvchi</span>
          </button>
        </div>
      </div>

      {/* Row 1: Primary Key Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Asosiy Akademiya Ko‘rsatkichlari
          </h3>
          <span className="text-xs text-gray-400">Jonli yangilanish</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={totalStudentsCount}
            subtitle="Jami o‘quvchilar soni"
            icon={GraduationCap}
            accentColor="#5C42FD"
            trend={{ value: '14.2%', isPositive: true }}
            subStats={[
              { label: 'Active', value: activeStudentsCount, highlight: 'emerald' },
              { label: 'Blocked', value: blockedStudentsCount, highlight: 'rose' }
            ]}
            onClick={() => navigate('/director/students')}
          />

          <StatCard
            title="Total Teachers"
            value={totalTeachersCount}
            subtitle="Jami ustozlar shtati"
            icon={Users}
            accentColor="#4F46E5"
            trend={{ value: '1 mentor', isPositive: true }}
            subStats={[
              { label: 'Active ustozlar', value: activeTeachersCount, highlight: 'emerald' },
              { label: 'Guruhlar biriktirilgan', value: '14 ta', highlight: 'indigo' }
            ]}
            onClick={() => navigate('/director/teachers')}
          />

          <StatCard
            title="Total Groups"
            value="14 ta"
            subtitle="Jami guruhlar soni"
            icon={Layers}
            accentColor="#0284C7"
            subStats={[
              { label: 'Active guruhlar', value: '12 ta', highlight: 'emerald' },
              { label: 'Rejalashtirilgan', value: '2 ta', highlight: 'amber' }
            ]}
            onClick={() => navigate('/director/groups')}
          />

          <StatCard
            title="Monthly Revenue"
            value="284,000,000 UZS"
            subtitle="Shu oy tushumi (Oktyabr)"
            icon={DollarSign}
            accentColor="#10B981"
            trend={{ value: '8.4%', isPositive: true }}
            subStats={[
              { label: 'Kassa (Naqd)', value: '42.6 mln', highlight: 'gray' },
              { label: 'Online (Payme/Click)', value: '241.4 mln', highlight: 'emerald' }
            ]}
            onClick={() => navigate('/director/payments')}
          />
        </div>
      </div>

      {/* Row 2: Financial & Operational Sub-Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Teacher Salary"
          value="113,600,000 UZS"
          subtitle="Shu oy ustozlarga hisoblangan (40%)"
          icon={Wallet}
          accentColor="#8B5CF6"
          subStats={[
            { label: 'To‘lab berildi', value: '44.8 mln', highlight: 'emerald' },
            { label: 'Kutilayotgan', value: '68.8 mln', highlight: 'amber' }
          ]}
          onClick={() => navigate('/director/teacher-salary')}
        />

        <StatCard
          title="Pending Payments"
          value="44 nafar"
          subtitle="To‘lov qilishi kerak bo‘lganlar"
          icon={Clock}
          accentColor="#F59E0B"
          subStats={[
            { label: 'Kutilayotgan summa', value: '52.8 mln UZS', highlight: 'amber' },
            { label: 'Muddati o‘tgan', value: '23 nafar', highlight: 'rose' }
          ]}
          onClick={() => navigate('/director/payments')}
        />

        <StatCard
          title="Shop Orders"
          value="5 ta yangi"
          subtitle="Talabalarning so‘nggi buyurtmalari"
          icon={ShoppingBag}
          accentColor="#EC4899"
          subStats={[
            { label: 'Tasdiqlash kerak', value: '2 ta', highlight: 'amber' },
            { label: 'Coin aylanmasi', value: '2,380 coin', highlight: 'indigo' }
          ]}
          onClick={() => navigate('/director/orders')}
        />
      </div>

      {/* Row 3: Modern Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <StudentsGrowthChart />
      </div>

      {/* Row 4: Secondary Charts (Attendance & Payment Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <PaymentStatsChart />
      </div>

      {/* Row 5: Recent Activity (Tables) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">
            So‘nggi Amaliyotlar va Harakatlar
          </h3>
          <span className="text-xs text-gray-500">Avlod Ta'lim real-time faolligi</span>
        </div>

        {/* 1. Recent Payments Table */}
        <div className="bg-white rounded-2xl border border-[#E9EAF3] overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-[#F0F1F7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#5C42FD]" />
              <h4 className="text-sm font-bold text-gray-900">Recent Payments (So‘nggi To‘lovlar)</h4>
            </div>
            <button
              onClick={() => navigate('/director/payments')}
              className="text-xs text-[#5C42FD] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Barchasini ko‘rish</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9FE] text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Guruh / Kurs</th>
                  <th className="px-6 py-3">Summa</th>
                  <th className="px-6 py-3">To‘lov Usuli</th>
                  <th className="px-6 py-3">Sana</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {payments.slice(0, 5).map(p => (
                  <tr key={p.id} className="hover:bg-[#FAF9FE] transition-colors">
                    <td className="px-6 py-3.5 font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#5C42FD]/10 text-[#5C42FD] flex items-center justify-center font-bold text-[10px]">
                        {p.studentName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div>{p.studentName}</div>
                        <div className="text-[10px] text-gray-400 font-normal">ID: {p.studentPublicId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">{p.groupName}</td>
                    <td className="px-6 py-3.5 font-bold text-gray-900">
                      {p.amount.toLocaleString()} UZS
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700">
                        {p.method}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{p.date}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2-Column Split: Recent Students & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Students */}
          <div className="bg-white rounded-2xl border border-[#E9EAF3] overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="px-6 py-4 border-b border-[#F0F1F7] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#5C42FD]" />
                  <h4 className="text-sm font-bold text-gray-900">Recent Students (Yangi O‘quvchilar)</h4>
                </div>
                <button
                  onClick={() => navigate('/director/students')}
                  className="text-xs text-[#5C42FD] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Barchasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9FE] text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-2.5">O‘quvchi</th>
                      <th className="px-5 py-2.5">Guruh</th>
                      <th className="px-5 py-2.5">Sana</th>
                      <th className="px-5 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {students.slice(0, 4).map(s => (
                      <tr key={s.id} className="hover:bg-[#FAF9FE] transition-colors">
                        <td className="px-5 py-3 font-semibold text-gray-900">
                          {s.fullName}
                          <span className="block text-[10px] text-gray-400 font-normal">ID: {s.studentId}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{s.groupName}</td>
                        <td className="px-5 py-3 text-gray-400">{s.createdAt}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={s.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-[#E9EAF3] overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="px-6 py-4 border-b border-[#F0F1F7] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#5C42FD]" />
                  <h4 className="text-sm font-bold text-gray-900">Recent Shop Orders (Do‘kon Buyurtmalari)</h4>
                </div>
                <button
                  onClick={() => navigate('/director/orders')}
                  className="text-xs text-[#5C42FD] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Barchasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9FE] text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-2.5">Student</th>
                      <th className="px-5 py-2.5">Mahsulot</th>
                      <th className="px-5 py-2.5">Coin</th>
                      <th className="px-5 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {orders.slice(0, 4).map(o => (
                      <tr key={o.id} className="hover:bg-[#FAF9FE] transition-colors">
                        <td className="px-5 py-3 font-semibold text-gray-900">
                          {o.studentName}
                          <span className="block text-[10px] text-gray-400 font-normal">{o.orderNumber}</span>
                        </td>
                        <td className="px-5 py-3 truncate max-w-[130px]">{o.productName}</td>
                        <td className="px-5 py-3 font-bold text-amber-600">
                          {o.coinAmount} coin
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={o.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
