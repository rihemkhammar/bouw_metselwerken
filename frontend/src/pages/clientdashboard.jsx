import React from "react";
import Sidebar from "../components/client/sidebar";
import projects from "../pages/data/projects.json";
import ProjectCard from "../components/client/ProjectCard";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      {/* Ta Sidebar doit rester en position fixed/absolute à gauche */}
      <Sidebar />

      {/* Zone principale : prend tout l'espace à droite de la sidebar */}
      <main className="ml-64 p-6"> {/* ⚠️ Adapte `ml-64` à la largeur réelle de ta sidebar */}
        
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--gris)]">
            <span className="text-4xl mb-3">📂</span>
            <p className="text-lg">Aucun projet disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;