// components/client/ui/LoadingSpinner.jsx

import React from 'react';

export default function LoadingSpinner({ message = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div 
        className="w-10 h-10 border-4 rounded-full animate-spin"
        style={{
          borderColor: 'var(--standard-off-white)',
          borderTopColor: 'var(--primary)',
          borderRightColor: 'var(--primary)',
        }}
      />
      {message && (
        <p className="text-sm text-[var(--secondary-text)]">{message}</p>
      )}
    </div>
  );
}