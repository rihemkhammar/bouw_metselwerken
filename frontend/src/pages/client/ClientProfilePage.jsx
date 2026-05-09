import React, { useState, useEffect } from 'react';
import {
  Phone, Mail, MapPin, Building2, Briefcase,
  Calendar, CheckCircle, User,
  FolderKanban, History, Package, ClipboardList,
  Copy, Check,
  PlayCircle, Clock, CheckSquare, XCircle, Ban, AlertCircle, Layers
} from 'lucide-react';
import { fetchClientProfile } from '../../services/api';
import { jwtDecode } from "jwt-decode";

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const SERVICE_LABELS = {
  CONSTRUCTION_GENERALE: 'Construction Générale',
  RENOVATION: 'Rénovation',
  TRAITEMENT_HYDROFUGE: 'Traitement Hydrofuge',
  ISOLATION: 'Isolation',
  PEINTURE: 'Peinture',
  ELECTRICITE: 'Électricité',
  PLOMBERIE: 'Plomberie',
};

const palette = {
  primary:       'var(--primary)',
  primaryLight:  'var(--primary-light)',
  secondary:     'var(--secondary)',
<<<<<<< HEAD
  secondaryLight:'var(--secondary-light)',
=======
>>>>>>> origin/GuestPage_Rihem
  background:    'var(--background)',
  text:          'var(--text)',
  secondaryText: 'var(--secondary-text)',
  white:         'var(--white)',
  border:        'var(--border)',
  success:       'var(--success)',
  error:         'var(--error)',
  warning:       'var(--warning)',
  gris:          'var(--gris)',
<<<<<<< HEAD
  offWhite:      'var(--standard-off-white)',
};

const STAT_COLORS = {
  primary:  { bg: 'rgba(0,115,207,0.08)',  icon: 'var(--primary)',   val: 'var(--primary)'   },
  success:  { bg: 'rgba(40,167,69,0.08)',   icon: 'var(--success)',   val: 'var(--success)'   },
  warning:  { bg: 'rgba(255,193,7,0.10)',   icon: 'var(--warning)',   val: 'var(--secondary)' },
  error:    { bg: 'rgba(220,53,69,0.08)',   icon: 'var(--error)',     val: 'var(--error)'     },
  gris:     { bg: 'rgba(128,128,128,0.10)', icon: 'var(--gris)',      val: 'var(--gris)'      },
  secondary:{ bg: 'rgba(255,140,0,0.08)',   icon: 'var(--secondary)', val: 'var(--secondary)' },
=======
};

const STAT_COLORS = {
  primary:   { icon: 'var(--primary)',   val: 'var(--primary)'   },
  success:   { icon: 'var(--success)',   val: 'var(--success)'   },
  warning:   { icon: '#FF8C00',          val: '#b38600'          },
  error:     { icon: 'var(--error)',     val: 'var(--error)'     },
  gris:      { icon: 'var(--gris)',      val: 'var(--gris)'      },
  secondary: { icon: 'var(--secondary)', val: 'var(--secondary)' },
};

const ICON_BG = {
  primary:   'rgba(0,115,207,0.10)',
  success:   'rgba(40,167,69,0.10)',
  warning:   'rgba(255,193,7,0.12)',
  error:     'rgba(220,53,69,0.10)',
  gris:      'rgba(128,128,128,0.10)',
  secondary: 'rgba(255,140,0,0.10)',
>>>>>>> origin/GuestPage_Rihem
};

function ClientProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
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

  if (loading && !user) return <ProfileLoader />;
  if (error || !user) return <ProfileError message={error} />;

  const isActive = user.status === 'ACTIVE';
  const { stats } = user;

<<<<<<< HEAD
  return (
    <div style={{ marginLeft: 280, minHeight: '100vh', background: palette.background, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      <div style={{ maxWidth: '95%', margin: '0 auto', padding: '24px 24px 40px' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* ── Left: Identity Card (Grand conteneur → Neutre) ── */}
          <aside style={{ width: 280, flexShrink: 0, position: 'sticky', top: 24 }}>
            <div style={{ background: 'var(--white)', borderRadius: 16, border: `1px solid var(--border)`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>

              {/* Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 20px', borderBottom: `1px solid var(--border)` }}>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <div style={{
                    width: 96, height: 96, borderRadius: 16,
                    background: `linear-gradient(135deg, var(--primary), var(--primary-light))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: palette.white, fontWeight: 700, fontSize: 32,
                    boxShadow: '0 4px 16px rgba(0,115,207,0.3)',
                    outline: `4px solid rgba(0,115,207,0.1)`,
=======
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div style={{
      marginLeft: 200,
      minHeight: '100vh',
      background: palette.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ maxWidth: '95%', margin: '0 auto', padding: '24px 24px 40px' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* ── Sidebar ── */}
          <aside style={{ width: 240, flexShrink: 0, position: 'sticky', top: 24 }}>
            <div style={{
              background: palette.white,
              borderRadius: 14,
              border: `1px solid var(--border)`,
              overflow: 'hidden',
            }}>

              {/* Avatar */}
              <div style={{
                padding: '24px 20px 16px',
                textAlign: 'center',
                borderBottom: `1px solid var(--border)`,
              }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: palette.warning,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: palette.white, fontWeight: 600, fontSize: 26,
>>>>>>> origin/GuestPage_Rihem
                  }}>
                    {getInitials(user.name)}
                  </div>
                  {isActive && (
                    <span style={{
<<<<<<< HEAD
                      position: 'absolute', bottom: -4, right: -4,
                      width: 20, height: 20, borderRadius: '50%',
                      background: palette.success, border: `2px solid var(--white)`,
                    }} />
                  )}
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: palette.text, textAlign: 'center', margin: 0 }}>
                  {user.companyName || user.name}
                </h2>
                <p style={{ fontSize: 13, color: palette.gris, marginTop: 4, marginBottom: 0 }}>{user.name}</p>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '12px 20px', borderBottom: `1px solid var(--border)` }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: isActive ? 'rgba(40,167,69,0.1)' : 'rgba(128,128,128,0.1)',
                  color: isActive ? palette.success : palette.gris,
                  border: `1px solid ${isActive ? palette.success : palette.border}`,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? palette.success : palette.gris }} />
=======
                      position: 'absolute', bottom: 2, right: 2,
                      width: 14, height: 14, borderRadius: '50%',
                      background: palette.success,
                      border: `2px solid var(--white)`,
                    }} />
                  )}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: palette.text }}>
                  {user.companyName || user.name}
                </div>
                <div style={{ fontSize: 12, color: palette.gris, marginTop: 3 }}>
                  {user.name}
                </div>
              </div>

              {/* Badges */}
              <div style={{
                display: 'flex', gap: 6, justifyContent: 'center',
                padding: '12px 16px', borderBottom: `1px solid var(--border)`,
              }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: isActive ? 'rgba(40,167,69,0.1)' : 'rgba(128,128,128,0.1)',
                  color: isActive ? palette.success : palette.gris,
                  border: `1px solid ${isActive ? 'rgba(40,167,69,0.25)' : 'rgba(128,128,128,0.25)'}`,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: isActive ? palette.success : palette.gris,
                  }} />
>>>>>>> origin/GuestPage_Rihem
                  {user.status}
                </span>
                {user.role && (
                  <span style={{
<<<<<<< HEAD
                    display: 'inline-flex', alignItems: 'center',
                    padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: 'rgba(0,115,207,0.1)', color: palette.primary,
                    border: `1px solid var(--primary-light)`,
=======
                    padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: 'rgba(0,115,207,0.08)', color: palette.primary,
                    border: `1px solid rgba(0,115,207,0.2)`,
>>>>>>> origin/GuestPage_Rihem
                  }}>
                    {user.role}
                  </span>
                )}
              </div>

              {/* Member since */}
<<<<<<< HEAD
              <div style={{ padding: '12px 20px', borderBottom: `1px solid var(--border)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: palette.gris }}>
                  <Calendar size={13} style={{ color: palette.primary }} />
                  Membre depuis 24 mai 2025
                </div>
=======
              <div style={{
                padding: '10px 16px', borderBottom: `1px solid var(--border)`,
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 12, color: palette.gris,
              }}>
                <Calendar size={13} style={{ color: palette.primary }} />
                Membre depuis {memberSince}
>>>>>>> origin/GuestPage_Rihem
              </div>

              {/* Quick stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                  { label: 'Projets',  value: stats?.projects?.total ?? 0 },
                  { label: 'Services', value: stats?.services?.total ?? 0 },
<<<<<<< HEAD
                  { label: 'Demandes', value: stats?.requests?.total ?? 0 },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: '12px 0', textAlign: 'center',
                    borderRight: i < 2 ? `1px solid var(--border)` : 'none',
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: palette.primary }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: palette.gris, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
=======
                 
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: '14px 4px', textAlign: 'center',
                    borderRight: i < 2 ? `1px solid var(--border)` : 'none',
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: palette.primary }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: palette.gris, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
                      {s.label}
                    </div>
>>>>>>> origin/GuestPage_Rihem
                  </div>
                ))}
              </div>
            </div>
          </aside>

<<<<<<< HEAD
          {/* ── Right: Details ── */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Contact */}
            <Section icon={User} iconBg="rgba(0,115,207,0.1)" iconColor={palette.primary} title="Contact">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                <DetailItem icon={Mail}      label="Email"     value={user.email} />
                <DetailItem icon={Phone}     label="Téléphone" value={user.phone || '—'} />
                <DetailItem icon={MapPin}    label="Adresse"   value={user.address || '—'} />
=======
          {/* ── Main ── */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Contact */}
            <Section icon={User} title="Contact">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                <DetailItem icon={Mail}   label="Email"     value={user.email} />
                <DetailItem icon={Phone}  label="Téléphone" value={user.phone || '—'} />
                <DetailItem icon={MapPin} label="Adresse"   value={user.address || '—'} />
>>>>>>> origin/GuestPage_Rihem
              </div>
            </Section>

            {/* Entreprise */}
<<<<<<< HEAD
            <Section icon={Building2} iconBg="rgba(0,115,207,0.1)" iconColor={palette.primary} title="Entreprise">
=======
            <Section icon={Building2} title="Entreprise">
>>>>>>> origin/GuestPage_Rihem
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                <DetailItem icon={Building2}   label="Entreprise" value={user.companyName || '—'} />
                <DetailItem icon={Briefcase}   label="Matricule"  value={user.matricule   || '—'} />
                <DetailItem icon={CheckCircle} label="Statut"     value={user.status} highlight={isActive} />
              </div>
            </Section>

            {/* Projets */}
            {stats?.projects && (
<<<<<<< HEAD
              <Section icon={FolderKanban} iconBg="rgba(0,115,207,0.1)" iconColor={palette.primary} title="Projets">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  <MiniStat label="Total"     value={stats.projects.total}      Icon={Layers}      color="primary"  />
                  <MiniStat label="Planifiés" value={stats.projects.planned}    Icon={Clock}       color="warning"  />
                  <MiniStat label="En cours"  value={stats.projects.inProgress} Icon={PlayCircle}  color="secondary"/>
                  <MiniStat label="Terminés"  value={stats.projects.completed}  Icon={CheckSquare} color="success"  />
=======
              <Section icon={FolderKanban} title="Projets">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                  <MiniStat label="Total"     value={stats.projects.total}      Icon={Layers}      color="primary"   />
                  <MiniStat label="Planifiés" value={stats.projects.planned}    Icon={Clock}       color="primary"   />
                  <MiniStat label="En cours"  value={stats.projects.inProgress} Icon={PlayCircle}  color="primary" />
                  <MiniStat label="Terminés"  value={stats.projects.completed}  Icon={CheckSquare} color="primary"   />
>>>>>>> origin/GuestPage_Rihem
                </div>
              </Section>
            )}

<<<<<<< HEAD
            {/* Demandes */}
            {stats?.requests && (
              <Section icon={History} iconBg="rgba(0,115,207,0.1)" iconColor={palette.primary} title="Demandes">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
                  <MiniStat label="Total"      value={stats.requests.total}    Icon={ClipboardList} color="primary"   />
                  <MiniStat label="En attente" value={stats.requests.pending}  Icon={AlertCircle}   color="warning"   />
                  <MiniStat label="Approuvées" value={stats.requests.approved} Icon={CheckCircle}   color="success"   />
                  <MiniStat label="Refusées"   value={stats.requests.declined} Icon={XCircle}       color="error"     />
                  <MiniStat label="Bloquées"   value={stats.requests.blocked}  Icon={Ban}           color="gris"      />
                </div>
              </Section>
            )}

            {/* Services */}
            {stats?.services?.list?.length > 0 && (
              <Section icon={Package} iconBg="rgba(0,115,207,0.1)" iconColor={palette.primary} title="Services souscrits">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {stats.services.list.map((service) => (
                    <span key={service} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '8px 16px', borderRadius: 12,
                      background: 'rgba(0,115,207,0.08)', color: palette.primary,
                      fontSize: 13, fontWeight: 500,
                      border: `1px solid var(--primary-light)`,
                      cursor: 'default',
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: palette.primary, flexShrink: 0 }} />
=======
           

            {/* Services */}
            {stats?.services?.list?.length > 0 && (
              <Section icon={Package} title="Services souscrits">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {stats.services.list.map((service) => (
                    <span key={service} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', borderRadius: 999,
                      background: 'rgba(0,115,207,0.07)', color: palette.primary,
                      fontSize: 12, fontWeight: 500,
                      border: `1px solid rgba(0,115,207,0.18)`,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: palette.primary, flexShrink: 0 }} />
>>>>>>> origin/GuestPage_Rihem
                      {SERVICE_LABELS[service] || service}
                    </span>
                  ))}
                </div>
              </Section>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  Reusable components                        */
/* ─────────────────────────────────────────── */

<<<<<<< HEAD
// ✅ Grands conteneurs maintenant neutres
const Section = ({ icon: Icon, iconBg, iconColor, title, children }) => (
  <section style={{
    background: 'var(--white)', borderRadius: 16,
    border: '1px solid var(--border)', padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 20, paddingBottom: 16,
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--secondary-text)', margin: 0 }}>{title}</h3>
=======
const Section = ({ icon: Icon, title, children }) => (
  <section style={{
    background: 'var(--white)',
    borderRadius: 14,
    border: '1px solid var(--border)',
    padding: 20,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 16, paddingBottom: 14,
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'rgba(0,115,207,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={15} style={{ color: 'var(--primary)' }} />
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--secondary-text)', margin: 0 }}>{title}</h3>
>>>>>>> origin/GuestPage_Rihem
    </div>
    {children}
  </section>
);

<<<<<<< HEAD
// ✅ Petits carrés conservés en bleu
const MiniStat = ({ label, value, Icon, color = 'primary' }) => {
  const c = STAT_COLORS[color] || STAT_COLORS.primary;
  return (
    <div style={{
      borderRadius: 12, background: 'rgba(0,115,207,0.08)', padding: 16,
      border: `1px solid var(--primary-light)`,
      transition: 'transform 0.15s',
      cursor: 'default',
    }}
=======
const MiniStat = ({ label, value, Icon, color = 'primary' }) => {
  const c = STAT_COLORS[color] || STAT_COLORS.primary;
  const bg = ICON_BG[color]    || ICON_BG.primary;
  return (
    <div
      style={{
        borderRadius: 10,
        padding: '12px 14px',
        border: `1px solid var(--border)`,
        background: 'var(--background)',
        transition: 'transform 0.15s',
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
>>>>>>> origin/GuestPage_Rihem
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
<<<<<<< HEAD
        width: 32, height: 32, borderRadius: 8,
        background: 'rgba(0,115,207,0.1)', boxShadow: '0 1px 4px rgba(0,115,207,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10, color: c.icon,
      }}>
        <Icon size={16} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: c.val, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--gris)', fontWeight: 500, marginTop: 4, lineHeight: 1.3 }}>{label}</div>
=======
        width: 28, height: 28, borderRadius: 7,
        background: bg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: c.icon,
      }}>
        <Icon size={13} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: c.val, lineHeight: 1, flexShrink: 0 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--gris)', fontWeight: 500, lineHeight: 1.3 }}>{label}</div>
>>>>>>> origin/GuestPage_Rihem
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, highlight }) => {
  const [copied, setCopied] = useState(false);
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
      style={{
<<<<<<< HEAD
        display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12,
        borderRadius: 12, background: hovered ? 'var(--background)' : 'transparent',
        transition: 'background 0.15s', cursor: 'default',
        border: hovered ? '1px solid var(--border)' : '1px solid transparent',
=======
        display: 'flex', alignItems: 'flex-start', gap: 10, padding: 10,
        borderRadius: 10,
        background: hovered ? 'var(--background)' : 'transparent',
        border: hovered ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.15s', cursor: 'default',
>>>>>>> origin/GuestPage_Rihem
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
<<<<<<< HEAD
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: hovered ? 'rgba(0,115,207,0.1)' : 'var(--background)',
=======
        width: 32, height: 32, borderRadius: 7, flexShrink: 0,
        background: hovered ? 'rgba(0,115,207,0.08)' : 'var(--background)',
>>>>>>> origin/GuestPage_Rihem
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hovered ? 'var(--primary)' : 'var(--gris)',
        transition: 'background 0.15s, color 0.15s',
      }}>
<<<<<<< HEAD
        <Icon size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--gris)', marginBottom: 2 }}>
          {label}
        </span>
        <span style={{
          display: 'block', fontSize: 13, fontWeight: 500,
=======
        <Icon size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: 'block', fontSize: 10, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.07em',
          color: 'var(--gris)', marginBottom: 2,
        }}>
          {label}
        </span>
        <span style={{
          display: 'block', fontSize: 12, fontWeight: 500,
>>>>>>> origin/GuestPage_Rihem
          color: highlight ? 'var(--success)' : 'var(--secondary-text)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {value}
        </span>
      </div>
      {copyable && (
        <button
          onClick={handleCopy}
          style={{
            opacity: hovered ? 1 : 0, transition: 'opacity 0.15s',
            background: 'none', border: 'none', cursor: 'pointer',
<<<<<<< HEAD
            padding: 4, borderRadius: 6, color: copied ? 'var(--success)' : 'var(--gris)',
=======
            padding: 4, borderRadius: 6,
            color: copied ? 'var(--success)' : 'var(--gris)',
>>>>>>> origin/GuestPage_Rihem
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      )}
    </div>
  );
};

const ProfileLoader = () => (
  <div style={{ marginLeft: 280, minHeight: '100vh', background: 'var(--background)' }}>
<<<<<<< HEAD
    <div style={{ maxWidth: '95%', margin: '0 auto', padding: '24px', display: 'flex', gap: 24 }}>
      <div style={{ width: 280, height: 380, borderRadius: 16, background: 'var(--white)', border: '1px solid var(--border)' }} className="animate-pulse" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ height: 140, borderRadius: 16, background: 'var(--white)', border: '1px solid var(--border)' }} className="animate-pulse" />)}
=======
    <div style={{ maxWidth: '95%', margin: '0 auto', padding: '24px', display: 'flex', gap: 20 }}>
      <div style={{ width: 240, height: 360, borderRadius: 14, background: 'var(--white)', border: '1px solid var(--border)' }} className="animate-pulse" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 130, borderRadius: 14, background: 'var(--white)', border: '1px solid var(--border)' }} className="animate-pulse" />
        ))}
>>>>>>> origin/GuestPage_Rihem
      </div>
    </div>
  </div>
);

const ProfileError = ({ message }) => (
<<<<<<< HEAD
  <div style={{ marginLeft: 280, minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: 'var(--white)', borderRadius: 16, border: `1px solid var(--border)`, padding: 40, textAlign: 'center', maxWidth: 400, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <p style={{ color: 'var(--error)', fontWeight: 500, fontSize: 17, margin: '0 0 16px' }}>❌ {message || "Profil introuvable"}</p>
      <button
        style={{ padding: '8px 20px', background: 'var(--primary)', color: 'var(--white)', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer', fontSize: 14 }}
=======
  <div style={{
    marginLeft: 280, minHeight: '100vh', background: 'var(--background)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      background: 'var(--white)', borderRadius: 14,
      border: `1px solid var(--border)`, padding: 40,
      textAlign: 'center', maxWidth: 400,
    }}>
      <p style={{ color: 'var(--error)', fontWeight: 500, fontSize: 16, margin: '0 0 16px' }}>
        ❌ {message || "Profil introuvable"}
      </p>
      <button
        style={{
          padding: '8px 20px', background: 'var(--primary)',
          color: 'var(--white)', border: 'none', borderRadius: 8,
          fontWeight: 500, cursor: 'pointer', fontSize: 14,
        }}
>>>>>>> origin/GuestPage_Rihem
        onClick={() => window.history.back()}
      >
        ← Retour
      </button>
    </div>
  </div>
);

export default ClientProfilePage;