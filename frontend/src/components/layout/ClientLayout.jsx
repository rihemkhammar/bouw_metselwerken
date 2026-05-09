import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "../client/sidebar";

export default function ClientLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const breadcrumbMap = {
    "/client/Dashboard": { title: "Tableau de bord", parent: "Espace Client" },
    "/client/ClientProfile": { title: "Profil", parent: "Espace Client" },
    "/client/projetes": { title: "Mes Projets", parent: "Espace Client" },
    "/client/Service": { title: "Nos service", parent: "Espace Client" },
    "/client/Contact":  {title: "Contact" , parent: "Espace Client" }
  };

  // Routes qui gèrent leur propre header
  const routesWithOwnHeader = ["/client/projeteDetail"];

  const hasOwnHeader = routesWithOwnHeader.some((route) =>
    location.pathname.startsWith(route)
  );

  const currentRoute = breadcrumbMap[location.pathname] || {};

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onToggle={(open) => setIsSidebarOpen(open)} />

      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header masqué si la page a le sien */}
        {!hasOwnHeader && (
          <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-800">
                {currentRoute.title || "Page"}
              </h1>
            </div>
            {currentRoute.title && (
              <nav
                className="breadcrumb block text-xs text-gray-500 mt-1"
                aria-label="Fil d'Ariane"
              >
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Accueil
                </Link>
                <span className="mx-1">›</span>
                <Link
                  to="/client/Dashboard"
                  className="hover:text-blue-600 transition-colors"
                >
                  Espace Client
                </Link>
                {currentRoute.parent !== currentRoute.title && (
                  <>
                    <span className="mx-1">›</span>
                    <span
                      className="text-gray-700 font-medium"
                      aria-current="page"
                    >
                      {currentRoute.title}
                    </span>
                  </>
                )}
              </nav>
            )}
          </header>
        )}

        {/* Pas de padding si la page gère son propre layout */}
        <div className={hasOwnHeader ? "" : "p-6"}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}