import React, { useState } from "react";
import { 
  FaUser, FaBuilding, FaEnvelope, FaPhone, FaInfoCircle, 
  FaCheckCircle, FaExclamationCircle, FaChevronRight, FaUserPlus 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { requestAccountCreation } from "../../../services/api"; 
import styles from "./activer_compte.module.css";

const CompteForm = () => {
  const [form, setForm] = useState({
    name: '',              
    email: '',             
    phone: '',             
    companyName: '',       
    description: ''        
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
    setShowSuccess(false);
  };

 
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Le nom complet est requis";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Email invalide";
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
      // ✅ Appel API compatible backend
      const res = await requestAccountCreation({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || undefined,
        companyName: form.companyName.trim() || undefined,
        description: form.description.trim() || undefined,
      });

      console.log("✅ Signup réussi:", res);
      setShowSuccess(true);

     
      /*setTimeout(() => {
        window.location.href = "/account-request-confirmation";
      }, 2000);*/

    } catch (err) {
      console.error("❌ Signup error:", err);
      setServerError(err.message || "Une erreur est survenue lors de l'envoi");
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
        
        {/* COLONNE GAUCHE : Formulaire */}
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
            
            {/*  Nom complet (name) */}
            <div className={styles.fieldGroup}>
              <label htmlFor="name" className={`${styles.label} ${styles.labelRequired}`}>
                Nom complet du responsable 
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><FaUser size={16} /></span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="ex : Jean Dupont"
                  autoComplete="name"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </div>
              {errors.name && (
                <p id="name-error" className={styles.errorMessage} role="alert">
                  <FaExclamationCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
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

            {/* Téléphone (optionnel) */}
            <div className={styles.fieldGroup}>
              <label htmlFor="phone" className={styles.label}>
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
                  className={styles.input}
                />
              </div>
            </div>

            {/* Nom entreprise (optionnel) */}
            <div className={styles.fieldGroup}>
              <label htmlFor="companyName" className={styles.label}>
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
                  className={styles.input}
                />
              </div>
            </div>

            {/* Description / Message (optionnel) */}
            <div className={styles.fieldGroup}>
              <label htmlFor="description" className={styles.label}>
                Message complémentaire (optionnel)
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
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

        {/*  COLONNE DROITE : Guide */}
        <div className={styles.infoColumn}>
          <div className={styles.guideCard}>
            <h2 className={styles.guideTitle}>
              <span className={styles.guideIcon} aria-hidden="true"><FaInfoCircle size={18} /></span>
              Comment ça marche ?
            </h2>
            
            <ul className={styles.stepsList}>
              <li>Remplissez ce formulaire avec vos informations professionnelles</li>
              <li>Notre équipe vérifie votre demande sous 24h ouvrées</li>
              <li>Vous recevez un email avec vos identifiants d'accès</li>
              <li>Connectez-vous à votre espace client sécurisé</li>
            </ul>
            
            <p className={styles.text}>
              <strong>Avantages de votre espace client :</strong>
            </p>
            <ul className={styles.benefitsList}>
              <li>✓ Suivi en temps réel de vos projets</li>
              <li>✓ Accès aux documents et factures</li>
              <li>✓ Messagerie directe avec votre conseiller</li>
              <li>✓ Historique complet de vos interventions</li>
            </ul>

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