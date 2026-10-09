import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  Shield,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  LogOut,
  CheckCircle2,
  DollarSign,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
  onLogoutClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick, onLogoutClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard Analytics';
    if (path.includes('teachers')) return 'Ustozlar Boshqaruvi';
    if (path.includes('students')) return 'O‘quvchilar Ro‘yxati';
    if (path.includes('groups')) return 'Akademik Guruhlar';
    if (path.includes('courses')) return 'O‘quv Dasturlari (Kurslar)';
    if (path.includes('payments')) return 'Moliyaviy To‘lovlar Nazorati';
    if (path.includes('teacher-salary')) return 'Ustozlar Oyligi & Foiz Taqsimoti';
    if (path.includes('reports')) return 'Akademiya Oylik Hisobotlari';
    if (path.includes('shop')) return 'Avlod Coin Do‘koni';
    if (path.includes('orders')) return 'Do‘kon Buyurtmalari';
    if (path.includes('settings')) return 'Tizim Sozlamalari';
    return 'Boshqaruv Paneli';
  };

  const notifications = [
    {
      id: 1,
      title: 'Yangi to‘lov qabul qilindi',
      desc: 'Azizbek Sobirov 1,200,000 so‘m (Payme) to‘ladi',
      time: '12 daqiqa oldin',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 2,
      title: 'Yangi mahsulot buyurtmasi',
      desc: 'Shahzoda Ergasheva — Hoodie (500 coin)',
      time: '1 soat oldin',
      icon: ShoppingBag,
      color: 'bg-indigo-50 text-[#5C42FD]'
    },
    {
      id: 3,
      title: 'Muddati o‘tgan to‘lov eslatmasi',
      desc: 'Diyorbek Karimov to‘lov muddati 12 kunga kechikmoqda',
      time: 'Bugun, 09:30',
      icon: CheckCircle2,
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <header className="h-18 bg-white border-b border-[#E9EAF3] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Menyu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">
            Avlod Ta'lim boshqaruv platformasi — Filial Bosh Ofisi
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tizim bo‘yicha qidiruv..."
            className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden transition-all"
          />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Bildirishnomalar"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E9EAF3] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Bildirishnomalar</h4>
                  <p className="text-[10px] text-gray-400">Yangi xabarnomalar</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[11px] text-[#5C42FD] font-semibold hover:underline"
                  >
                    O‘qilgan deb belgilash
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.map(n => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="px-4 py-3 hover:bg-[#F8F8FC] transition-colors flex items-start gap-3 cursor-pointer"
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${n.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                          {n.desc}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-2 border-t border-gray-100 text-center">
                <button
                  onClick={() => {
                    navigate('/director/reports');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-[#5C42FD] font-semibold hover:underline"
                >
                  Barcha hisobot va hodisalarni ko‘rish
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Director Profile Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5C42FD] to-[#806BFE] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              SR
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight">
                Sardor Rahmonov
              </span>
              <span className="text-[10px] text-[#5C42FD] font-semibold flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" /> Director
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#E9EAF3] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">Sardor Rahmonov</p>
                <p className="text-[11px] text-gray-500">director@avlodtalim.uz</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-[#5C42FD] text-[10px] font-bold">
                  Bosh Boshqaruvchi
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/director/settings');
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-[#F8F8FC] hover:text-[#5C42FD] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <SettingsIcon className="w-4 h-4 text-gray-400" />
                  <span>Tizim sozlamalari</span>
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogoutClick();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Tizimdan chiqish</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
