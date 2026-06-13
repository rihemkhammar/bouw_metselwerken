import React, { useState, useEffect } from 'react';
import {
  Phone, Mail, MapPin, Building2, Briefcase,
  Calendar, CheckCircle, User,
  FolderKanban, Package,
  Copy, Check, Pencil, X,
  PlayCircle, Clock, CheckSquare, Layers,
  Save, Lock, Eye, EyeOff, ShieldCheck,
} from 'lucide-react';
import { fetchClientProfile, updateClientProfile, updateClientPassword } from '../../services/api';
import { jwtDecode } from 'jwt-decode';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const SERVICE_LABELS = {
  CONSTRUCTION_GENERALE:   'Construction Générale',
  RENOVATION:              'Rénovation',
  TRAITEMENT_HYDROFUGE:    'Traitement Hydrofuge',
  ISOLATION:               'Isolation',
  PEINTURE:                'Peinture',
  ELECTRICITE:             'Électricité',
  PLOMBERIE:               'Plomberie',
  MACONNERIE:              'Maçonnerie',
  RESTAURATION:            'Restauration',
  REJOINTOIEMENT_RUSTIQUE: 'Rejointoiement Rustique',
  DEMOUSSAGE:              'Démoussage',
};

// ─── Main ─────────────────────────────────────────────────────────────────────

function ClientProfilePage() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Modal info
  const [editOpen, setEditOpen] = useState(false);
  const [form,     setForm]     = useState({});
  const [saving,   setSaving]   = useState(false);
  const [saveErr,  setSaveErr]  = useState(null);
  const [saved,    setSaved]    = useState(false);

  // Modal password
  const [pwdOpen,    setPwdOpen]    = useState(false);
  const [pwdForm,    setPwdForm]    = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdSaving,  setPwdSaving]  = useState(false);
  const [pwdErr,     setPwdErr]     = useState(null);
  const [pwdSaved,   setPwdSaved]   = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const decoded = jwtDecode(token);
    const userId = decoded.id;
    const loadUser = async () => {
      try {
        setLoading(true);
        const data = await fetchClientProfile(userId, token);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // ── Info modal handlers ───────────────────────────────────────────────────
  const handleEditOpen = () => {
    setForm({
      name:        user.name        || '',
      phone:       user.phone       || '',
      address:     user.address     || '',
      companyName: user.companyName || '',
    });
    setSaveErr(null);
    setSaved(false);
    setEditOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveErr(null);
      const token = localStorage.getItem('token');
      const updated = await updateClientProfile(user.id, token, form);
      setUser((prev) => ({ ...prev, ...updated }));
      setSaved(true);
      setTimeout(() => { setEditOpen(false); setSaved(false); }, 900);
    } catch (err) {
      setSaveErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Password modal handlers ───────────────────────────────────────────────
  const handlePwdOpen = () => {
    setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPwdErr(null);
    setPwdSaved(false);
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setPwdOpen(true);
  };

  const handlePwdSave = async () => {
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdErr('Les mots de passe ne correspondent pas');
      return;
    }
    if (pwdForm.newPassword.length < 8) {
      setPwdErr('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    try {
      setPwdSaving(true);
      setPwdErr(null);
      const token = localStorage.getItem('token');
      await updateClientPassword(user.id, token, {
        currentPassword: pwdForm.currentPassword,
        newPassword:     pwdForm.newPassword,
      });
      setPwdSaved(true);
      setTimeout(() => { setPwdOpen(false); setPwdSaved(false); }, 1000);
    } catch (err) {
      setPwdErr(err.message);
    } finally {
      setPwdSaving(false);
    }
  };

  // password strength
  const pwdStrength = (() => {
    const p = pwdForm.newPassword;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8)           score++;
    if (p.length >= 12)          score++;
    if (/[A-Z]/.test(p))         score++;
    if (/[0-9]/.test(p))         score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Faible',  color: 'bg-red-400',    width: 'w-1/4'  };
    if (score <= 2) return { label: 'Moyen',   color: 'bg-amber-400',  width: 'w-2/4'  };
    if (score <= 3) return { label: 'Bon',     color: 'bg-blue-400',   width: 'w-3/4'  };
    return                { label: 'Fort',     color: 'bg-green-500',  width: 'w-full'  };
  })();

  if (loading && !user) return <ProfileLoader />;
  if (error   || !user) return <ProfileError message={error} />;

  const isActive   = user.status === 'ACTIVE';
  const { stats }  = user;
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen bg-[var(--background)] ml-[200px] font-sans">
      <div className="max-w-[95%] mx-auto px-6 py-6 pb-10">
        <div className="flex gap-5 items-start">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="w-60 flex-shrink-0 sticky top-6">
            <div className="bg-[var(--white)] rounded-2xl border border-[var(--border)] overflow-hidden">

              {/* Avatar */}
              <div className="px-5 pt-6 pb-4 text-center border-b border-[var(--border)]">
                <div className="relative inline-block mb-3">
                  <div className="w-20 h-20 rounded-full bg-[var(--secondary)] flex items-center justify-center text-white font-semibold text-2xl">
                    {getInitials(user.name)}
                  </div>
                  {isActive && (
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--success)] border-2 border-white" />
                  )}
                </div>
                <p className="text-sm font-semibold text-[var(--text)] leading-tight">{user.companyName || user.name}</p>
                <p className="text-xs text-[var(--gris)] mt-0.5">{user.name}</p>
              </div>

              {/* Badges */}
              <div className="flex gap-1.5 justify-center px-4 py-3 border-b border-[var(--border)]">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {user.status}
                </span>
                {user.role && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[var(--primary)] border border-blue-100">
                    {user.role}
                  </span>
                )}
              </div>

              {/* Member since */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] text-xs text-[var(--gris)]">
                <Calendar size={12} className="text-[var(--primary)] flex-shrink-0" />
                Membre depuis {memberSince}
              </div>

              {/* Action buttons */}
              <div className="px-4 py-3 flex flex-col gap-2 border-b border-[var(--border)]">
                <button
                  onClick={handleEditOpen}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--primary)] hover:bg-blue-700 text-white text-xs font-semibold transition-colors duration-150"
                >
                  <Pencil size={13} />
                  Modifier le profil
                </button>
                <button
                  onClick={handlePwdOpen}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--background)] hover:bg-gray-100 text-[var(--secondary-text)] border border-[var(--border)] text-xs font-semibold transition-colors duration-150"
                >
                  <Lock size={13} />
                  Changer le mot de passe
                </button>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
                {[
                  { label: 'Projets',  value: stats?.projects?.total ?? 0 },
                  { label: 'Services', value: stats?.services?.total ?? 0 },
                ].map((s, i) => (
                  <div key={i} className="py-3 px-2 text-center">
                    <p className="text-xl font-bold text-[var(--primary)]">{s.value}</p>
                    <p className="text-[10px] text-[var(--gris)] uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main ────────────────────────────────────────────────────── */}
          <main className="flex-1 flex flex-col gap-4">
            <Section icon={User} title="Contact">
              <div className="grid grid-cols-3 gap-2">
                <DetailItem icon={Mail}   label="Email"     value={user.email} />
                <DetailItem icon={Phone}  label="Téléphone" value={user.phone || '—'} />
                <DetailItem icon={MapPin} label="Adresse"   value={user.address || '—'} />
              </div>
            </Section>

            <Section icon={Building2} title="Entreprise">
              <div className="grid grid-cols-3 gap-2">
                <DetailItem icon={Building2}   label="Entreprise" value={user.companyName || '—'} />
                <DetailItem icon={Briefcase}   label="Matricule"  value={user.matricule   || '—'} />
                <DetailItem icon={CheckCircle} label="Statut"     value={user.status} highlight={isActive} />
              </div>
            </Section>

            {stats?.projects && (
              <Section icon={FolderKanban} title="Projets">
                <div className="grid grid-cols-4 gap-2.5">
                  <MiniStat label="Total"     value={stats.projects.total}      Icon={Layers}      color="primary" />
                  <MiniStat label="Planifiés" value={stats.projects.planned}    Icon={Clock}       color="blue"   />
                  <MiniStat label="En cours"  value={stats.projects.inProgress} Icon={PlayCircle}  color="warning" />
                  <MiniStat label="Terminés"  value={stats.projects.completed}  Icon={CheckSquare} color="success" />
                </div>
              </Section>
            )}

            {stats?.services?.list?.length > 0 && (
              <Section icon={Package} title="Services souscrits">
                <div className="flex flex-wrap gap-2">
                  {stats.services.list.map((service) => (
                    <span key={service} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-[var(--primary)] border border-blue-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] flex-shrink-0" />
                      {SERVICE_LABELS[service] || service}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </main>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL — Modifier les infos
      ══════════════════════════════════════════════════════════════════ */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(13,27,42,0.45)', backdropFilter: 'blur(3px)' }}
          onClick={() => setEditOpen(false)}
        >
          <div
            className="bg-[var(--white)] rounded-2xl border border-[var(--border)] w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Pencil size={13} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text)]">Modifier les informations</h3>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X size={15} className="text-[var(--gris)]" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">
              {[
                { key: 'name',        label: 'Nom complet',  type: 'text', placeholder: 'Jean Dupont'           },
                { key: 'phone',       label: 'Téléphone',    type: 'tel',  placeholder: '+216 00 000 000'        },
                { key: 'address',     label: 'Adresse',      type: 'text', placeholder: '12 rue de la Paix'      },
                { key: 'companyName', label: 'Entreprise',   type: 'text', placeholder: 'Nom de votre société'   },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--gris)] mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    placeholder={placeholder}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] text-sm placeholder-gray-400 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              ))}
              {saveErr && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-600">
                  <X size={12} className="flex-shrink-0" />{saveErr}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-[var(--border)]">
              <button onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-lg text-xs font-semibold border border-[var(--border)] bg-[var(--background)] text-[var(--secondary-text)] hover:bg-gray-100 transition-colors">
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all ${
                  saved ? 'bg-[var(--success)]' : saving ? 'bg-[var(--gris)] cursor-not-allowed' : 'bg-[var(--primary)] hover:bg-blue-700'
                }`}
              >
                {saved ? (
                  <><Check size={13} /> Enregistré !</>
                ) : saving ? (
                  <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Enregistrement...</>
                ) : (
                  <><Save size={13} /> Enregistrer</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL — Changer le mot de passe
      ══════════════════════════════════════════════════════════════════ */}
      {pwdOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(13,27,42,0.45)', backdropFilter: 'blur(3px)' }}
          onClick={() => setPwdOpen(false)}
        >
          <div
            className="bg-[var(--white)] rounded-2xl border border-[var(--border)] w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Lock size={13} className="text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text)]">Changer le mot de passe</h3>
              </div>
              <button onClick={() => setPwdOpen(false)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X size={15} className="text-[var(--gris)]" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">

              {/* Mot de passe actuel */}
              <PasswordField
                label="Mot de passe actuel"
                value={pwdForm.currentPassword}
                show={showCurrent}
                onToggle={() => setShowCurrent((v) => !v)}
                onChange={(v) => setPwdForm((f) => ({ ...f, currentPassword: v }))}
                placeholder="••••••••"
              />

              {/* Séparateur */}
              <div className="border-t border-[var(--border)]" />

              {/* Nouveau mot de passe */}
              <PasswordField
                label="Nouveau mot de passe"
                value={pwdForm.newPassword}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
                onChange={(v) => setPwdForm((f) => ({ ...f, newPassword: v }))}
                placeholder="Min. 8 caractères"
              />

              {/* Force du mot de passe */}
              {pwdForm.newPassword && pwdStrength && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-[var(--gris)] font-medium uppercase tracking-wider">Force</span>
                    <span className={`text-[10px] font-semibold ${
                      pwdStrength.label === 'Faible' ? 'text-red-500' :
                      pwdStrength.label === 'Moyen'  ? 'text-amber-500' :
                      pwdStrength.label === 'Bon'    ? 'text-blue-500' : 'text-green-600'
                    }`}>{pwdStrength.label}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${pwdStrength.color} ${pwdStrength.width}`} />
                  </div>
                </div>
              )}

              {/* Confirmer */}
              <PasswordField
                label="Confirmer le nouveau mot de passe"
                value={pwdForm.confirmPassword}
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                onChange={(v) => setPwdForm((f) => ({ ...f, confirmPassword: v }))}
                placeholder="••••••••"
                error={
                  pwdForm.confirmPassword &&
                  pwdForm.newPassword !== pwdForm.confirmPassword
                    ? 'Ne correspond pas'
                    : null
                }
              />

              {/* Erreur API */}
              {pwdErr && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-600">
                  <X size={12} className="flex-shrink-0" />{pwdErr}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-[var(--border)]">
              <button onClick={() => setPwdOpen(false)} className="px-4 py-2 rounded-lg text-xs font-semibold border border-[var(--border)] bg-[var(--background)] text-[var(--secondary-text)] hover:bg-gray-100 transition-colors">
                Annuler
              </button>
              <button
                onClick={handlePwdSave}
                disabled={pwdSaving || pwdSaved || !pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all ${
                  pwdSaved   ? 'bg-[var(--success)]' :
                  pwdSaving  ? 'bg-[var(--gris)] cursor-not-allowed' :
                  !pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword
                             ? 'bg-gray-300 cursor-not-allowed' :
                               'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {pwdSaved ? (
                  <><ShieldCheck size={13} /> Mis à jour !</>
                ) : pwdSaving ? (
                  <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Mise à jour...</>
                ) : (
                  <><Lock size={13} /> Mettre à jour</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PasswordField ────────────────────────────────────────────────────────────

const PasswordField = ({ label, value, show, onToggle, onChange, placeholder, error }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--gris)] mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm placeholder-gray-400 outline-none transition-all bg-[var(--background)] text-[var(--text)] ${
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100'
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gris)] hover:text-[var(--primary)] transition-colors"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
    {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
  </div>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

const Section = ({ icon: Icon, title, children }) => (
  <section className="bg-[var(--white)] rounded-2xl border border-[var(--border)] p-5">
    <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-[var(--border)]">
      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-[var(--primary)]" />
      </div>
      <h3 className="text-sm font-semibold text-[var(--secondary-text)]">{title}</h3>
    </div>
    {children}
  </section>
);

const MINI_STAT_THEME = {
  primary: { bg: 'bg-blue-50',  icon: 'text-[var(--primary)]',  val: 'text-[var(--primary)]'  },
  blue:    { bg: 'bg-blue-50',  icon: 'text-blue-400',          val: 'text-blue-400'          },
  warning: { bg: 'bg-amber-50', icon: 'text-amber-500',         val: 'text-amber-600'         },
  success: { bg: 'bg-green-50', icon: 'text-[var(--success)]',  val: 'text-[var(--success)]'  },
};

const MiniStat = ({ label, value, Icon, color = 'primary' }) => {
  const t = MINI_STAT_THEME[color] || MINI_STAT_THEME.primary;
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:-translate-y-0.5 transition-transform duration-150 cursor-default">
      <div className={`w-7 h-7 rounded-lg ${t.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={13} className={t.icon} />
      </div>
      <div>
        <p className={`text-lg font-bold leading-none ${t.val}`}>{value}</p>
        <p className="text-[10px] text-[var(--gris)] font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, highlight }) => {
  const [copied,  setCopied]  = useState(false);
  const [hovered, setHovered] = useState(false);
  const copyable = value && value !== '—';

  const handleCopy = () => {
    if (!copyable) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all duration-150 cursor-default ${
        hovered ? 'bg-[var(--background)] border-[var(--border)]' : 'bg-transparent border-transparent'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
        hovered ? 'bg-blue-50 text-[var(--primary)]' : 'bg-[var(--background)] text-[var(--gris)]'
      }`}>
        <Icon size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--gris)] mb-0.5">{label}</span>
        <span className={`block text-xs font-medium truncate ${highlight ? 'text-[var(--success)]' : 'text-[var(--secondary-text)]'}`}>
          {value}
        </span>
      </div>
      {copyable && (
        <button
          onClick={handleCopy}
          className={`p-1 rounded-md transition-all duration-150 ${hovered ? 'opacity-100' : 'opacity-0'} ${
            copied ? 'text-[var(--success)]' : 'text-[var(--gris)] hover:text-[var(--primary)]'
          }`}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
      )}
    </div>
  );
};

const ProfileLoader = () => (
  <div className="ml-[200px] min-h-screen bg-[var(--background)]">
    <div className="max-w-[95%] mx-auto px-6 py-6 flex gap-5">
      <div className="w-60 h-80 rounded-2xl bg-[var(--white)] border border-[var(--border)] animate-pulse flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-4">
        {[120, 110, 140, 100].map((h, i) => (
          <div key={i} className="rounded-2xl bg-[var(--white)] border border-[var(--border)] animate-pulse" style={{ height: h }} />
        ))}
      </div>
    </div>
  </div>
);

const ProfileError = ({ message }) => (
  <div className="ml-[200px] min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
    <div className="bg-[var(--white)] rounded-2xl border border-[var(--border)] p-10 text-center max-w-sm w-full shadow-sm">
      <p className="text-[var(--error)] font-medium text-base mb-4">❌ {message || 'Profil introuvable'}</p>
      <button onClick={() => window.history.back()} className="px-5 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        ← Retour
      </button>
    </div>
  </div>
);

export default ClientProfilePage;