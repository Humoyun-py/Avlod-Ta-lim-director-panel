import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

export const DirectorLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { info } = useToast();

  const handleLogout = () => {
    setLogoutModalOpen(false);
    info('Chiqish bajarildi', 'Director sessiyasi xavfsiz yakunlandi.');
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex text-[#1E1B39]">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogoutClick={() => setLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Topbar */}
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          onLogoutClick={() => setLogoutModalOpen(true)}
        />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Tizimdan chiqishni tasdiqlaysizmi?"
        message="Director panelidan chiqasiz. Qayta kirish uchun hisob ma'lumotlarini kiritishingiz lozim bo'ladi."
        confirmText="Chiqish"
        variant="warning"
        icon={LogOut}
      />
    </div>
  );
};
