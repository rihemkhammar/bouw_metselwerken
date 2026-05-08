// components/client/projects/ProjectFilters.jsx

import React from 'react';

export default function ProjectFilters({ filter, onFilterChange, counts }) {
  const filters = [
    { key: 'ALL', label: 'Tous' },
    { key: 'PLANNED', label: 'Planifiés' },
    { key: 'IN_PROGRESS', label: 'En cours' },
    { key: 'COMPLETED', label: 'Terminés' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
          style={{
            backgroundColor: filter === key ? 'var(--primary)' : 'var(--standard-off-white)',
            color: filter === key ? 'var(--white)' : 'var(--text)',
            border: `1px solid ${filter === key ? 'var(--primary)' : 'var(--border)'}`,
          }}
          onMouseEnter={(e) => {
            if (filter !== key) {
              e.target.style.backgroundColor = 'var(--primary-light)';
              e.target.style.color = 'var(--white)';
            }
          }}
          onMouseLeave={(e) => {
            if (filter !== key) {
              e.target.style.backgroundColor = 'var(--standard-off-white)';
              e.target.style.color = 'var(--text)';
            }
          }}
        >
          {label}
          <span 
            className="px-2 py-0.5 text-xs rounded-full"
            style={{
              backgroundColor: filter === key ? 'rgba(255,255,255,0.2)' : 'var(--white)',
              color: filter === key ? 'var(--white)' : 'var(--gris)',
            }}
          >
            {counts[key] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}