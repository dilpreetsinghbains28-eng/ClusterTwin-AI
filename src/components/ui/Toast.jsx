import { useState, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => (prev || []).filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-20 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
        {(toasts || []).map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-2xl font-label-mono text-sm flex items-center gap-2 animate-in slide-in-from-right duration-300 ${
              toast.type === 'success'
                ? 'bg-primary/90 text-white border border-primary/50'
                : toast.type === 'error'
                  ? 'bg-error/90 text-white border border-error/50'
                  : 'surface-glass border border-outline-variant/50 text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
