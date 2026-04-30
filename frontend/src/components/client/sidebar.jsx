import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

const defaultMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, link: '/dashboard' },
  { id: 'clients', label: 'Clients', icon: <Users size={20} />, link: '/clients' },
  { id: 'settings', label: 'Paramètres', icon: <Settings size={20} />, link: '/settings' },
];

export default function Sidebar({ menuItems = defaultMenuItems, onToggle }) {
  // Initialisation sécurisée pour le SSR
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-state');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  const [activePath, setActivePath] = useState('');

  // Persistance & callback
  useEffect(() => {
    localStorage.setItem('sidebar-state', JSON.stringify(isOpen));
    if (onToggle) onToggle(isOpen);
  }, [isOpen, onToggle]);

  // Détection du chemin actif
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname);
    }
  }, []);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <aside
      role="navigation"
      aria-expanded={isOpen}
      className={`fixed top-0 left-0 h-screen bg-slate-800 text-slate-100 transition-all duration-300 ease-in-out z-50 flex flex-col shadow-xl
        ${isOpen ? 'w-64' : 'w-20'}`}
    >
      {/* Bouton de bascule */}
      <div className="flex items-center justify-end p-4">
        <button
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Réduire le menu' : 'Agrandir le menu'}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activePath === item.link || activePath.startsWith(item.link + '/');
          return (
            <a
              key={item.id}
              href={item.link}
              onClick={() => setActivePath(item.link)}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
            >
              <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>
              
              <span
                className={`ml-3 whitespace-nowrap transition-all duration-200
                  ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none absolute'}`}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </span>

              {/* Tooltip en mode réduit */}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </a>
          );
        })}
      </nav>

      {/* Pied de page / Déconnexion */}
      <div className="p-4 border-t border-slate-700">
        <a
          href="/logout"
          className="group flex items-center px-3 py-2.5 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className={`ml-3 whitespace-nowrap transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            Déconnexion
          </span>
        </a>
      </div>
    </aside>
  );
}