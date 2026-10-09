import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { DirectorLayout } from './components/layout/DirectorLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TeachersPage } from './pages/TeachersPage';
import { StudentsPage } from './pages/StudentsPage';
import { GroupsPage } from './pages/GroupsPage';
import { CoursesPage } from './pages/CoursesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { TeacherSalaryPage } from './pages/TeacherSalaryPage';
import { ReportsPage } from './pages/ReportsPage';
import { ShopPage } from './pages/ShopPage';
import { OrdersPage } from './pages/OrdersPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Default redirect to Director Dashboard */}
          <Route path="/" element={<Navigate to="/director/dashboard" replace />} />
          <Route path="/director" element={<Navigate to="/director/dashboard" replace />} />

          {/* Director Panel Nested Routes */}
          <Route path="/director" element={<DirectorLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="teacher-salary" element={<TeacherSalaryPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/director/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
