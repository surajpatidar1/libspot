import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = toast.type === 'error' ? AlertCircle : toast.type === 'info' ? Info : CheckCircle;
        const borderCol = toast.type === 'error' ? 'border-red-500/40' : toast.type === 'info' ? 'border-slateTeal/50' : 'border-emerald-500/40';
        const iconCol = toast.type === 'error' ? 'text-red-400' : toast.type === 'info' ? 'text-slate-300' : 'text-emerald-400';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-2xl bg-midnight/95 backdrop-blur-md border ${borderCol} text-white animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 shrink-0 ${iconCol}`} />
              <span className="text-xs sm:text-sm font-medium text-slate-100">{toast.message}</span>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-white p-1 ml-2 transition-colors"
                aria-label="Close toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
