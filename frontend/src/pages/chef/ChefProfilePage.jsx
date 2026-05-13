import React, { useState, useEffect } from 'react';
import {
  Phone, Mail, MapPin, Building2, Briefcase,
  Calendar, CheckCircle, User,
  FolderKanban, History, Package, ClipboardList,
  Copy, Check,
  PlayCircle, Clock, CheckSquare, XCircle, Ban, AlertCircle, Layers,
  HardHat, FileText
} from 'lucide-react';
import { fetchChefProfile } from '../../services/api';
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
  background:    'var(--background)',
  text:          'var(--text)',
  secondaryText: 'var(--secondary-text)',
  white:         'var(--white)',
  border:        'var(--border)',
  success:       'var(--success)',
  error:         'var(--error)',
  warning:       'var(--warning)',
  gris:          'var(--gris)',
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
};

function ChefProfilePage() {
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
        const data = await fetchChefProfile(userId, token);
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
                    background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: palette.white, fontWeight: 600, fontSize: 26,
                  }}>
                    {getInitials(user.name)}
                  </div>
                  {isActive && (
                    <span style={{
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
                  {user.status}
                </span>
                {user.role && (
                  <span style={{
                    padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: 'rgba(0,115,207,0.08)', color: palette.primary,
                    border: `1px solid rgba(0,115,207,0.2)`,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}>
                    <HardHat size={10} />
                    {user.role}
                  </span>
                )}
              </div>

              {/* Member since */}
              <div style={{
                padding: '10px 16px', borderBottom: `1px solid var(--border)`,
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 12, color: palette.gris,
              }}>
                <Calendar size={13} style={{ color: palette.primary }} />
                Membre depuis {memberSince}
              </div>

              {/* Quick stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                  { label: 'Projets',    value: stats?.projects?.total  ?? 0 },
                  { label: 'Demandes',   value: stats?.requests?.total  ?? 0 },
                  { label: 'Services',   value: stats?.services?.total  ?? 0 },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: '14px 4px', textAlign: 'center',
                    borderRight: i < 2 ? `1px solid var(--border)` : 'none',
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: palette.primary }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: palette.gris, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main ── */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Contact */}
            <Section icon={User} title="Contact">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                <DetailItem icon={Mail}   label="Email"     value={user.email} />
                <DetailItem icon={Phone}  label="Téléphone" value={user.phone || '—'} />
                <DetailItem icon={MapPin} label="Adresse"   value={user.address || '—'} />
              </div>
            </Section>

            {/* Entreprise */}
            <Section icon={Building2} title="Entreprise">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                <DetailItem icon={Building2}   label="Entreprise" value={user.companyName || '—'} />
                <DetailItem icon={Briefcase}   label="Matricule"  value={user.matricule   || '—'} />
                <DetailItem icon={CheckCircle} label="Statut"     value={user.status} highlight={isActive} />
              </div>
            </Section>

            {/* Projets */}
            {stats?.projects && (
              <Section icon={FolderKanban} title="Projets">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                  <MiniStat label="Total"     value={stats.projects.total}      Icon={Layers}      color="primary" />
                  <MiniStat label="Planifiés" value={stats.projects.planned}    Icon={Clock}       color="primary" />
                  <MiniStat label="En cours"  value={stats.projects.inProgress} Icon={PlayCircle}  color="primary" />
                  <MiniStat label="Terminés"  value={stats.projects.completed}  Icon={CheckSquare} color="success" />
                </div>
              </Section>
            )}

            {/* Demandes */}
            {stats?.requests && (
              <Section icon={FileText} title="Demandes">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
                  <MiniStat label="Total"    value={stats.requests.total}    Icon={Layers}       color="primary"   />
                  <MiniStat label="En attente" value={stats.requests.pending} Icon={Clock}        color="warning"   />
                  <MiniStat label="Approuvées" value={stats.requests.approved} Icon={CheckSquare} color="success"   />
                  <MiniStat label="Refusées"  value={stats.requests.declined} Icon={XCircle}     color="error"     />
                  <MiniStat label="Bloquées"  value={stats.requests.blocked}  Icon={Ban}          color="gris"      />
                </div>
              </Section>
            )}

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
    </div>
    {children}
  </section>
);

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
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        background: bg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: c.icon,
      }}>
        <Icon size={13} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: c.val, lineHeight: 1, flexShrink: 0 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--gris)', fontWeight: 500, lineHeight: 1.3 }}>{label}</div>
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
        display: 'flex', alignItems: 'flex-start', gap: 10, padding: 10,
        borderRadius: 10,
        background: hovered ? 'var(--background)' : 'transparent',
        border: hovered ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.15s', cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 7, flexShrink: 0,
        background: hovered ? 'rgba(0,115,207,0.08)' : 'var(--background)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hovered ? 'var(--primary)' : 'var(--gris)',
        transition: 'background 0.15s, color 0.15s',
      }}>
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
            padding: 4, borderRadius: 6,
            color: copied ? 'var(--success)' : 'var(--gris)',
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
    <div style={{ maxWidth: '95%', margin: '0 auto', padding: '24px', display: 'flex', gap: 20 }}>
      <div style={{ width: 240, height: 360, borderRadius: 14, background: 'var(--white)', border: '1px solid var(--border)' }} className="animate-pulse" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 130, borderRadius: 14, background: 'var(--white)', border: '1px solid var(--border)' }} className="animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

const ProfileError = ({ message }) => (
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
        onClick={() => window.history.back()}
      >
        ← Retour
      </button>
    </div>
  </div>
);

export default ChefProfilePage;