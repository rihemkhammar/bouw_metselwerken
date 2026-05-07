import React, { useState, useEffect } from "react";
import { logout } from "../../services/Logout";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  ListOrdered,
} from "lucide-react";

const defaultMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    link: "/dashboard",
  },
  {
    id: "chefs",
    label: "Chefs de services",
    icon: <Users size={20} />,
    children: [
      {
        id: "create-chef",
        label: "Créer un compte",
        icon: <PlusCircle size={18} />,
        link: "/admin/chefs/create",
      },
      {
        id: "list-chefs",
        label: "Liste des chefs",
        icon: <ListOrdered size={18} />,
        link: "/admin/chefs",
      },
    ],
  },
  {
    id: "clients",
    label: "Clients",
    icon: <Users size={20} />,
    children: [
      {
        id: "requests-clients",
        label: "requests des clients ",
        icon: <PlusCircle size={18} />,
        link: "/admin/clients/demandes",
      },
      {
        id: "list-clients",
        label: "liste des clients",
        icon: <ListOrdered size={18} />,
        link: "/admin/clients",
      },
    ],
  },
  {
    id: "contact-requests",
    label: "Contact Requests",
    icon: <ListOrdered size={18} />,
    link: "/admin/guests/demandes",
  },
  {
    id: "settings",
    label: "Paramètres",
    icon: <Settings size={20} />,
    link: "/settings",
  },
];

export default function Sidebar({ menuItems = defaultMenuItems, onToggle }) {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-state");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("sidebar-state", JSON.stringify(isOpen));
    if (onToggle) onToggle(isOpen);
  }, [isOpen, onToggle]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleMenu = (id) =>
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside
      role="navigation"
      aria-expanded={isOpen}
      className={`fixed top-0 left-0 h-screen bg-slate-800 text-slate-100 transition-all duration-300 ease-in-out z-50 flex flex-col shadow-xl
        ${isOpen ? "w-64" : "w-20"}`}
    >
      <div className="flex items-center justify-end p-4">
        <button
          onClick={toggleSidebar}
          aria-label={isOpen ? "Réduire le menu" : "Agrandir le menu"}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = item.link && location.pathname.startsWith(item.link);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.id}>
              {hasChildren ? (
                // Parent with children stays a button
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={`group flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200
            ${isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span
                    className={`ml-3 flex-1 text-left ${isOpen ? "opacity-100" : "opacity-0"}`}
                  >
                    {item.label}
                  </span>
                  {isOpen &&
                    (openMenus[item.id] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </button>
              ) : (
                // ✅ Direct link for items without children
                <Link
                  to={item.link}
                  className={`group flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200
            ${isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span
                    className={`ml-3 flex-1 text-left ${isOpen ? "opacity-100" : "opacity-0"}`}
                  >
                    {item.label}
                  </span>
                </Link>
              )}

              {/* Children items */}
              {hasChildren && openMenus[item.id] && isOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={child.link}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm
                ${
                  location.pathname === child.link
                    ? "bg-blue-500 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                    >
                      <span className="flex-shrink-0 mr-2">{child.icon}</span>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="group flex items-center px-3 py-2.5 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span
            className={`ml-3 whitespace-nowrap transition-all duration-200 ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  );
}
