// Footer.jsx
import React from "react";
import styles from "./Footer.module.css";

import { HiMail } from "react-icons/hi";
import { BsFillTelephoneFill, BsWhatsapp } from "react-icons/bs";
import { 
  FaTwitter, FaGithub, FaLinkedin, FaInstagram, 
  FaFacebook, FaMapMarkerAlt, FaBusinessTime, FaArrowUp 
} from "react-icons/fa";

import LOGO from "./../../../assets/logo_dark.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "À propos", href: "/about" },
  ];

  const resourceLinks = [
    { label: "Blog", href: "/blog" },
    { label: "Documentation", href: "/docs" },
    { label: "FAQ", href: "/faq" },
    { label: "Support", href: "/support" },
  ];

  const socialLinks = [
    { name: "Instagram", href: "#", icon: <FaInstagram size={20} />, color: "#E4405F" },
    { name: "Facebook", href: "#", icon: <FaFacebook size={20} />, color: "#1877F2" },
    { name: "LinkedIn", href: "#", icon: <FaLinkedin size={20} />, color: "#0A66C2" },
    { name: "Twitter", href: "#", icon: <FaTwitter size={20} />, color: "#1DA1F2" },
  ];

  const contacts = [
    {
      icon: <FaMapMarkerAlt />,
      text: "123 Rue de l'Innovation, Tunis",
      type: "text"
    },
    {
      icon: <BsFillTelephoneFill />,
      text: "+216 79 123 456",
      link: "tel:+21679123456",
      type: "phone"
    },
    {
      icon: <HiMail />,
      text: "contact@bouwmetselwerken.com",
      link: "mailto:contact@bouwmetselwerken.com",
      type: "email"
    },
    {
      icon: <FaBusinessTime />,
      text: "Lun - Ven : 08h00 – 17h00",
      type: "text"
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Section principale */}
        <div className={styles.grid}>
          
          {/* Brand & Social */}
          <div className={`${styles.column} ${styles.brand}`}>
            <img 
              src={LOGO} 
              alt="BOUW METSELWERKEN - Logo" 
              className={styles.logo} 
              loading="lazy"
            />
            
            
            <div className={styles.social}>
              {socialLinks.map((s) => (
                <a 
                  key={s.name} 
                  href={s.href} 
                  className={styles.socialIcon}
                  aria-label={`Suivez-nous sur ${s.name}`}
                  style={{ '--hover-color': s.color }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
         
          {/* Navigation */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Navigation</h3>
            <nav aria-label="Navigation principale">
              {navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className={styles.link}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Ressources */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Ressources</h3>
            <nav aria-label="Ressources">
              {resourceLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className={styles.link}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Contact</h3>
            <address className={styles.contactList}>
              {contacts.map((item, i) => (
                <div key={i} className={styles.contactItem}>
                  <span className={styles.icon} aria-hidden="true">{item.icon}</span>
                  {item.link ? (
                    <a 
                      href={item.link} 
                      className={styles.contactLink}
                      aria-label={`Nous contacter par ${item.type}`}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className={styles.contactText}>{item.text}</span>
                  )}
                </div>
              ))}
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <p>&copy; {currentYear} <strong>BOUW METSELWERKEN</strong>. Tous droits réservés.</p>
          <button 
            onClick={scrollToTop} 
            className={styles.scrollTop}
            aria-label="Retour en haut de page"
          >
            <FaArrowUp size={16} />
          </button>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;