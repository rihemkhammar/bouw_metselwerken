

import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getProgress, getStatusConfig, getServiceLabel } from '../../styles/formatters';
import StatusBadge from './StatusBadge';

export default function ProjectCard({ project }) {
  const progress = getProgress(project);
  const config = getStatusConfig(project.status);
  
  // Générer les initiales du chef de projet
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CP';
  };

  return (
    <article 
      className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden hover:shadow-md transition-all duration-200 group"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Header avec statut */}
      <div 
        className="px-5 py-4 border-b"
        style={{ backgroundColor: config.bg, borderColor: config.border }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-[var(--text)] truncate">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--secondary-text)] line-clamp-2">
              {project.description}
            </p>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-5 py-4 space-y-4">
        
        {/* Budget & Service */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[var(--gris)]">💰</span>
            <span className="font-semibold text-[var(--text)]">
              {formatCurrency(project.budget)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--gris)]">🔧</span>
            <span className="text-[var(--secondary-text)]">
              {getServiceLabel(project.services)}
            </span>
          </div>
        </div>

        {/* Progress Bar (seulement si en cours) */}
        {project.status === 'IN_PROGRESS' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[var(--secondary-text)]">
              <span>Progression</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-[var(--standard-off-white)] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, var(--primary), var(--primary-light))'
                }}
              />
            </div>
          </div>
        )}

        {/* Chef de projet */}
        <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0"
            style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' 
            }}
          >
            {getInitials(project.chef?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text)] truncate">
              {project.chef?.name || 'Non assigné'}
            </p>
            <p className="text-xs text-[var(--gris)] truncate">
              {project.chef?.email || '-'}
            </p>
          </div>
        </div>

        {/* Dernière mise à jour */}
        {project.updates?.length > 0 && (
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs text-[var(--gris)] mb-1">
              Dernière MAJ • {formatDate(project.updates[0].timestamp)}
            </p>
            <p className="text-sm text-[var(--secondary-text)] line-clamp-1">
              {project.updates[0].details}
            </p>
          </div>
        )}
      </div>

      {/* Footer avec actions */}
      <div 
        className="px-5 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'var(--standard-off-white)', borderTop: `1px solid var(--border)` }}
      >
        <span className="text-xs text-[var(--gris)] font-mono">
          project id : #{project.id.slice(0, 8)}
        </span>
        <Link 
          to={`/client/projects/${project.id}`}
          className="text-sm font-medium transition-colors"
          style={{ color: 'var(--primary)' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--primary-light)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}
        >
          Voir détails →
        </Link>
      </div>
    </article>
  );
}