// Footer.jsx
import React from "react";
import styles from "./Footer.module.css";

import { HiMail } from "react-icons/hi";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaMapMarkerAlt, FaBusinessTime } from "react-icons/fa";

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
    { name: "Instagram", href: "#", icon: <FaInstagram size={18} /> },
    { name: "Facebook", href: "#", icon: <FaFacebook size={18} /> },
    { name: "LinkedIn", href: "#", icon: <FaLinkedin size={18} /> },
  ];

  const contacts = [
    {
      icon: <FaMapMarkerAlt />,
      text: "123 Rue de l’Innovation, Tunis",
    },
    {
      icon: <BsFillTelephoneFill />,
      text: "+216 79 123 456",
      link: "tel:+21679123456",
    },
    {
      icon: <HiMail />,
      text: "contact@bouwmetselwerken.com",
      link: "mailto:contact@bouwmetselwerken.com",
    },
    {
      icon: <FaBusinessTime />,
      text: "Lun - Ven : 08h00 – 17h00",
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo */}
          <div className={styles.column}>
            <img src={LOGO} alt="logo" className={styles.logo} />
             <div className={styles.social}>
              {socialLinks.map((s) => (
                <a key={s.name} href={s.href} className={styles.socialIcon}>
                  {s.icon}
                </a>
              ))}
            </div>

          </div>
         
          {/* Navigation */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Navigation</h3>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className={styles.link}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Menu */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Menu</h3>
            {resourceLinks.map((link) => (
              <a key={link.label} href={link.href} className={styles.link}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Coordonnées</h3>

            {contacts.map((item, i) => (
              <div key={i} className={styles.contactItem}>
                <span className={styles.icon}>{item.icon}</span>

                {item.link ? (
                  <a href={item.link} className={styles.email}>
                    {item.text}
                  </a>
                ) : (
                  <span className={styles.text}>{item.text}</span>
                )}
              </div>
            ))}

            
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} BOUW METSELWERKEN</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;