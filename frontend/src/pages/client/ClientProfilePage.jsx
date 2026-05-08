
import React, { useState, useEffect } from 'react';
import {
  Phone, Mail, MapPin, Building2, Briefcase,
  Calendar, CheckCircle, User, Shield,
  FolderKanban, History, Package, ClipboardList
} from 'lucide-react';
import { fetchClientProfile } from '../../services/api';
import { jwtDecode } from "jwt-decode";
import './ClientProfilePage.css';

const formatDate = (str) => {
  if (!str) return '';
  return new Date(str).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

function ClientProfilePage({ userId, token }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  if (!token) return;

  const decoded = jwtDecode(token);
  console.log("DECODED:", decoded);

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

  return (
    
    <div className="profile-fullpage">
      <header className="profile-topbar">
        <div className="topbar-left">
          <h1>Profil</h1>
          <span className="breadcrumb">Dashboard / Profil</span>
        </div>
        {/* Bouton de modification supprimé */}
      </header>

      <div className="profile-grid">
        <aside className="profile-identity-card">
          <div className="identity-avatar">
            <div className="avatar-large">{getInitials(user.name)}</div>
            {isActive && <span className="avatar-status" />}
          </div>
          <div className="identity-info">
            <h2 className="identity-name">
              {user.companyName || user.name}
            </h2>
            {user.department && <p className="identity-dept">{user.department}</p>}
          </div>
          <div className="identity-badges">
            <span className="badge badge-primary"><Shield size={12} /> {user.status}</span>
            {user.matricule && <span className="badge badge-outline">{user.matricule}</span>}
          </div>
          <div className="identity-meta">
            <div className="meta-item">
              <Calendar size={14} />
              <span>Membre depuis 24 mai 2025</span>
            </div>
          </div>
        </aside>

        <main className="profile-details">
          <section className="details-section">
            <h3 className="section-title"><User size={18} /> Contact</h3>
            <div className="details-grid">
              <DetailItem icon={Mail} label="Email" value={user.email} />
              <DetailItem 
                icon={Phone} 
                label="Téléphone" 
                value={user.phone || 'Non renseigné'} 
              />
              <DetailItem 
                icon={MapPin} 
                label="Adresse" 
                value={user.address || 'Non renseignée'} 
                multiline 
              />
            </div>
          </section>

          <section className="details-section">
            <h3 className="section-title"><Building2 size={18} /> Entreprise</h3>
            <div className="details-grid">
              <DetailItem icon={Building2} label="Responsable" value={user.name} />
              {user.matricule && <DetailItem icon={Briefcase} label="Matricule" value={user.matricule} />}
              <DetailItem icon={CheckCircle} label="Statut" value={user.status} highlight={isActive} />
            </div>
          </section>

          <section className="details-section">
            <h3 className="section-title">Aperçu</h3>
            <div className="stats-row">
              <StatItem label="Projets" value={user.projects?.length || 0} Icon={FolderKanban} />
              <StatItem label="Demandes" value={user.requests?.length || 0} Icon={History} />
              <StatItem label="Services" value={user.services?.length || 0} Icon={Package} />
              <StatItem label="À faire" value="—" Icon={ClipboardList} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

const DetailItem = ({ icon: Icon, label, value, multiline }) => (
  <div className="detail-item">
    <div className="detail-icon"><Icon size={18} /></div>
    <div className="detail-content">
      <span className="detail-label">{label}</span>
      <span className={`detail-value ${multiline ? 'multiline' : ''}`}>{value}</span>
    </div>
  </div>
);

const StatItem = ({ label, value, Icon }) => {
  return (
    <div className="stat-item">
      <div className="stat-icon">{Icon && <Icon size={20} />}</div>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const ProfileLoader = () => (
  <div className="profile-fullpage">
    <div className="profile-topbar skeleton-topbar" />
    <div className="profile-grid">
      <aside className="profile-identity-card skeleton-card" />
      <main className="profile-details">
        {[...Array(3)].map((_, i) => (
          <section key={i} className="details-section skeleton-section">
            <div className="skeleton-text sm" />
            <div className="details-grid">
              {[...Array(3)].map((_, j) => <div key={j} className="skeleton-detail" />)}
            </div>
          </section>
        ))}
      </main>
    </div>
  </div>
);

const ProfileError = ({ message }) => (
  <div className="profile-fullpage profile-error">
    <div className="error-box">
      <p>❌ {message || "Profil introuvable"}</p>
      <button className="btn-primary" onClick={() => window.history.back()}>← Retour</button>
    </div>
  </div>
);

export default ClientProfilePage;