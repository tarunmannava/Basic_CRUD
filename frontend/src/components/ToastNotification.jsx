import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} color="var(--success)" />;
      case 'error': return <AlertCircle size={18} color="var(--danger)" />;
      default: return <Info size={18} color="var(--info)" />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          {getIcon(t.type)}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button 
            className="btn-icon" 
            onClick={() => onDismiss(t.id)}
            style={{ padding: '2px' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
