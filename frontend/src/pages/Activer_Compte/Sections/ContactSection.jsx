import React, { useState } from "react";
import { 
  FaLock, FaUser, FaHashtag, FaInfoCircle, FaCheckCircle, 
  FaExclamationCircle, FaShieldAlt, FaBook, FaPhone, FaEnvelope,
  FaChevronRight
} from "react-icons/fa";
import styles from "./activer_compte.module.css";

const CompteForm = () => {
  const [form, setForm] = useState({ login: '', matricule: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
    setShowSuccess(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.login.trim()) errs.login = "L'identifiant est requis";
    if (!/^\d{12,13}$/.test(form.matricule.trim())) errs.matricule = "Format invalide (12 ou 13 chiffres)";
    if (!form.password) errs.password = "Le mot de passe est requis";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');
    
    try {
      // ⚠️ Remplacez par votre appel API réel
      await new Promise(res => setTimeout(res, 1200));
      
      setShowSuccess(true);
      console.log('✅ Authentification réussie:', form);
      // window.location.href = '/espace-contribuable';
      
    } catch {
      setServerError('Identifiants incorrects ou problème de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const helpInfo = [
    { 
      icon: FaHashtag, 
      title: "Matricule fiscal", 
      desc: "Identifiant unique de 12 ou 13 chiffres. Consultez votre avis d'imposition ou attestation de régularité.",
      iconColor: "var(--primary)"
    },
    { 
      icon: FaLock, 
      title: "Mot de passe", 
      desc: "Minimum 8 caractères. En cas d'oubli, utilisez la procédure de réinitialisation sécurisée.",
      iconColor: "var(--secondary)"
    },
    { 
      icon: FaShieldAlt, 
      title: "Sécurité", 
      desc: "Connexion chiffrée TLS 1.3. Ne partagez jamais vos identifiants. Déconnectez-vous après chaque session.",
      iconColor: "var(--success)"
    }
  ];

  const contactSupport = [
    { icon: FaPhone, label: "Support technique", value: "+216 71 123 456", href: "tel:+21671123456" },
    { icon: FaEnvelope, label: "Assistance", value: "support@impots.tn", href: "mailto:support@impots.tn" }
  ];

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        
        {/* 🔐 COLONNE GAUCHE : Formulaire */}
        <div className={styles.formCard}>
          
          <header className={styles.header}>
            <div className={styles.headerIcon} aria-hidden="true">
              <FaLock size={24} />
            </div>
            <div>
              <h1 className={styles.headerTitle}>Espace Contribuable</h1>
              <p className={styles.headerSubtitle}>Portail sécurisé de gestion fiscale</p>
            </div>
          </header>

          {/* Messages de statut */}
          {showSuccess && (
            <div className={`${styles.statusMessage} ${styles.statusSuccess}`} role="alert">
              <FaCheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p>Connexion réussie ! ✓</p>
                <p>Redirection vers votre espace personnel...</p>
              </div>
            </div>
          )}
          
          {serverError && (
            <div className={`${styles.statusMessage} ${styles.statusError}`} role="alert">
              <FaExclamationCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p>Échec de connexion</p>
                <p>{serverError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            
            {/* Login */}
            <div className={styles.fieldGroup}>
              <label htmlFor="login" className={`${styles.label} ${styles.labelRequired}`}>
                Identifiant / Login
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><FaUser size={16} /></span>
                <input
                  id="login"
                  name="login"
                  type="text"
                  value={form.login}
                  onChange={handleChange}
                  placeholder="ex : contribuable_84"
                  autoComplete="username"
                  className={`${styles.input} ${errors.login ? styles.inputError : ''}`}
                  aria-invalid={!!errors.login}
                  aria-describedby={errors.login ? "login-error" : undefined}
                />
              </div>
              {errors.login && (
                <p id="login-error" className={styles.errorMessage} role="alert">
                  <FaExclamationCircle size={12} /> {errors.login}
                </p>
              )}
            </div>

            {/* Matricule Fiscal */}
            <div className={styles.fieldGroup}>
              <label htmlFor="matricule" className={`${styles.label} ${styles.labelRequired}`}>
                Matricule Fiscal
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><FaHashtag size={16} /></span>
                <input
                  id="matricule"
                  name="matricule"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{12,13}"
                  value={form.matricule}
                  onChange={handleChange}
                  placeholder="12 ou 13 chiffres"
                  autoComplete="off"
                  className={`${styles.input} ${errors.matricule ? styles.inputError : ''}`}
                  aria-invalid={!!errors.matricule}
                  aria-describedby={errors.matricule ? "matricule-error" : undefined}
                />
              </div>
              {errors.matricule && (
                <p id="matricule-error" className={styles.errorMessage} role="alert">
                  <FaExclamationCircle size={12} /> {errors.matricule}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={`${styles.label} ${styles.labelRequired}`}>
                Mot de passe
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><FaLock size={16} /></span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
              </div>
              {errors.password && (
                <p id="password-error" className={styles.errorMessage} role="alert">
                  <FaExclamationCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true"></span>
                  <span className="srOnly">Connexion en cours...</span>
                  <span aria-hidden="true">Connexion en cours...</span>
                </>
              ) : (
                <>
                  Accéder à mon espace <FaChevronRight size={16} aria-hidden="true" />
                </>
              )}
            </button>

            <p className={styles.formFooter}>
              🔒 Connexion sécurisée • Conforme RGPD & ANSSI • 
              <a href="/mot-de-passe-oublie">Mot de passe oublié ?</a>
            </p>
          </form>
        </div>

        {/* 📘 COLONNE DROITE : Guide & Informations */}
        <div className={styles.infoColumn}>
          
          {/* Carte Guide */}
          <div className={styles.guideCard}>
            <h2 className={styles.guideTitle}>
              <span className={styles.guideIcon} aria-hidden="true"><FaBook size={18} /></span>
              Guide de connexion
            </h2>
            
            <ul className={styles.guideList}>
              {helpInfo.map((item, index) => (
                <li key={index} className={styles.guideItem}>
                  <span 
                    className={styles.guideItemIcon} 
                    style={{ color: item.iconColor }}
                    aria-hidden="true"
                  >
                    <item.icon size={18} />
                  </span>
                  <div>
                    <p className={styles.guideItemTitle}>{item.title}</p>
                    <p className={styles.guideItemDesc}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Carte Support */}
          <div className={styles.supportCard}>
            <h3 className={styles.supportTitle}>
              <FaInfoCircle size={18} aria-hidden="true" /> Besoin d'aide ?
            </h3>
            
            <ul className={styles.supportList}>
              {contactSupport.map((item, idx) => (
                <li key={idx}>
                  <a href={item.href} className={styles.supportLink}>
                    <span className={styles.supportIcon} aria-hidden="true">
                      <item.icon size={18} />
                    </span>
                    <div>
                      <p className={styles.supportLabel}>{item.label}</p>
                      <p className={styles.supportValue}>{item.value}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            
            <p className={styles.supportFooter}>
              🕒 Lun-Ven : 8h00 - 17h00 • Réponse sous 24h
            </p>
          </div>

          {/* Badge Sécurité */}
          <div className={styles.securityBadge}>
            <span className={styles.securityIcon} aria-hidden="true">
              <FaShieldAlt size={20} />
            </span>
            <div>
              <p className={styles.securityTitle}>Connexion certifiée</p>
              <p className={styles.securityDesc}>Chiffrement TLS 1.3 • Aucune donnée stockée localement</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CompteForm;
