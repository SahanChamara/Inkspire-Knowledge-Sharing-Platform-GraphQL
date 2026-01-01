import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-600" size={20} />,
    error: <AlertCircle className="text-red-600" size={20} />,
    info: <Info className="text-blue-600" size={20} />,
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${backgrounds[type]} animate-slide-in`}>
      {icons[type]}
      <p className="text-sm font-medium text-gray-900 flex-1">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/50 rounded transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};
