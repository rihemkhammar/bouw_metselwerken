import React from 'react';
import styles from "./project.module.css";
import projectsData from './data/projectsData';

const ProjectsSection = () => {
  return (
        <div className={styles.container} id="Projects">
    
    <div className={styles.wrapper}>
    <section id="nos-projets" className={styles.projectsSection}>
      <h2>Nos Projets</h2>

      <div className={styles.projetsGrid}>
      {projectsData.map((project) => (
        <article key={project.id} className={styles.projetCard}>
          
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className={styles.projectImage}
          />

          <h3 className={styles.projectTitle}>{project.title}</h3>
          <p className={styles.projectDescription}>
            {project.description}
          </p>

        </article>
      ))}
    </div>
    </section>
    </div>
    </div>
  );
};

export default ProjectsSection;