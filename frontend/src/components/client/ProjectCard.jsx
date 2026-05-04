import React from "react";

const STATUS_CONFIG = {
  en_cours: { label: 'En cours', color: 'var(--primary)', bg: 'rgba(0, 115, 207, 0.12)' },
  termine:  { label: 'Terminé',  color: 'var(--success)', bg: 'rgba(40, 167, 69, 0.12)' },
  en_pause: { label: 'En pause', color: 'var(--warning)', bg: 'rgba(255, 193, 7, 0.15)' },
  annule:   { label: 'Annulé',   color: 'var(--error)',   bg: 'rgba(220, 53, 69, 0.12)' },
};

const ProjectCard = ({ project }) => {
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.en_cours;

  return (
    <article className="bg-[var(--white)] rounded-xl border border-[var(--border)] p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      
      {/* En-tête */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-[var(--text)] leading-tight">
          {project.name}
        </h3>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide"
          style={{ color: status.color, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
      </div>

      {/* Client */}
      <p className="text-sm text-[var(--secondary-text)] mb-4">
        👤 <span className="font-medium">{project.client}</span>
      </p>

      {/* Progression */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--gris)]">Progression</span>
          <span className="font-medium text-[var(--text)]">
            {project.progress}%
          </span>
        </div>

        <div className="w-full bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${project.progress}%`,
              backgroundColor: 'var(--primary)'
            }}
          />
        </div>
      </div>

      {/* Infos */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
        
        <div className="flex flex-col">
          <span className="text-xs text-[var(--gris)]">💰 Budget</span>
          <span className="text-sm font-bold text-[var(--secondary)]">
            {Number(project.budget).toLocaleString('fr-FR')} €
          </span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-xs text-[var(--gris)]">📅 Échéance</span>
          <span className="text-sm font-medium text-[var(--secondary-text)]">
            {new Date(project.deadline).toLocaleDateString('fr-FR')}
          </span>
        </div>

      </div>
    </article>
  );
};

export default ProjectCard;