import { useEffect, useRef } from 'react';

export default function ActionModal({ isOpen, title, message, onClose, onConfirm }) {
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-sm surface-glass p-6 rounded-xl border border-outline-variant/50 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="font-headline-md text-xl text-on-surface mb-2">{title}</h3>
        <p className="font-body-sm text-on-surface-variant mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded font-label-mono text-sm text-on-surface-variant hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded font-label-mono text-sm primary-gradient text-on-primary font-bold hover:shadow-[0_0_15px_rgba(107,216,203,0.5)] transition-all cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
