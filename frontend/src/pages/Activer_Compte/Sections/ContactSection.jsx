import React, { useState } from "react";
import { 
  FaLock, FaUser, FaHashtag, FaInfoCircle, FaCheckCircle, 
  FaExclamationCircle, FaShieldAlt, FaBook, FaPhone, FaEnvelope,
  FaChevronRight, FaUserPlus, FaEye, FaEyeSlash  // ← AJOUT : Icônes pour voir/masquer
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./activer_compte.module.css";
import { login } from "../../../services/authClientService";

const CompteForm = () => {
  const [form, setForm] = useState({ login: '', matricule: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ← NOUVEAU : Toggle visibilité password

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
      const res = await login(
        form.login,
        form.matricule,
        form.password
      );

      console.log("✅ Success:", res);
      setShowSuccess(true);

      setTimeout(() => {
        window.location.href = "/client_dashboard";
      }, 1000);

    } catch (err) {
      setServerError(err.message);
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
                  type={showPassword ? "text" : "password"}  // ← CHANGÉ : type dynamique
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`${styles.input} ${styles.inputWithToggle} ${errors.password ? styles.inputError : ''}`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                
                {/* 👁️ BOUTON TOGGLE VISIBILITÉ */}
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className={styles.togglePassword}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
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
              🔒 Connexion sécurisée • Vos données sont confidentielles • 
              <a href="/ForgotPassword">Mot de passe oublié ?</a>
            </p>
          </form>
        </div>

        {/* 📘 COLONNE DROITE : Guide & Informations */}
        <div className={styles.infoColumn}>
          
          {/* Carte Guide */}
          <div className={styles.guideCard}>
            <h2 className={styles.guideTitle}>
              <span className={styles.guideIcon} aria-hidden="true"><FaUserPlus size={18} /></span>
              Votre espace projet client
            </h2>
           <p className={styles.text}>Pour accéder à votre espace client, suivre l'avancement de votre projet ainsi que consulter l'évaluation des travaux réalisés, vous devez disposer d'un compte.
           </p>
<p className={styles.text}>Si vous êtes déjà client chez nous, veuillez effectuer une demande en remplissant le formulaire de création de compte.</p>

<p className={styles.text}>Merci de renseigner toutes les informations demandées afin de nous permettre de traiter votre demande dans les meilleurs délais.</p>

<p className={styles.text}>Une fois votre demande validée, vous recevrez un e-mail contenant les informations nécessaires pour accéder à votre compte.</p>

<p className={styles.text}>Vous pouvez également cliquer sur le bouton ci-dessous pour envoyer votre demande.</p>
  <Link to="/contact" className={styles.guideButton}>
    Demander la création 
  </Link>
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