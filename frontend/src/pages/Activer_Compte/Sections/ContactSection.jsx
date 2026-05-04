import React, { useState } from "react";
import { 
  FaLock, FaUser, FaHashtag, FaInfoCircle, FaCheckCircle, 
  FaExclamationCircle, FaShieldAlt, FaBook, FaPhone, FaEnvelope,
  FaChevronRight, FaUserPlus, FaEye, FaEyeSlash, FaBuilding, FaIdCard
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./activer_compte.module.css";

const CompteForm = () => {
  // ✅ Champs adaptés pour une demande de création de compte
  const [form, setForm] = useState({
    fullName: '',           // Nom complet du responsable
    companyName: '',        // Raison sociale de l'entreprise
    email: '',              // Email professionnel
    phone: '',              // Téléphone de contact
    matricule: '',          // Matricule fiscal (12-13 chiffres)
    login: '',              // Identifiant souhaité
    message: ''             // Message optionnel pour l'admin
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
    setShowSuccess(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Le nom complet est requis";
    if (!form.companyName.trim()) errs.companyName = "La raison sociale est requise";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Email invalide";
    if (!/^(\+32|0)[1-9]\d{7,8}$/.test(form.phone.trim())) errs.phone = "Numéro de téléphone invalide";
    if (!/^\d{12,13}$/.test(form.matricule.trim())) errs.matricule = "Format invalide (12 ou 13 chiffres)";
    if (!form.login.trim() || form.login.length < 4) errs.login = "Identifiant requis (min. 4 caractères)";
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
      // ✅ Appel au nouveau endpoint de demande de compte
      const res = await requestAccountCreation({
        fullName: form.fullName.trim(),
        companyName: form.companyName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        matricule: form.matricule.trim(),
        login: form.login.trim().toLowerCase(),// Conservé si vous ajoutez un mot de passe initial
        message: form.message.trim(),
        requestedAt: new Date().toISOString()
      });

      console.log("✅ Demande envoyée:", res);
      setShowSuccess(true);

      // ✅ Redirection vers page de confirmation ou remerciement
      setTimeout(() => {
        window.location.href = "/account-request-confirmation";
      }, 2000);

    } catch (err) {
      setServerError(err.message || "Une erreur est survenue lors de l'envoi de votre demande");
    } finally {
      setLoading(false);
    }
  };
 
  const contactSupport = [
    { icon: FaPhone, label: "Support technique", value: "(+32) 465 51 361", href: "tel:+3246551361" },
    { icon: FaEnvelope, label: "Assistance", value: "gharredam@gmail.com", href: "mailto:gharredam@gmail.com" }
  ];

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        
        {/* 🔐 COLONNE GAUCHE : Formulaire de demande */}
        <div className={styles.formCard}>
          
          <header className={styles.header}>
            <div className={styles.headerIcon} aria-hidden="true">
              <FaUserPlus size={24} />
            </div>
            <div>
              <h1 className={styles.headerTitle}>Demande de Compte Client</h1>
              <p className={styles.headerSubtitle}>Créez votre espace professionnel sécurisé</p>
            </div>
          </header>

          {/* Messages de statut */}
          {showSuccess && (
            <div className={`${styles.statusMessage} ${styles.statusSuccess}`} role="alert">
              <FaCheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p>Demande envoyée avec succès ! ✓</p>
                <p>Vous recevrez un email de confirmation sous 24h...</p>
              </div>
            </div>
          )}
          
          {serverError && (
            <div className={`${styles.statusMessage} ${styles.statusError}`} role="alert">
              <FaExclamationCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p>Erreur lors de l'envoi</p>
                <p>{serverError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            
            {/* Nom complet */}
            <div className={styles.fieldGroup}>
              <label htmlFor="fullName" className={`${styles.label} ${styles.labelRequired}`}>
                Nom complet du responsable
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><FaUser size={16} /></span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="ex : Jean Dupont"
                  autoComplete="name"
                  className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                />
              </div>
              {errors.fullName && (
                <p id="fullName-error" className={styles.errorMessage} role="alert">
                  <FaExclamationCircle size={12} /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Raison sociale */}
            <div className={styles.fieldGroup}>
              <label htmlFor="companyName" className={`${styles.label} ${styles.labelRequired}`}>
                Raison sociale de l'entreprise
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><FaBuilding size={16} /></span>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="ex : Société ABC SPRL"
                  autoComplete="organization"
                  className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`}
                  aria-invalid={!!errors.companyName}
                  aria-describedby={errors.companyName ? "companyName-error" : undefined}
                />
              </div>
              {errors.companyName && (
                <p id="companyName-error" className={styles.errorMessage} role="alert">
                  <FaExclamationCircle size={12} /> {errors.companyName}
                </p>
              )}
            </div>

            {/* Email professionnel */}
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={`${styles.label} ${styles.labelRequired}`}>
                Email professionnel
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><FaEnvelope size={16} /></span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contact@entreprise.be"
                  autoComplete="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className={styles.errorMessage} role="alert">
                  <FaExclamationCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div className={styles.fieldGroup}>
              <label htmlFor="phone" className={`${styles.label} ${styles.labelRequired}`}>
                Téléphone de contact
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><FaPhone size={16} /></span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+32 4XX XX XX XX"
                  autoComplete="tel"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className={styles.errorMessage} role="alert">
                  <FaExclamationCircle size={12} /> {errors.phone}
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

            {/* Identifiant souhaité */}
            <div className={styles.fieldGroup}>
              <label htmlFor="login" className={`${styles.label} ${styles.labelRequired}`}>
                Identifiant souhaité
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><FaIdCard size={16} /></span>
                <input
                  id="login"
                  name="login"
                  type="text"
                  value={form.login}
                  onChange={handleChange}
                  placeholder="ex : entreprise_abc"
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

            {/* Message optionnel */}
            <div className={styles.fieldGroup}>
              <label htmlFor="message" className={styles.label}>
                Message complémentaire (optionnel)
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Précisez vos besoins ou questions..."
                rows={3}
                className={styles.textarea}
              />
            </div>

            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true"></span>
                  <span className="srOnly">Envoi en cours...</span>
                  <span aria-hidden="true">Envoi en cours...</span>
                </>
              ) : (
                <>
                  Envoyer ma demande <FaChevronRight size={16} aria-hidden="true" />
                </>
              )}
            </button>

            <p className={styles.formFooter}>
              🔒 Vos données sont sécurisées • Traitement sous 24h • 
              <a href="/privacy">Politique de confidentialité</a>
            </p>
          </form>
        </div>

        {/* 📘 COLONNE DROITE : Guide & Informations */}
        <div className={styles.infoColumn}>
          
          {/* Carte Guide */}
          {/* Carte Guide */}
<div className={styles.guideCard}>
  <h2 className={styles.guideTitle}>
    <span className={styles.guideIcon} aria-hidden="true"><FaInfoCircle size={18} /></span>
    Comment ça marche ?
  </h2>
  
  <ol className={styles.stepsList}>
    <li>Remplissez ce formulaire avec vos informations professionnelles</li>
    <li>Notre équipe vérifie votre demande sous 24h ouvrées</li>
    <li>Vous recevez un email avec vos identifiants d'accès</li>
    <li>Connectez-vous à votre espace client sécurisé</li>
  </ol>
  
  <p className={styles.text}>
    <strong>Avantages de votre espace client :</strong>
  </p>
  <ul className={styles.benefitsList}>
    <li>✓ Suivi en temps réel de vos projets</li>
    <li>✓ Accès aux documents et factures</li>
    <li>✓ Messagerie directe avec votre conseiller</li>
    <li>✓ Historique complet de vos interventions</li>
  </ul>

  {/* ✅ NOUVEAU : Bloc pour les clients déjà inscrits */}
  <div className={styles.existingClientBox}>
    <FaCheckCircle size={18} className={styles.existingClientIcon} aria-hidden="true" />
    <div>
      <p className={styles.existingClientText}>
        <strong>Vous avez déjà un compte ?</strong><br />
        Accédez directement à votre espace personnel.
      </p>
      <Link to="/login" className={styles.loginLink}>
        Se connecter <FaChevronRight size={14} />
      </Link>
    </div>
  </div>
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

        </div>
      </div>
    </section>
  );
};

export default CompteForm;