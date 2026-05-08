import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "../client/sidebar";

export default function ClientLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Configuration des breadcrumbs
  const breadcrumbMap = {
    "/client/Dashboard": { title: "Tableau de bord", parent: "Espace Client" },
    "/client/ClientProfile": { title: "Profil", parent: "Espace Client" },
    "/client/projetes":{ title: "Mes Projets", parent: "Espace Client" },
    // Ajoutez d'autres routes ici
  };

  const currentRoute = breadcrumbMap[location.pathname] || {};

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onToggle={(open) => setIsSidebarOpen(open)} />

      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30">
          
          {/* 🔹 Titre de la page - EN HAUT, en gras */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {currentRoute.title || "Page"}
            </h1>
          </div>

          {/* 🔹 Breadcrumb dynamique - EN DESSOUS, texte petit */}
          {currentRoute.title && (
            <nav className="breadcrumb block text-xs text-gray-500 mt-1" aria-label="Fil d'Ariane">
              <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
              <span className="mx-1">›</span>
              <Link to="/client/Dashboard" className="hover:text-blue-600 transition-colors">Espace Client</Link>
              {currentRoute.parent !== currentRoute.title && (
                <>
                  <span className="mx-1">›</span>
                  <span className="text-gray-700 font-medium" aria-current="page">
                    {currentRoute.title}
                  </span>
                </>
              )}
            </nav>
          )}

        </header>
        
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}