import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  getProjectDetailChef,
  addProjectUpdate,
  updateProjectStatus,
  getProjectUpdatesHistory,
  getProjectProgressStats,
} from '../../services/api';


import {
  HiArrowLeft,
  HiEnvelope,
  HiPhone,
  HiUser,
  HiHashtag,
  HiChatBubbleLeft,
  HiPencilSquare,
  HiClipboardDocumentList,
  HiUserGroup,
  HiArrowPath,
  HiInbox,
  HiExclamationTriangle,
  HiMagnifyingGlass,
  HiXMark,
  HiPlus,
  HiCheckCircle,
  HiChartBar,
  HiCalendarDays,
  HiArrowTrendingUp,
  HiBolt,
} from 'react-icons/hi2';

/* ─────────────────────────────────────────────
   Utilitaires
───────────────────────────────────────────── */
const getUserId = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.userId || decoded.id || decoded.sub;
    }
  } catch (e) {
    console.error('Token invalide:', e);
  }
  return localStorage.getItem('userId');
};

const formatBudget = (amount) => {
  if (amount === null || amount === undefined) return 'Non défini';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Non disponible';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const STATUS_CONFIG = {
  PENDING:     { label: 'En attente',  cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  PLANNED:     { label: 'Planifié',    cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  IN_PROGRESS: { label: 'En cours',    cls: 'bg-orange-100 text-orange-800 border-orange-200' },
  COMPLETED:   { label: 'Terminé',     cls: 'bg-green-100 text-green-800 border-green-200' },
  CANCELLED:   { label: 'Annulé',      cls: 'bg-red-100 text-red-800 border-red-200' },
};

const SERVICE_LABELS = {
  CONSTRUCTION_GENERALE: 'Construction Générale',
  RENOVATION:            'Rénovation',
  ELECTRICITE:           'Électricité',
  PLOMBERIE:             'Plomberie',
  PEINTURE:              'Peinture',
  TRAITEMENT_HYDROFUGE:  'Traitement Hydrofuge',
  DEMOUSSAGE:            'Démoussage',
};

const UPDATE_TYPE_CONFIG = {
  'state change': { label: 'Changement de statut', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  progress:       { label: 'Avancement',            cls: 'bg-green-100 text-green-800 border-green-200' },
  comment:        { label: 'Commentaire',            cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  document:       { label: 'Document ajouté',        cls: 'bg-purple-100 text-purple-800 border-purple-200' },
};

const STATUSES = [
  { value: 'PENDING',     label: 'En attente',  icon: '⏳' },
  { value: 'PLANNED',     label: 'Planifié',    icon: '📋' },
  { value: 'IN_PROGRESS', label: 'En cours',    icon: '🔧' },
  { value: 'COMPLETED',   label: 'Terminé',     icon: '✅' },
  { value: 'CANCELLED',   label: 'Annulé',      icon: '❌' },
];

const UPDATE_TYPES = [
  { value: 'progress',     label: 'Avancement' },
  { value: 'state change', label: 'Changement de statut' },
  { value: 'comment',      label: 'Commentaire' },
  { value: 'document',     label: 'Document ajouté' },
];

const SERVICES = Object.entries(SERVICE_LABELS).map(([value, label]) => ({ value, label }));

const getStatusConfig  = (s) => STATUS_CONFIG[s] || { label: s || 'Inconnu', cls: 'bg-gray-100 text-gray-800 border-gray-200' };
const getServiceLabel  = (k) => {
  if (!k) return 'Non défini';
  if (Array.isArray(k)) return k.map(s => SERVICE_LABELS[s] || s).join(', ');
  return SERVICE_LABELS[k] || k;
};
const getUpdateTypeCfg = (t) => UPDATE_TYPE_CONFIG[t] || { label: t, cls: 'bg-gray-100 text-gray-800 border-gray-200' };

/* ─────────────────────────────────────────────
   ProgressBar helper
───────────────────────────────────────────── */
const ProgressBar = ({ value, height = 'h-3', showLabel = false }) => {
  const num = Math.min(100, Math.max(0, Number(value) || 0));
  const color =
    num >= 80 ? 'from-green-500 to-emerald-400'
    : num >= 50 ? 'from-blue-500 to-cyan-400'
    : num >= 25 ? 'from-orange-400 to-yellow-400'
    :             'from-red-400 to-orange-400';
  return (
    <div className="w-full bg-gray-100 rounded-full overflow-hidden" style={{ height: height === 'h-3' ? 12 : height === 'h-2' ? 8 : 16 }}>
      <div
        className={`bg-gradient-to-r ${color} rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2`}
        style={{ width: `${num}%`, height: '100%' }}
      >
        {showLabel && num > 15 && (
          <span className="text-[10px] font-bold text-white">{num}%</span>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ProgressStats
───────────────────────────────────────────── */
const ProgressStats = ({ projectId }) => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId || !projectId) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getProjectProgressStats(userId, projectId);
        setStats(data.stats ?? data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  if (loading) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          {/* 📊 Statistiques — icône bleue */}
          <HiChartBar className="w-5 h-5 text-blue-500" />
          Statistiques de progression
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100 animate-pulse">
              <div className="h-3 bg-gray-200 rounded mb-3 w-2/3" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !stats) return null;

  const currentProgress = stats.currentProgress ?? stats.progress ?? stats.progressPercentage ?? null;
  const totalUpdates    = stats.totalUpdates ?? stats.updatesCount ?? stats.total ?? null;
  const lastUpdateDate  = stats.lastUpdateDate ?? stats.lastUpdate ?? stats.updatedAt ?? null;
  const statusChanges   = stats.statusChanges ?? stats.statusHistory ?? stats.statusCount ?? null;
  const progressUpdates = stats.progressUpdates ?? stats.progressHistory ?? stats.progressCount ?? null;
  const averageProgress = stats.averageProgress ?? stats.avgProgress ?? null;
  const startDate       = stats.startDate ?? stats.createdAt ?? null;
  const estimatedEnd    = stats.estimatedEnd ?? stats.estimatedEndDate ?? stats.deadline ?? null;
  const progressNum     = currentProgress !== null ? Number(currentProgress) : null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
        {/* 📊 icône bleue */}
        <HiChartBar className="w-5 h-5 text-blue-500" />
        Statistiques de progression
      </h2>

      {progressNum !== null && (
        <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-700 flex items-center gap-1.5">
              {/* 📈 icône tendance verte */}
              <HiArrowTrendingUp className="w-4 h-4 text-green-500" />
              Progression actuelle
            </span>
            <span className="text-2xl font-bold text-blue-700">{progressNum}%</span>
          </div>
          <ProgressBar value={progressNum} height="h-3" showLabel />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {totalUpdates !== null && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Mises à jour</p>
            <p className="text-2xl font-bold text-gray-800">{totalUpdates}</p>
          </div>
        )}
        {statusChanges !== null && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Changements statut</p>
            <p className="text-2xl font-bold text-gray-800">{statusChanges}</p>
          </div>
        )}
        {progressUpdates !== null && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Progrès updates</p>
            <p className="text-2xl font-bold text-gray-800">{progressUpdates}</p>
          </div>
        )}
        {averageProgress !== null && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Progrès moyen</p>
            <p className="text-2xl font-bold text-gray-800">{Number(averageProgress).toFixed(1)}%</p>
          </div>
        )}
      </div>

      {(lastUpdateDate || startDate || estimatedEnd) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {startDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
              {/* 📅 icône calendrier bleue */}
              <HiCalendarDays className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Début</p>
                <p className="font-medium">{formatDate(startDate)}</p>
              </div>
            </div>
          )}
          {lastUpdateDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
              {/* 🔄 icône refresh orange */}
              <HiArrowPath className="w-4 h-4 text-orange-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Dernière mise à jour</p>
                <p className="font-medium">{formatDate(lastUpdateDate)}</p>
              </div>
            </div>
          )}
          {estimatedEnd && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
              {/* 📅 icône calendrier verte (fin) */}
              <HiCalendarDays className="w-4 h-4 text-green-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Fin estimée</p>
                <p className="font-medium">{formatDate(estimatedEnd)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

/* ─────────────────────────────────────────────
   Modal — Modifier le projet
───────────────────────────────────────────── */
const UpdateModal = ({ projectId, userId, currentStatus, currentProgress, onClose, onSuccess }) => {
  const [tab,        setTab]        = useState('update');
  const [submitting, setSubmitting] = useState(false);
  const [feedback,   setFeedback]   = useState(null);

  const [updateForm, setUpdateForm] = useState({
    updateType: 'progress',
    details:    '',
    progress:   currentProgress ?? '',
    services:   [],
  });

  const [newStatus,      setNewStatus]      = useState(currentStatus);
  const [statusProgress, setStatusProgress] = useState(currentProgress ?? '');
  const [statusNote,     setStatusNote]     = useState('');

  const toggleService = (val) =>
    setUpdateForm(prev => ({
      ...prev,
      services: prev.services.includes(val)
        ? prev.services.filter(s => s !== val)
        : [...prev.services, val],
    }));

  const handleSubmitUpdate = async () => {
    if (!updateForm.details.trim()) {
      setFeedback({ type: 'error', message: 'Veuillez renseigner les détails.' });
      return;
    }
    try {
      setSubmitting(true);
      setFeedback(null);
      await addProjectUpdate(userId, projectId, {
        updateType: updateForm.updateType,
        details:    updateForm.details,
        progress:   updateForm.progress !== '' ? Number(updateForm.progress) : null,
        services:   updateForm.services,
      });
      setFeedback({ type: 'success', message: 'Mise à jour ajoutée avec succès !' });
      setTimeout(() => { onSuccess(); onClose(); }, 1000);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || "Erreur lors de l'ajout." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitStatus = async () => {
    const hasStatusChange   = newStatus !== currentStatus;
    const hasProgressChange = statusProgress !== '' && !isNaN(Number(statusProgress));

    if (!hasStatusChange && !hasProgressChange) {
      setFeedback({ type: 'error', message: 'Modifiez au moins le statut ou la progression.' });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      if (hasStatusChange) {
        await updateProjectStatus(userId, projectId, newStatus);
      }

      if (hasProgressChange || statusNote.trim()) {
        const statusLabel = STATUSES.find(s => s.value === newStatus)?.label || newStatus;
        await addProjectUpdate(userId, projectId, {
          updateType: hasStatusChange ? 'state change' : 'progress',
          details: statusNote.trim() || `Statut changé : ${statusLabel}`,
          progress: hasProgressChange ? Number(statusProgress) : null,
          services: [],
        });
      }

      setFeedback({ type: 'success', message: 'Projet mis à jour avec succès !' });
      setTimeout(() => { onSuccess(); onClose(); }, 1000);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Erreur lors de la mise à jour.' });
    } finally {
      setSubmitting(false);
    }
  };

  const progressPreview   = Number(updateForm.progress);
  const statusProgPreview = Number(statusProgress);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 pt-8 mt-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden pt-8 ">

        {/* Header */}
        
<div className="flex items-center justify-between px-6 pt-10 pb-4 border-b border-gray-100 ">
  
  <div className="flex items-center gap-2 ml-4 pt-8">
    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
      <HiPencilSquare className="w-4 h-4 text-white" />
    </div>

    <h3 className="text-base font-semibold text-gray-800">
      Modifier le projet
    </h3>
  </div>

  <button
    onClick={onClose}
    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
  >
    <HiXMark className="w-5 h-5 text-gray-400 hover:text-gray-600" />
  </button>
</div>

        {/* Tabs */}
        <div className="flex bg-gray-50 border-b border-gray-100 px-6 pt-3 gap-1">
          {[
            { key: 'update', label: '📝 Ajouter une mise à jour' },
            { key: 'status', label: '🔄 Changer le statut' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setFeedback(null); }}
              className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-t-lg transition-all border-b-2 ${
                tab === t.key
                  ? 'bg-white border-blue-600 text-blue-600 shadow-sm'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">

          {/* TAB : MISE À JOUR */}
          {tab === 'update' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Type de mise à jour
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {UPDATE_TYPES.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setUpdateForm(p => ({ ...p, updateType: t.value }))}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                        updateForm.updateType === t.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Détails <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Décrivez la mise à jour..."
                  value={updateForm.details}
                  onChange={e => setUpdateForm(p => ({ ...p, details: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Progression (%)
                  <span className="text-gray-400 font-normal normal-case ml-1">— optionnel</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0 – 100"
                    value={updateForm.progress}
                    onChange={e => setUpdateForm(p => ({ ...p, progress: e.target.value }))}
                    className="w-28 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  />
                  <div className="flex-1">
                    {updateForm.progress !== '' && !isNaN(progressPreview) ? (
                      <>
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                          <span>Aperçu</span>
                          <span className="font-semibold text-blue-600">{progressPreview}%</span>
                        </div>
                        <ProgressBar value={progressPreview} height="h-2" />
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">Entrez une valeur pour prévisualiser</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Services concernés
                  <span className="text-gray-400 font-normal normal-case ml-1">— optionnel</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => toggleService(s.value)}
                      className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${
                        updateForm.services.includes(s.value)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB : STATUT */}
          {tab === 'status' && (
            <>
              {currentStatus && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-400">Statut actuel :</span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusConfig(currentStatus).cls}`}>
                    {getStatusConfig(currentStatus).label}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Nouveau statut
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setNewStatus(s.value)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                        newStatus === s.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                          : s.value === currentStatus
                            ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-default'
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-base leading-none">{s.icon}</span>
                      <span className="flex-1 text-left">{s.label}</span>
                      {/* ✅ icône verte quand sélectionné */}
                      {newStatus === s.value && <HiCheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Mettre à jour la progression (%)
                  <span className="text-gray-400 font-normal normal-case ml-1">— optionnel</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0 – 100"
                    value={statusProgress}
                    onChange={e => setStatusProgress(e.target.value)}
                    className="w-28 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  />
                  <div className="flex-1">
                    {statusProgress !== '' && !isNaN(statusProgPreview) ? (
                      <>
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                          <span>Aperçu</span>
                          <span className="font-semibold text-blue-600">{statusProgPreview}%</span>
                        </div>
                        <ProgressBar value={statusProgPreview} height="h-2" />
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">Entrez une valeur pour prévisualiser</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Note
                  <span className="text-gray-400 font-normal normal-case ml-1">— optionnel</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Commentaire sur ce changement de statut..."
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition-all"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl space-y-1">
                <p className="text-xs font-semibold text-amber-700 mb-1.5">Ce qui sera appliqué :</p>
                {newStatus !== currentStatus ? (
                  <p className="text-xs text-amber-600">
                    ✓ Statut → <strong>{STATUSES.find(s => s.value === newStatus)?.label}</strong>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">— Pas de changement de statut</p>
                )}
                {statusProgress !== '' && !isNaN(statusProgPreview) ? (
                  <p className="text-xs text-amber-600">
                    ✓ Progression → <strong>{statusProgPreview}%</strong>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">— Pas de changement de progression</p>
                )}
                {statusNote.trim() && (
                  <p className="text-xs text-amber-600">✓ Note enregistrée</p>
                )}
              </div>
            </>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {feedback.type === 'success'
                /* ✅ icône verte succès */
                ? <HiCheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                /* ⚠️ icône rouge erreur */
                : <HiExclamationTriangle className="w-4 h-4 text-red-500 shrink-0" />}
              {feedback.message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={tab === 'update' ? handleSubmitUpdate : handleSubmitStatus}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              /* ⚡ icône jaune/blanc sur bouton bleu */
              <HiBolt className="w-4 h-4 text-yellow-300" />
            )}
            {submitting ? 'Envoi en cours...' : 'Confirmer les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Page principale : ChefProjectDetail
───────────────────────────────────────────── */
const ChefProjectDetail = () => {
  const { projectId } = useParams();
  const navigate      = useNavigate();

  const [project,   setProject]   = useState(null);
  const [updates,   setUpdates]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statsKey,  setStatsKey]  = useState(0);

  const currentProgress = [...updates]
    .reverse()
    .find(u => u.progress !== null && u.progress !== undefined)
    ?.progress ?? null;

  const fetchProject = useCallback(async () => {
    const userId = getUserId();
    if (!userId || !projectId) return;
    try {
      setLoading(true);
      const data = await getProjectDetailChef(projectId, userId);
      const projectData = data.project ?? data;
      setProject(projectData);
      if (Array.isArray(projectData.updates) && projectData.updates.length > 0) {
        setUpdates(projectData.updates);
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du projet');
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

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  /* Erreur */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center border border-gray-200">
          {/* ⚠️ icône rouge erreur */}
          <HiExclamationTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium transition-colors text-sm border border-gray-200"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  /* Not found */
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {/* 🔍 icône loupe grise */}
          <HiMagnifyingGlass className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Projet non trouvé</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:opacity-80 font-medium text-sm">
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-8">

      {showModal && (
        <UpdateModal
          projectId={projectId}
          userId={getUserId()}
          currentStatus={project.status}
          currentProgress={currentProgress}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {/* ← icône retour grise */}
              <HiArrowLeft className="w-5 h-5 text-gray-500" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{project.title}</h1>
              <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">ID: {project.id}</p>
            </div>

            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.cls} hidden sm:inline-flex`}>
              {statusConfig.label}
            </span>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              {/* ✏️ icône blanche sur fond bleu */}
              <HiPencilSquare className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Modifier le projet</span>
              <span className="sm:hidden">Modifier</span>
            </button>
            <button
  className="px-2 py-3 w-20 bg-[#f16c13] hover:opacity-90 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 text-xs shadow-sm"
>
  <HiPlus className="w-4 h-4" />
  Doc
</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Informations générales */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            {/* 📋 icône indigo */}
            <HiClipboardDocumentList className="w-5 h-5 text-indigo-500" />
            Informations du projet
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Budget</p>
              <p className="text-xl font-bold text-green-700 mt-1">{formatBudget(project.budget)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Service</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{getServiceLabel(project.services)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Statut</p>
              <span className={`inline-flex mt-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${statusConfig.cls}`}>
                {statusConfig.label}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Chef ID</p>
              <p className="text-xs font-mono text-gray-500 mt-1 truncate" title={project.chefId}>{project.chefId}</p>
            </div>
          </div>

          {currentProgress !== null && (
            <div className="mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-600">Progression globale</span>
                <span className="font-bold text-blue-600">{Number(currentProgress)}%</span>
              </div>
              <ProgressBar value={currentProgress} height="h-3" showLabel />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Description</label>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
              {project.description || 'Aucune description renseignée.'}
            </p>
          </div>
          
        </section>

        {/* Statistiques */}
        <ProgressStats key={statsKey} projectId={projectId} />

        {/* Chef de projet */}
        {project.chef && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              {/* 👥 icône violet */}
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
                  <p className="text-sm text-gray-400">Matricule: {project.chef.matricule || 'N/A'}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <a href={`mailto:${project.chef.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  {/* ✉️ icône bleue email */}
                  <HiEnvelope className="w-4 h-4 text-blue-500" />{project.chef.email}
                </a>
                <a href={`tel:${project.chef.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                  {/* 📞 icône verte téléphone */}
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
              {/* 👤 icône indigo */}
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
                      {/* ✉️ icône bleue */}
                      <HiEnvelope className="w-4 h-4 text-blue-500 shrink-0" />{project.client.email}
                    </a>
                    <a href={`tel:${project.client.phone}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
                      {/* 📞 icône verte */}
                      <HiPhone className="w-4 h-4 text-green-500 shrink-0" />{project.client.phone}
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">Entreprise</p>
                  <p className="text-sm text-gray-700 mt-0.5">{project.client.companyName || 'Particulier'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">Adresse</p>
                  <p className="text-sm text-gray-700 mt-0.5">{project.client.address || 'Non renseignée'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">ID Client</p>
                  <p className="text-xs font-mono text-gray-500 mt-0.5 truncate">{project.client.id}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mises à jour */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              {/* 🔄 icône orange refresh */}
              <HiArrowPath className="w-5 h-5 text-orange-500" />
              Mises à jour
              {updates.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                  {updates.length}
                </span>
              )}
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors"
            >
              {/* ➕ icône bleue */}
              <HiPlus className="w-3.5 h-3.5 text-blue-600" />
              Ajouter
            </button>
          </div>

          {updates.length > 0 ? (
            <ul className="space-y-3">
              {[...updates].reverse().map((update, index) => {
                const typeConfig    = getUpdateTypeCfg(update.updateType || update.type);
                const progressValue = update.progress !== null && update.progress !== undefined
                  ? Number(update.progress) : null;

                return (
                  <li key={update.id || index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                          {updates.length - index}
                        </span>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${typeConfig.cls}`}>
                          {typeConfig.label}
                        </span>
                        {update.services && update.services.length > 0 && (
                          <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                            {getServiceLabel(update.services)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(update.timestamp || update.createdAt || update.date)}
                      </span>
                    </div>

                    <div className="space-y-2.5 pl-9">
                      {(update.details || update.message || update.content || update.description) && (
                        <p className="text-sm text-gray-600">
                          {update.details || update.message || update.content || update.description}
                        </p>
                      )}

                      {progressValue !== null && !isNaN(progressValue) && (
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progression</span>
                            <span className="font-semibold text-blue-600">{progressValue}%</span>
                          </div>
                          <ProgressBar value={progressValue} height="h-2" />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100 text-xs text-gray-400">
                        {update.updatedBy && (
                          <span className="flex items-center gap-1">
                            {/* 👤 icône user cyan */}
                            <HiUser className="w-3 h-3 text-cyan-500" />
                            <code className="bg-white px-1.5 py-0.5 rounded border border-gray-100">{update.updatedBy.slice(0, 8)}...</code>
                          </span>
                        )}
                        {update.id && (
                          <span className="flex items-center gap-1">
                            {/* # icône hash violet */}
                            <HiHashtag className="w-3 h-3 text-violet-400" />
                            <code className="bg-white px-1.5 py-0.5 rounded border border-gray-100">{update.id.slice(0, 6)}...</code>
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-10">
              {/* 📥 icône inbox grise */}
              <HiInbox className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucune mise à jour pour le moment.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 text-sm text-blue-600 hover:underline font-medium"
              >
                Ajouter la première mise à jour →
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Barre mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 sm:hidden z-20 shadow-lg">
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-200 text-sm">
            {/* 💬 icône chat bleue */}
            <HiChatBubbleLeft className="w-4 h-4 text-blue-500" />
            Contacter
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            {/* ✏️ icône blanche sur fond bleu */}
            <HiPencilSquare className="w-4 h-4 text-white" />
            Modifier le projet
          </button>
          
          
        
        </div>
      </div>
    </div>
  );
};

export default ChefProjectDetail;