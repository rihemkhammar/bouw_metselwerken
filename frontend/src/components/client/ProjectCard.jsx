import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiTool, FiDollarSign, FiUser, FiMail, FiPhone,
  FiMapPin, FiCreditCard, FiHome, FiClock,
  FiChevronRight, FiTrendingUp, FiRefreshCw, FiBriefcase,
} from 'react-icons/fi';
import {
  formatCurrency, formatDate, getProgress,
  getStatusConfig, getServiceLabel,
} from '../../styles/formatters';
import StatusBadge from './StatusBadge';

export default function ProjectCard({ project }) {
  const progress = getProgress(project);
  const config = getStatusConfig(project.status);
  const [showAll, setShowAll] = useState(false);

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  const formatPhone = (phone) => {
    if (!phone) return '-';
    return phone.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const visibleUpdates = showAll ? project.updates : project.updates?.slice(0, 2);

  return (
    <article className="w-full min-w-0 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <div
        className="px-5 py-4 border-b"
        style={{ backgroundColor: config.bg, borderColor: config.border }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {project.title}
            </h3>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {project.description}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <FiTool className="text-gray-400 shrink-0" size={12} />
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/70 text-gray-500 border border-gray-200">
                {getServiceLabel(project.services)}
              </span>
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-4 flex flex-col gap-4 flex-1">

        {/* Budget */}
        <div className="flex items-center gap-2">
          <FiDollarSign className="text-blue-500 shrink-0" size={16} />
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(project.budget)}
          </span>
        </div>

        {/* Progress */}
        {project.status === 'IN_PROGRESS' && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <FiTrendingUp size={11} /> Progression
              </span>
              <span className="text-[11px] font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Chef de projet */}
        <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <FiBriefcase size={10} /> Chef de projet
          </p>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(project.chef?.name)}
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {project.chef?.name || 'Non assigné'}
              </p>
              {project.chef?.email && (
                <p className="flex items-center gap-1 text-xs text-gray-500 truncate">
                  <FiMail size={11} className="text-gray-400 shrink-0" />
                  {project.chef.email}
                </p>
              )}
              {project.chef?.phone && (
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <FiPhone size={11} className="text-gray-400 shrink-0" />
                  {formatPhone(project.chef.phone)}
                </p>
              )}
              {project.chef?.matricule && (
                <p className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                  <FiCreditCard size={11} className="text-gray-400 shrink-0" />
                  {project.chef.matricule}
                </p>
              )}
              {project.chef?.address && (
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <FiMapPin size={11} className="text-gray-400 shrink-0" />
                  {project.chef.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Client */}
        

        {/* Updates */}
        {project.updates?.length > 0 && (
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <FiRefreshCw size={10} /> Mises à jour
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">
                {project.updates.length}
              </span>
            </p>
            <div className="flex flex-col gap-2"> 
              {visibleUpdates.map((update) => (
                <div
                  key={update.id}
                  className="pl-3 border-l-2 border-blue-300 bg-gray-50 rounded-r-lg py-2 pr-3 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-blue-600">
                      {update.updateType}
                    </span>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <FiClock size={10} />
                      {formatDate(update.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{update.details}</p>
                  {update.progress !== undefined && (
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-gray-400">Avancement</span>
                      <span className="font-bold text-blue-600">{update.progress}%</span>
                    </div>
                  )}
                  {update.services && update.services !== project.services && (
                    <span className="self-start text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">
                      {getServiceLabel(update.services)}
                    </span>
                  )}
                </div>
              ))}
              {project.updates.length > 2 && (
                <button
                  onClick={() => setShowAll(v => !v)}
                  className="text-xs font-semibold text-blue-500 hover:text-blue-700 text-left transition-colors"
                >
                  {showAll ? 'Afficher moins ↑' : `+ ${project.updates.length - 2} autre(s) ↓`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3 flex items-center justify-between bg-gray-50 border-t border-gray-100">
        <span className="text-[11px] font-mono text-gray-400">
          #{project.id.slice(0, 8)}
        </span>
        <Link
          to={`/client/projeteDetail/${project.id}`}
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Voir détails <FiChevronRight size={14} />
        </Link>
      </div>
    </article>
  );
}