// components/admin/Navbar.jsx
import { useState } from "react";
import { IoMdNotifications, IoMdMenu, IoMdClose, IoMdSearch } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isSidebarOpen = true, onToggleSidebar }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useState(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav
        className={`fixed top-0 z-50 bg-white border-b shadow-sm transition-all duration-300 ${
          isSidebarOpen ? "left-64" : "left-20"
        } right-0`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          
          {/* Left: Logo + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
            </button>
            
            {/* Desktop Sidebar Toggle (optional) */}
            <button
              onClick={onToggleSidebar}
              className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isSidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
            >
             
            </button>

            {/* Brand/Title */}
            <Link 
              to="/admin/dashboard" 
              className="text-lg md:text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search clients, chefs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm 
                  focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle search"
          >
            <IoMdSearch size={22} />
          </button>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Notifications */}
            <button 
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <IoMdNotifications size={22} />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Add Chef Button - Desktop */}
            <Link
              to="/admin/chefs/create"
              className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
                hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow"
            >
              <span>+</span> Add Chef
            </Link>

            {/* Add Chef Button - Mobile (icon only) */}
            <Link
              to="/admin/chefs/create"
              className="md:hidden flex items-center justify-center w-10 h-10 bg-blue-600 text-white 
                rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              aria-label="Add Chef"
            >
              <span className="text-xl font-bold">+</span>
            </Link>

            {/* Profile Dropdown Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 md:gap-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Profile menu"
            >
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                alt="Admin"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white shadow-sm"
              />
              <span className="hidden md:block text-gray-700 font-medium text-sm">Admin</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (expands below navbar) */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-3 border-t bg-gray-50">
            <div className="relative">
              <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm 
                  focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg py-2 px-4 space-y-1">
            <Link
              to="/admin/chefs/create"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-lg font-bold text-blue-600">+</span>
              <span className="font-medium">Add Chef</span>
            </Link>
            
            <div className="border-t my-2" />
            
            <Link
              to="/admin/profile"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                alt="Admin"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">My Profile</span>
            </Link>
            
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>⚙️</span>
              <span className="font-medium">Settings</span>
            </Link>
            
            <div className="border-t my-2" />
            
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                // Handle logout
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              <span>🚪</span>
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;