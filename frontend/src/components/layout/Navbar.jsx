import { assets } from "../../assets/assets";
import { Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; 
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileMenu]);

  return (
    <div className="fixed top-0 left-0  w-full z-50 bg-white shadow-md border-b-4 border-[#0073CF]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
        {/* LEFT: LOGO */}
        <div className="flex items-center">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-[70px] md:h-[55px] w-auto object-contain"
          />
        </div>

        {/* CENTER: MENU */}
        <ul className="hidden lg:flex gap-6 lg:gap-8 text-gray-700 font-medium">
          <Link
            to= "/"
            className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all"
          >
            Accueil
          </Link>

          <a
            href="#About"
            className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all"
          >
            À propos
          </a>

          <a
            href="#Projects"
            className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all"
          >
            Services
          </a>

          <a
            href="#Testimonials"
            className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all"
          >
            Galerie
          </a>

          <Link
            to="/contact"
            className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all"
          >
            Contact
          </Link>
        </ul>

        {/* RIGHT: CTA */}
        <div className="hidden md:flex items-center gap-7">
          <a
            href="tel:+19164120162" 
            className="text-[#111184] font-bold flex items-center gap-2 hover:text-[#0073CF]"
          >
            <Phone size={18} />
            (+32) 465 51 361 
          </a>

          <Link
            
            className="bg-[#f16c13] text-white font-semibold px-5 py-2 rounded-full opacity-90 hover:opacity-90 transition"
          >
             Activer Votre Compte
          </Link>
        </div>
        {/* MOBILE MENU ICON */}
        <img
          onClick={() => setShowMobileMenu(true)}
          src={assets.menuall}
          className="lg:hidden w-7 cursor-pointer"
        ></img>
      </div>
      {/*---------mobile-menu-----*/}
      <div
        className={`lg:hidden ${showMobileMenu ? "fixed w-full" : "h-0 w-0"}
     right-0 top-0 bottom-0 overflow-hidden bg-white transition-all`}
      >
        <div className="flex justify-end p-7 cursor-pointer">
          <img
            onClick={() => setShowMobileMenu(false)}
            src={assets.closeDark}
            className="w-8"
            alt=""
          ></img>
        </div>
        <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium text-gray-700">
          <Link
            onClick={() => setShowMobileMenu(false)}
            to="/"
            className="px-4 py-2 w-full text-center"
          >
            Home
          </Link>

          <a
            onClick={() => setShowMobileMenu(false)}
            href="#About"
            className="px-4 py-2 w-full text-center"
          >
            About
          </a>

          <a
            onClick={() => setShowMobileMenu(false)}
            href="#Projects"
            className="px-4 py-2 w-full text-center"
          >
            Services
          </a>

          <a
            onClick={() => setShowMobileMenu(false)}
            href="#Testimonials"
            className="px-4 py-2 w-full text-center"
          >
            Work Gallery
          </a>

          <Link
            onClick={() => setShowMobileMenu(false)}
            to="/contact"
            className="px-4 py-2 w-full text-center"
          >
            Contact
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
