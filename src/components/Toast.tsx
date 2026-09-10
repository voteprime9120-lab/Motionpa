import React from 'react';
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  toast: ToastNotification | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  const IconComponent =
    toast.type === 'warning'
      ? AlertCircle
      : toast.type === 'info'
      ? Info
      : CheckCircle2;

  return (
    <div
      id="archival-toast"
      className="fixed bottom-6 right-6 z-50 max-w-md bg-[#0e0e0e] p-4 flex items-start gap-4 transition-all duration-300 shadow-2xl border border-[#991b1b]/80 animate-in fade-in slide-in-from-bottom-5"
      style={{
        boxShadow: '0 10px 30px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(153, 27, 27, 0.4)'
      }}
    >
      <div className="w-8 h-8 rounded-full bg-[#991b1b] text-[#ffdad6] flex items-center justify-center flex-shrink-0 mt-0.5">
        <IconComponent className="w-4 h-4" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac]">
          VAULT PROTOCOL COMMITTED
        </span>
        <span className="font-serif text-[17px] text-[#e5e2e1] font-medium leading-snug truncate">
          {toast.title}
        </span>
        {toast.subtitle && (
          <span className="font-mono text-[11px] text-[#a88a86] mt-0.5 leading-relaxed">
            {toast.subtitle}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-[#a88a86] hover:text-[#e5e2e1] transition-colors p-1"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
