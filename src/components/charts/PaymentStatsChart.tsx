import React from 'react';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Ban } from 'lucide-react';

export const PaymentStatsChart: React.FC = () => {
  // Statistics: Paid 74%, Pending 15%, Overdue 8%, Blocked 3%
  const stats = [
    { label: 'Paid (To‘langan)', count: 218, percent: 74, color: 'bg-emerald-500', barBg: 'bg-emerald-100', icon: CheckCircle2, text: 'text-emerald-700' },
    { label: 'Pending (Kutilmoqda)', count: 44, percent: 15, color: 'bg-amber-500', barBg: 'bg-amber-100', icon: Clock, text: 'text-amber-700' },
    { label: 'Overdue (Kechikkan)', count: 23, percent: 8, color: 'bg-rose-500', barBg: 'bg-rose-100', icon: AlertCircle, text: 'text-rose-700' },
    { label: 'Blocked (Bloklangan)', count: 9, percent: 3, color: 'bg-gray-500', barBg: 'bg-gray-200', icon: Ban, text: 'text-gray-700' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E9EAF3] shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#5C42FD]/10 text-[#5C42FD]">
            <CreditCard className="w-4 h-4" />
          </span>
          <h3 className="text-base font-bold text-gray-900">
            To‘lov Holatlari Statistikasi
          </h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Joriy oy uchun barcha o‘quvchilarning to‘lov holati taqsimoti
        </p>
      </div>

      {/* Progress Multi-Bar */}
      <div className="my-5">
        <div className="h-4 w-full rounded-full overflow-hidden flex bg-gray-100 gap-0.5">
          {stats.map((s, i) => (
            <div
              key={i}
              style={{ width: `${s.percent}%` }}
              className={`${s.color} h-full transition-all duration-300 hover:opacity-90`}
              title={`${s.label}: ${s.percent}%`}
            />
          ))}
        </div>

        {/* Detailed Breakdown */}
        <div className="mt-5 space-y-3">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-gray-600 font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{item.count} nafar</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${item.barBg} ${item.text}`}>
                    {item.percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>To‘lov yig‘ilish sur’ati:</span>
        <span className="font-bold text-[#5C42FD]">89.2% (Normada)</span>
      </div>
    </div>
  );
};
