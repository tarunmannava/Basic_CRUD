import React from 'react';
import { Layers, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ isOnline, onRefresh, loading }) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <Layers size={22} />
        </div>
        <div>
          <h1 className="brand-title">Task Hub API</h1>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="nav-status">
          <div className={`status-dot ${isOnline ? '' : 'offline'}`} />
          <span>{isOnline ? 'FastAPI Connected' : 'API Offline'}</span>
        </div>

        <button 
          className="btn-icon" 
          onClick={onRefresh} 
          disabled={loading}
          title="Refresh Data"
        >
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
        </button>
      </div>
    </header>
  );
}
