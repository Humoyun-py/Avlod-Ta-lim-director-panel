import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Shield,
  CreditCard,
  Percent,
  Sliders,
  CheckCircle2,
  Lock,
  Building,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { DirectorService } from '../services/mockService';
import { DirectorSettings } from '../types';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { success, error, info } = useToast();
  const [settings, setSettings] = useState<DirectorSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'salary' | 'security'>('general');

  // Security passwords state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await DirectorService.getSettings();
      setSettings(data);
    } catch {
      error('Xatolik', 'Sozlamalarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await DirectorService.updateSettings(settings);
      success('Saqlandi', 'Tizim sozlamalari muvaffaqiyatli saqlandi');
    } catch {
      error('Xatolik', 'Sozlamalarni yangilashda muammo yuz berdi');
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      error('Xatolik', 'Yangi parol kamida 6 belgidan iborat bo‘lishi lozim');
      return;
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      error('Xatolik', 'Yangi parollar bir-biriga mos kelmadi');
      return;
    }
    success('Parol yangilandi', 'Director hisobining xavfsizlik paroli muvaffaqiyatli o‘zgartirildi');
    setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  if (loading || !settings) {
    return (
      <div className="p-8 text-center text-xs text-gray-400">
        Sozlamalar yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Tizim Sozlamalari (Settings)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Avlod Ta'lim markazi parametrlari, oylik to‘lov standartlari, ustozlar foizi va xavfsizlik
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5C42FD] hover:bg-[#4d33eb] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#5C42FD]/30 transition-all cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>O‘zgarishlarni Saqlash</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E9EAF3] gap-6 text-xs font-bold">
        {[
          { id: 'general', label: 'Umumiy Sozlamalar (General)', icon: Building },
          { id: 'payment', label: 'To‘lov Parametrlari (Payment)', icon: CreditCard },
          { id: 'salary', label: 'Ustoz Oyligi Foizi (Teacher Salary)', icon: Percent },
          { id: 'security', label: 'Xavfsizlik & Sessiya (Security)', icon: Shield }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#5C42FD] text-[#5C42FD]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General (Center name, Logo, Primary color) */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E9EAF3] shadow-xs space-y-6 max-w-3xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Markaz Nomi (Center Name)
              </label>
              <input
                type="text"
                value={settings.centerName}
                onChange={e => setSettings({ ...settings, centerName: e.target.value })}
                className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-hidden font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Asosiy Brand Rang (Primary Color)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-gray-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-full bg-[#F8F8FC] border border-[#E9EAF3] rounded-xl px-3 py-2 text-xs text-gray-900 font-mono font-bold"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Avlod Ta'lim standart binafsha: #5C42FD</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Logo URL (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={e => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Payment (Payment deadline, Default monthly payment) */}
      {activeTab === 'payment' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E9EAF3] shadow-xs space-y-6 max-w-3xl">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  To‘lov Oxirgi Muddati (Har oyning sanasi)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={settings.paymentDeadlineDay}
                    onChange={e => setSettings({ ...settings, paymentDeadlineDay: Number(e.target.value) })}
                    className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-900 font-bold focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                    -sanagacha
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Belgilangan sanadan so‘ng to‘lanmagan talabalar avtomatik "Overdue" statusiga o‘tadi.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Standart Oylik Kurs Narxi (UZS)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={settings.defaultMonthlyPayment}
                  onChange={e => setSettings({ ...settings, defaultMonthlyPayment: Number(e.target.value) })}
                  className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-900 font-bold focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-900">Naqd Kassa Kvitansiyalari</p>
                <p className="text-[11px] text-gray-500">Filial kassasidan to‘lov qabul qilinganda avtomatik kassa raqami generatsiya qilinsin.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowCashReceipts}
                onChange={e => setSettings({ ...settings, allowCashReceipts: e.target.checked })}
                className="w-4 h-4 text-[#5C42FD] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Teacher Salary (Percentage: default 40%) */}
      {activeTab === 'salary' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E9EAF3] shadow-xs space-y-6 max-w-3xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Baza Bo‘yicha Ustoz Ulushi Foizi (Default 40%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="10"
                  max="90"
                  value={settings.teacherSalaryPercentage}
                  onChange={e => setSettings({ ...settings, teacherSalaryPercentage: Number(e.target.value) })}
                  className="w-32 bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-base text-[#5C42FD] font-black focus:outline-hidden"
                />
                <span className="text-sm font-extrabold text-gray-700">% stavka</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Avlod Ta'lim standart moliyaviy tizimida o‘quvchilar tomonidan to‘langan kurs pulining 40% qismi
                dars beruvchi mentor hisobiga oylik maosh sifatida hisoblanadi.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900 space-y-1">
              <span className="font-bold block">Hisoblash namunasi:</span>
              <p>Talaba to‘lovi: 1,200,000 UZS • 40% stavka = <strong className="font-extrabold">480,000 UZS</strong> mentor ulushi.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security (Password settings, Session settings) */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E9EAF3] shadow-xs space-y-6 max-w-3xl">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Direktor Parolini O‘zgartirish
            </h4>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Joriy Parol
              </label>
              <input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="Hozirgi parolingiz"
                className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Yangi Parol
                </label>
                <input
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Kamida 6 belgi"
                  className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Yangi Parolni Tasdiqlang
                </label>
                <input
                  type="password"
                  required
                  value={passwords.confirmNewPassword}
                  onChange={e => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                  placeholder="Qayta kiriting"
                  className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Parolni Yangilash
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Sessiya va Kirish Xavfsizligi
            </h4>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sessiya Davomiyligi (daqiqa)
              </label>
              <input
                type="number"
                min="15"
                max="480"
                value={settings.sessionTimeoutMinutes}
                onChange={e => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })}
                className="w-32 bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-900 font-bold focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
