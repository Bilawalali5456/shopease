import { createContext, useContext, useState, useCallback } from 'react';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineInformationCircle, HiOutlineX } from 'react-icons/hi';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    // Auto-dismiss after 3s
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => removeToast(id), 300);
    }, 3000);
  }, [removeToast]);

  const icons = {
    success: <HiOutlineCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />,
    error: <HiOutlineXCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    info: <HiOutlineInformationCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />,
  };

  const bgColors = {
    success: 'border-green-500/30 bg-green-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 ${
              bgColors[toast.type] || bgColors.info
            } ${
              toast.exiting
                ? 'opacity-0 translate-x-8'
                : 'opacity-100 translate-x-0 animate-slide-in-right'
            }`}
          >
            {icons[toast.type] || icons.info}
            <p className="text-sm text-white font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-dark-300 hover:text-white transition-colors flex-shrink-0"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
