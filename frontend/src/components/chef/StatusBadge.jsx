

import React from 'react';
import { getStatusConfig } from '../../styles/formatters';

export default function StatusBadge({ status }) {
  const config = getStatusConfig(status);
  
  return (
    <span 
      className="px-3 py-1 text-xs font-semibold rounded-full border"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
    >
      {config.label}
    </span>
  );
}