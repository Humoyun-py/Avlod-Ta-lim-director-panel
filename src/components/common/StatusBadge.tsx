import React from 'react';
import { CheckCircle2, Clock, Ban, AlertCircle } from 'lucide-react';
import { PaymentStatus, UserStatus, OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: UserStatus | PaymentStatus | OrderStatus | 'in_stock' | 'low_stock' | 'out_of_stock' | 'active' | 'inactive' | 'archived' | 'planned' | 'processing';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'active':
    case 'paid':
    case 'Accepted':
    case 'Completed':
    case 'in_stock':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{status === 'active' ? 'Faol' : status === 'paid' ? 'To‘langan' : status === 'in_stock' ? 'Mavjud' : status}</span>
        </span>
      );

    case 'inactive':
    case 'blocked':
    case 'Rejected':
    case 'archived':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200 ${sizeClasses}`}>
          <Ban className="w-3 h-3 text-gray-500" />
          <span>{status === 'blocked' ? 'Bloklangan' : status === 'inactive' ? 'Nofaol' : status === 'Rejected' ? 'Rad etilgan' : 'Arxiv'}</span>
        </span>
      );

    case 'pending':
    case 'Pending':
    case 'processing':
    case 'planned':
    case 'low_stock':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 ${sizeClasses}`}>
          <Clock className="w-3 h-3 text-amber-600" />
          <span>{status === 'pending' || status === 'Pending' ? 'Kutilmoqda' : status === 'low_stock' ? 'Kam qolgan' : status === 'processing' ? 'Jarayonda' : 'Rejalashtirilgan'}</span>
        </span>
      );

    case 'overdue':
    case 'out_of_stock':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 ${sizeClasses}`}>
          <AlertCircle className="w-3 h-3 text-rose-600" />
          <span>{status === 'overdue' ? 'Muddati o‘tgan' : 'Tugagan'}</span>
        </span>
      );

    case 'blocked':
    case 'Rejected':
    case 'archived':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200 ${sizeClasses}`}>
          <Ban className="w-3 h-3 text-gray-500" />
          <span>{status === 'blocked' ? 'Bloklangan' : status === 'Rejected' ? 'Rad etilgan' : 'Arxiv'}</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-gray-100 text-gray-700 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
