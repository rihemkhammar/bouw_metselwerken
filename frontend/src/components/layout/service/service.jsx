import React from "react";
import styles from "./service.module.css";
import servicesData from "./data/service.json";

import { GiCrane, GiBrickWall, GiBroom } from "react-icons/gi";
import { FaHammer, FaLandmark, FaHardHat } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";

const iconMap = {
  GiCrane,
  FaHammer,
  FaLandmark,
  FaHardHat,
  GiBrickWall,
  IoIosWater,
  GiBroom
};

export default function Service() {
  return (
    <section className={styles.servicesSection} id="services">
      <div className={styles.servicesHeader}>
        <h2 className={styles.servicesTitle}>Nos Services</h2>
        <p className={styles.servicesSubtitle}>
          Des solutions professionnelles pour tous vos projets de construction et rénovation
        </p>
      </div>
      
      <div className={styles.servicesGrid}>
        {servicesData.map((service, index) => {
          const IconComponent = iconMap[service.iconName];
          
          return (
            <article 
              key={service.id} 
              className={styles.serviceCard}
              style={{ 
                '--card-color': service.color || '#64748b',
                '--stagger-delay': `${index * 0.12}s` 
              }}
            >
              <div className={styles.serviceIconWrapper}>
                {IconComponent && <IconComponent className={styles.serviceIcon} />}
              </div>

              <h3 className={styles.serviceName}>{service.name}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}