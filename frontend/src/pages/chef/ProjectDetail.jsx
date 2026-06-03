import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  getProjectDetailChef,
  addProjectUpdate,
  updateProjectStatus,
  updateProjectProgress,
  getProjectUpdatesHistory,
  getProjectProgressStats,
} from '../../services/api';

import {
  HiArrowLeft, HiEnvelope, HiPhone, HiUser, HiHashtag,
  HiChatBubbleLeft, HiPencilSquare, HiClipboardDocumentList,
  HiUserGroup, HiArrowPath, HiInbox, HiExclamationTriangle,
  HiMagnifyingGlass, HiXMark, HiPlus, HiCheckCircle,
  HiChartBar, HiCalendarDays, HiArrowTrendingUp, HiBolt,
  HiDocumentArrowUp, HiClock, HiBuildingOffice, HiMapPin,
} from 'react-icons/hi2';

/* ─── getUserId ─── */
const getUserId = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.id || decoded.userId || decoded.sub;
    }
  } catch (e) { console.error('Token invalide:', e); }
  return localStorage.getItem('userId');
};

/* ─── Formatters ─── */
const formatBudget = (v) =>
  v == null ? 'Non défini'
  : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : 'Non disponible';

const formatDateShort = (d) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';

/* ─── Configs ─── */
const STATUS_CONFIG = {
  PLANNED:     { label: 'Planifié',  dot: '#3b82f6', bg: '#dbeafe', text: '#1e3a8a', border: '#bfdbfe' },
  IN_PROGRESS: { label: 'En cours',  dot: '#f97316', bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' },
  COMPLETED:   { label: 'Terminé',   dot: '#22c55e', bg: '#dcfce7', text: '#14532d', border: '#bbf7d0' },
};

const SERVICE_LABELS = {
  MACONNERIE:              'Maçonnerie',
  RENOVATION:              'Rénovation',
  RESTAURATION:            'Restauration',
  CONSTRUCTION_GENERALE:   'Construction Générale',
  REJOINTOIEMENT_RUSTIQUE: 'Rejointoiement Rustique',
  TRAITEMENT_HYDROFUGE:    'Traitement Hydrofuge',
  DEMOUSSAGE:              'Démoussage',
};

const UPDATE_TYPE_CONFIG = {
  'state change': { label: 'Statut',      bg: '#dbeafe', text: '#1d4ed8', icon: '🔄' },
  progress:       { label: 'Avancement',  bg: '#dcfce7', text: '#15803d', icon: '📈' },
  comment:        { label: 'Commentaire', bg: '#fef9c3', text: '#854d0e', icon: '💬' },
  document:       { label: 'Document',    bg: '#f3e8ff', text: '#7e22ce', icon: '📎' },
};

const STATUSES = [
  { value: 'PLANNED',     label: 'Planifié', icon: '📋' },
  { value: 'IN_PROGRESS', label: 'En cours', icon: '🔧' },
  { value: 'COMPLETED',   label: 'Terminé',  icon: '✅' },
];

const getStatusCfg     = (s) => STATUS_CONFIG[s] || { label: s || 'Inconnu', dot: '#9ca3af', bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
const getServiceLabel  = (k) => {
  if (!k) return 'Non défini';
  if (Array.isArray(k)) return k.map(s => SERVICE_LABELS[s] || s).join(', ');
  return SERVICE_LABELS[k] || k;
};
const getUpdateTypeCfg = (t) => UPDATE_TYPE_CONFIG[t] || { label: t, bg: '#f3f4f6', text: '#374151', icon: '•' };

/* ─── Feedback ─── */
const Feedback = ({ feedback }) => {
  if (!feedback) return null;
  return (
    <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${
      feedback.type === 'success'
        ? 'bg-green-50 text-green-700 border-green-200'
        : 'bg-red-50 text-red-700 border-red-200'
    }`}>
      {feedback.type === 'success'
        ? <HiCheckCircle className="w-4 h-4 text-green-500 shrink-0" />
        : <HiExclamationTriangle className="w-4 h-4 text-red-500 shrink-0" />}
      {feedback.message}
    </div>
  );
};

/* ─── AnimatedCounter ─── */
const AnimatedCounter = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const target = Number(value) || 0;
    let start = 0;
    const step = target / 30;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
};

/* ─── ProgressRing ─── */
const ProgressRing = ({ value, size = 120, stroke = 10 }) => {
  const num    = Math.min(100, Math.max(0, Number(value) || 0));
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (num / 100) * circ;
  const color  = num >= 80 ? '#22c55e' : num >= 50 ? '#3b82f6' : num >= 25 ? '#f97316' : '#ef4444';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black" style={{ color }}>{num}%</span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Progression</span>
      </div>
    </div>
  );
};

/* ─── ProgressBar ─── */
const ProgressBar = ({ value, height = 8, showLabel = false, animated = true }) => {
  const [width, setWidth] = useState(0);
  const num   = Math.min(100, Math.max(0, Number(value) || 0));
  const color = num >= 80 ? 'from-emerald-500 to-green-400'
              : num >= 50 ? 'from-blue-500 to-cyan-400'
              : num >= 25 ? 'from-orange-400 to-amber-400'
              :             'from-red-400 to-orange-400';
  useEffect(() => {
    if (animated) setTimeout(() => setWidth(num), 100);
    else setWidth(num);
  }, [num, animated]);
  return (
    <div className="w-full rounded-full overflow-hidden bg-gray-100" style={{ height }}>
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full flex items-center justify-end pr-2`}
        style={{ width: `${animated ? width : num}%`, transition: animated ? 'width 1s cubic-bezier(0.4,0,0.2,1)' : 'none' }}
      >
        {showLabel && num > 20 && <span className="text-[9px] font-bold text-white">{num}%</span>}
      </div>
    </div>
  );
};

/* ─── StatusBadge ─── */
const StatusBadge = ({ status, size = 'sm' }) => {
  const cfg = getStatusCfg(status);
  const px  = size === 'lg' ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 ${px} rounded-full font-semibold border`}
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

/* ─── DocModal ─── */
const DocModal = ({ projectId, userId, onClose, onSuccess }) => {
  const [file,       setFile]       = useState(null);
  const [note,       setNote]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback,   setFeedback]   = useState(null);
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    if (!note.trim() && !file) {
      setFeedback({ type: 'error', message: 'Ajoutez une note ou sélectionnez un fichier.' });
      return;
    }
    try {
      setSubmitting(true); setFeedback(null);
      await addProjectUpdate(userId, projectId, {
        updateType: 'document',
        details: note.trim() || (file ? `Document ajouté : ${file.name}` : 'Document ajouté'),
        progress: 0,
      });
      setFeedback({ type: 'success', message: 'Document enregistré !' });
      setTimeout(() => { onSuccess(); onClose(); }, 900);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || "Erreur lors de l'ajout." });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#f16c13' }}>
              <HiDocumentArrowUp className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">Ajouter un document</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <HiXMark className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all group"
          >
            <HiDocumentArrowUp className="w-10 h-10 text-gray-300 group-hover:text-orange-400 mx-auto mb-2 transition-colors" />
            {file
              ? <p className="text-sm font-medium text-gray-700">{file.name}</p>
              : <>
                  <p className="text-sm font-medium text-gray-500">Cliquez pour sélectionner un fichier</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, images, Word, Excel…</p>
                </>}
            <input ref={inputRef} type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Note / Description</label>
            <textarea rows={3} placeholder="Décrivez ce document..."
              value={note} onChange={e => setNote(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-orange-400 resize-none transition-all" />
          </div>

          <Feedback feedback={feedback} />
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
            style={{ background: '#f16c13' }}>
            {submitting
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <HiDocumentArrowUp className="w-4 h-4" />}
            {submitting ? 'Envoi...' : 'Enregistrer le document'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── UpdateModal — 3 onglets indépendants ─── */
const UpdateModal = ({ projectId, userId, currentStatus, currentProgress, onClose, onSuccess }) => {
  const [tab,        setTab]        = useState('update');
  const [submitting, setSubmitting] = useState(false);
  const [feedback,   setFeedback]   = useState(null);

  /* tab: update — type fixé à 'comment' */
  const [details, setDetails] = useState('');

  /* tab: progress */
  const [progress, setProgress] = useState(currentProgress ?? 0);

  /* tab: status */
  const [newStatus,  setNewStatus]  = useState(currentStatus);
  const [statusNote, setStatusNote] = useState('');

  const switchTab = (t) => { setTab(t); setFeedback(null); };

  /* ── submit: commentaire ── */
  const handleSubmitUpdate = async () => {
    if (!details.trim()) {
      setFeedback({ type: 'error', message: 'Veuillez renseigner le commentaire.' });
      return;
    }
    try {
      setSubmitting(true); setFeedback(null);
      await addProjectUpdate(userId, projectId, {
        updateType: 'comment',
        details: details.trim(),
        progress: 0,
      });
      setFeedback({ type: 'success', message: 'Commentaire ajouté !' });
      setTimeout(() => { onSuccess(); onClose(); }, 900);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || "Erreur lors de l'ajout." });
    } finally { setSubmitting(false); }
  };

  /* ── submit: progress ── */
  const handleSubmitProgress = async () => {
    try {
      setSubmitting(true); setFeedback(null);
      await updateProjectProgress(userId, projectId, Number(progress));
      setFeedback({ type: 'success', message: 'Progression mise à jour !' });
      setTimeout(() => { onSuccess(); onClose(); }, 900);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Erreur lors de la mise à jour.' });
    } finally { setSubmitting(false); }
  };

  /* ── submit: status — note obligatoire ── */
  const handleSubmitStatus = async () => {
    if (!statusNote.trim()) {
      setFeedback({ type: 'error', message: 'La note est obligatoire.' });
      return;
    }
    try {
      setSubmitting(true); setFeedback(null);
      if (newStatus !== currentStatus) {
        await updateProjectStatus(userId, projectId, newStatus);
      }
      await addProjectUpdate(userId, projectId, {
        updateType: 'state change',
        details: statusNote.trim(),
        progress: 0,
      });
      setFeedback({ type: 'success', message: 'Statut mis à jour !' });
      setTimeout(() => { onSuccess(); onClose(); }, 900);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Erreur lors de la mise à jour.' });
    } finally { setSubmitting(false); }
  };

  const submitFns = { update: handleSubmitUpdate, progress: handleSubmitProgress, status: handleSubmitStatus };

  const TABS = [
    { key: 'update',   emoji: '💬', label: 'Commentaire' },
    { key: 'progress', emoji: '📈', label: 'Progression'  },
    { key: 'status',   emoji: '🔄', label: 'Statut'       },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <HiPencilSquare className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">Modifier le projet</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <HiXMark className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50">
          {TABS.map(t => (
            <button key={t.key}
              onClick={() => switchTab(t.key)}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
                tab === t.key
                  ? 'bg-white border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}>
              <span>{t.emoji}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">

          {/* ── TAB: Commentaire ── */}
          {tab === 'update' && (
            <>
              {/* Badge type fixe */}
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                <span className="text-base">💬</span>
                <span className="text-xs font-semibold text-yellow-800">Commentaire</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Commentaire <span className="text-red-500">*</span>
                </label>
                <textarea rows={4} placeholder="Écrivez votre commentaire..."
                  value={details} onChange={e => setDetails(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none transition-all" />
              </div>
            </>
          )}

          {/* ── TAB: Progression ── */}
          {tab === 'progress' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Progression actuelle</span>
                <span className="text-3xl font-black text-blue-600">{progress}%</span>
              </div>

              <input
                type="range" min="0" max="100" step="1"
                value={progress}
                onChange={e => setProgress(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <ProgressBar value={progress} height={14} showLabel animated={false} />

              <div className="flex justify-between text-xs text-gray-300 -mt-2">
                <span>0%</span><span>50%</span><span>100%</span>
              </div>

              <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3 border border-gray-100 leading-relaxed">
                Met à jour <code className="bg-white px-1 rounded border border-gray-200">project.progress</code> en base
                et enregistre un historique de type "Avancement".
              </p>
            </>
          )}

          {/* ── TAB: Statut ── */}
          {tab === 'status' && (
            <>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400">Statut actuel :</span>
                <StatusBadge status={currentStatus} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Nouveau statut</label>
                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.map(s => (
                    <button key={s.value} type="button"
                      onClick={() => setNewStatus(s.value)}
                      className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-all ${
                        newStatus === s.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                      }`}>
                      <span className="text-xl">{s.icon}</span>
                      <span>{s.label}</span>
                      {newStatus === s.value && <HiCheckCircle className="w-3.5 h-3.5 text-green-500" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Note <span className="text-red-500">*</span>
                </label>
                <textarea rows={3} placeholder="Raison du changement..."
                  value={statusNote} onChange={e => setStatusNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none transition-all" />
              </div>

              {/* Résumé */}
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl space-y-1.5">
                <p className="text-xs font-semibold text-amber-700">Ce qui sera appliqué :</p>
                {newStatus !== currentStatus
                  ? <p className="text-xs text-amber-600">✓ Statut → <strong>{STATUSES.find(s => s.value === newStatus)?.label}</strong></p>
                  : <p className="text-xs text-gray-400">— Pas de changement de statut</p>}
                {statusNote.trim() && <p className="text-xs text-amber-600">✓ Note enregistrée</p>}
              </div>
            </>
          )}

          <Feedback feedback={feedback} />
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Annuler
          </button>
          <button onClick={submitFns[tab]} disabled={submitting}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
            {submitting
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <HiBolt className="w-4 h-4 text-yellow-300" />}
            {submitting ? 'Envoi...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── ProgressStats ─── */
const ProgressStats = ({ projectId, currentProgress }) => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    if (!userId || !projectId) return;
    (async () => {
      try {
        const data = await getProjectProgressStats(userId, projectId);
        setStats(data.stats ?? data);
      } catch (err) {
        console.warn('Stats non disponibles:', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const progress     = stats?.currentProgress ?? stats?.progress ?? currentProgress ?? 0;
  const totalUpdates = stats?.totalUpdates    ?? stats?.updatesCount ?? null;
  const avgProgress  = stats?.averageProgress ?? null;
  const lastUpdate   = stats?.lastUpdateDate  ?? stats?.lastUpdate  ?? null;
  const startDate    = stats?.startDate       ?? stats?.createdAt   ?? null;
  const estimatedEnd = stats?.estimatedEnd    ?? stats?.deadline    ?? null;

  if (loading) return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="flex gap-4">
          <div className="w-28 h-28 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-3 pt-2">
            {[...Array(3)].map((_, i) => <div key={i} className="h-3 bg-gray-200 rounded" />)}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <HiChartBar className="w-5 h-5 text-blue-500" />
        Statistiques de progression
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-5">
        <div className="shrink-0">
          <ProgressRing value={progress} size={130} stroke={12} />
        </div>
        <div className="flex-1 w-full space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span className="font-medium">Progression globale</span>
              <span className="font-bold text-blue-600">{Number(progress)}%</span>
            </div>
            <ProgressBar value={progress} height={10} animated />
          </div>
          {avgProgress !== null && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Progression moyenne</span>
                <span className="font-semibold text-gray-600">{Number(avgProgress).toFixed(1)}%</span>
              </div>
              <ProgressBar value={avgProgress} height={6} animated />
            </div>
          )}
        </div>
      </div>

      {totalUpdates !== null && (
        <div className="mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100 inline-block min-w-[80px]">
            <p className="text-2xl font-black text-blue-700"><AnimatedCounter value={totalUpdates} /></p>
            <p className="text-xs text-blue-500 mt-0.5">Mises à jour</p>
          </div>
        </div>
      )}

      {(lastUpdate || startDate || estimatedEnd) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {startDate && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <HiCalendarDays className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Début</p>
                <p className="text-xs font-semibold text-gray-700">{formatDateShort(startDate)}</p>
              </div>
            </div>
          )}
          {lastUpdate && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <HiArrowPath className="w-4 h-4 text-orange-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Dernière MÀJ</p>
                <p className="text-xs font-semibold text-gray-700">{formatDateShort(lastUpdate)}</p>
              </div>
            </div>
          )}
          {estimatedEnd && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <HiClock className="w-4 h-4 text-green-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Fin estimée</p>
                <p className="text-xs font-semibold text-gray-700">{formatDateShort(estimatedEnd)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

/* ─── ChefProjectDetail ─── */
const ChefProjectDetail = () => {
  const { projectId } = useParams();
  const navigate      = useNavigate();

  const [project,   setProject]   = useState(null);
  const [updates,   setUpdates]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDoc,   setShowDoc]   = useState(false);
  const [statsKey,  setStatsKey]  = useState(0);

  const currentProgress = (() => {
    const fromUpdates = [...updates]
      .reverse()
      .find(u => u.progress !== null && u.progress !== undefined && u.progress > 0)
      ?.progress;
    if (fromUpdates !== undefined) return fromUpdates;
    if (project?.progress !== undefined && project.progress !== null) return project.progress;
    return null;
  })();

  const fetchProject = useCallback(async () => {
    const userId = getUserId();
    if (!userId || !projectId) return;
    try {
      setLoading(true);
      const data = await getProjectDetailChef(projectId, userId);
      const p = data.project ?? data;
      setProject(p);
      if (Array.isArray(p.updates) && p.updates.length > 0) setUpdates(p.updates);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchUpdates = useCallback(async () => {
    const userId = getUserId();
    if (!userId || !projectId) return;
    try {
      const data = await getProjectUpdatesHistory(userId, projectId);
      const list = Array.isArray(data) ? data : (data.updates ?? data.data ?? data.history ?? []);
      setUpdates(list);
    } catch (err) {
      console.warn('Updates non disponibles:', err.message);
    }
  }, [projectId]);

  const handleSuccess = useCallback(async () => {
    await fetchProject();
    await fetchUpdates();
    setStatsKey(k => k + 1);
  }, [fetchProject, fetchUpdates]);

  useEffect(() => {
    fetchProject();
    fetchUpdates();
  }, [fetchProject, fetchUpdates]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Chargement du projet…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center border border-gray-200">
        <HiExclamationTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
        <p className="text-gray-400 text-sm mb-6">{error}</p>
        <button onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium text-sm border border-gray-200 transition-colors">
          ← Retour
        </button>
      </div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <HiMagnifyingGlass className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-400">Projet non trouvé</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-medium text-sm hover:opacity-80">← Retour</button>
      </div>
    </div>
  );

  const progressToShow = currentProgress !== null && currentProgress > 0 ? currentProgress : null;
  const userId = getUserId();

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-8">

      {showModal && (
        <UpdateModal
          projectId={projectId}
          userId={userId}
          currentStatus={project.status}
          currentProgress={currentProgress ?? 0}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
      {showDoc && (
        <DocModal
          projectId={projectId}
          userId={userId}
          onClose={() => setShowDoc(false)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <HiArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{project.title}</h1>
              <p className="text-[11px] text-gray-400 font-mono truncate">#{project.id?.slice(0, 8)}…</p>
            </div>
            <StatusBadge status={project.status} />
            <button onClick={() => setShowDoc(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              style={{ background: '#f16c13' }}>
              <HiPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Doc</span>
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
              <HiPencilSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Modifier</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Informations */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <HiClipboardDocumentList className="w-5 h-5 text-indigo-500" />
            Informations du projet
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="rounded-xl p-4 border" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#15803d' }}>Budget</p>
              <p className="text-lg font-black mt-1" style={{ color: '#166534' }}>{formatBudget(project.budget)}</p>
            </div>
            <div className="rounded-xl p-4 border bg-gray-50 border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Service</p>
              <p className="text-sm font-bold text-gray-800 mt-1 leading-tight">{getServiceLabel(project.services)}</p>
            </div>
            <div className="rounded-xl p-4 border bg-gray-50 border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Statut</p>
              <div className="mt-1.5"><StatusBadge status={project.status} /></div>
            </div>
            <div className="rounded-xl p-4 border bg-gray-50 border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Progression</p>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {progressToShow !== null ? `${Number(progressToShow)}%` : '0%'}
              </p>
            </div>
          </div>

          {progressToShow !== null && (
            <div className="mb-5 p-4 rounded-xl border" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-blue-700 flex items-center gap-1.5">
                  <HiArrowTrendingUp className="w-4 h-4 text-blue-500" />
                  Progression actuelle
                </span>
                <span className="text-3xl font-black text-blue-700">{Number(progressToShow)}%</span>
              </div>
              <ProgressBar value={progressToShow} height={16} showLabel animated />
              <div className="flex justify-between text-xs text-blue-400 mt-2">
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Description</label>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
              {project.description || 'Aucune description renseignée.'}
            </p>
          </div>
        </section>

        {/* Statistiques */}
        <ProgressStats key={statsKey} projectId={projectId} currentProgress={progressToShow} />

        {/* Chef */}
        {project.chef && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HiUserGroup className="w-5 h-5 text-violet-500" />
              Chef de projet
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {project.chef.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{project.chef.name}</p>
                  <p className="text-sm text-gray-400">Matricule : {project.chef.matricule || 'N/A'}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <a href={`mailto:${project.chef.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <HiEnvelope className="w-4 h-4 text-blue-500" />{project.chef.email}
                </a>
                <a href={`tel:${project.chef.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                  <HiPhone className="w-4 h-4 text-green-500" />{project.chef.phone}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Client */}
        {project.client && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HiUser className="w-5 h-5 text-indigo-500" />
              Client
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                  {project.client.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{project.client.name}</p>
                  <div className="mt-2 space-y-1.5">
                    <a href={`mailto:${project.client.email}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      <HiEnvelope className="w-4 h-4 text-blue-500 shrink-0" />{project.client.email}
                    </a>
                    <a href={`tel:${project.client.phone}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
                      <HiPhone className="w-4 h-4 text-green-500 shrink-0" />{project.client.phone}
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                {project.client.companyName && (
                  <div className="flex items-center gap-2">
                    <HiBuildingOffice className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Entreprise</p>
                      <p className="text-sm text-gray-700">{project.client.companyName}</p>
                    </div>
                  </div>
                )}
                {project.client.address && (
                  <div className="flex items-center gap-2">
                    <HiMapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Adresse</p>
                      <p className="text-sm text-gray-700">{project.client.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Mises à jour */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <HiArrowPath className="w-5 h-5 text-orange-500" />
              Mises à jour
              {updates.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                  {updates.length}
                </span>
              )}
            </h2>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors">
              <HiPlus className="w-3.5 h-3.5" />
              Ajouter
            </button>
          </div>

          {updates.length > 0 ? (
            <ul className="space-y-3">
              {[...updates].reverse().map((update, index) => {
                const tc = getUpdateTypeCfg(update.updateType || update.type);
                const pv = update.progress !== null && update.progress !== undefined && update.progress > 0
                  ? Number(update.progress) : null;

                return (
                  <li key={update.id || index}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                          {updates.length - index}
                        </span>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full border"
                          style={{ background: tc.bg, color: tc.text, borderColor: tc.bg }}>
                          {tc.icon} {tc.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <HiClock className="w-3 h-3" />
                        {formatDate(update.timestamp || update.createdAt || update.date)}
                      </span>
                    </div>

                    <div className="space-y-2.5 pl-9">
                      {(update.details || update.message || update.content || update.description) && (
                        <p className="text-sm text-gray-600">
                          {update.details || update.message || update.content || update.description}
                        </p>
                      )}

                      {pv !== null && !isNaN(pv) && (
                        <div className="pt-1">
                          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                            <span>Progression à cette étape</span>
                            <span className="font-bold text-blue-600">{pv}%</span>
                          </div>
                          <ProgressBar value={pv} height={8} animated={false} />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100 text-xs text-gray-300">
                        {update.updatedBy && (
                          <span className="flex items-center gap-1">
                            <HiUser className="w-3 h-3 text-cyan-400" />
                            <code className="bg-white px-1.5 py-0.5 rounded border border-gray-100 text-gray-400">
                              {update.updatedBy.slice(0, 8)}…
                            </code>
                          </span>
                        )}
                        {update.id && (
                          <span className="flex items-center gap-1">
                            <HiHashtag className="w-3 h-3 text-violet-300" />
                            <code className="bg-white px-1.5 py-0.5 rounded border border-gray-100 text-gray-400">
                              {update.id.slice(0, 6)}…
                            </code>
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-12">
              <HiInbox className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucune mise à jour pour le moment.</p>
              <button onClick={() => setShowModal(true)} className="mt-3 text-sm text-blue-600 hover:underline font-medium">
                Ajouter la première mise à jour →
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Barre mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 sm:hidden z-20 shadow-lg">
        <div className="flex gap-2">
          <button onClick={() => setShowDoc(true)}
            className="px-4 py-3 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
            style={{ background: '#f16c13' }}>
            <HiDocumentArrowUp className="w-4 h-4" />
            Doc
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
            <HiPencilSquare className="w-4 h-4" />
            Modifier le projet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChefProjectDetail;