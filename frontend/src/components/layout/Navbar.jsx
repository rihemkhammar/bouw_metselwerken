import { assets } from "../../assets/assets";
import { Phone } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden"; //prevent from scrolling
    } else {
      document.body.style.overflow = "auto"; //allow scrolling
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileMenu]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b-4 border-[#0073CF]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-20 py-4">
        {/* LEFT: LOGO */}
        <div className="flex items-center">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-[70px] md:h-[55px] w-auto object-contain"
          />
        </div>

        {/* CENTER: MENU */}
        <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a
            href="#Header"
            className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all"
          >
            Home
          </a>

          <a
            href="#About"
            className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all"
          >
            About
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
            Work Gallery
          </a>
          <a
            href="#Testimonials"
            className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all"
          >
            Contact
          </a>
        </ul>

        {/* RIGHT: CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+19164120162"
            className="text-[#111184] font-bold flex items-center gap-2 hover:text-[#0073CF]"
          >
            <Phone size={18} />
            (916) 412-0162
          </a>

          <a
            href="#contact"
            className="bg-[#f16c13] text-white 	font-bold px-5 py-2 rounded-full hover:opacity-90"
          >
            Get Started Today
          </a>
        </div>
        {/* MOBILE MENU ICON */}
        <img
          onClick={() => setShowMobileMenu(true)}
          src={assets.menu_icon2}
          className="md:hidden w-10 cursor-pointer"
        ></img>
      </div>
      {/*---------mobile-menu-----*/}
      <div
        className={`md:hidden ${showMobileMenu ? "fixed w-full" : "h-0 w-0"}
     right-0 top-0 bottom-0 overflow-hidden bg-white transition-all`}
      >
        <div className="flex justify-end p-6 cursor-pointer">
          <img
            onClick={() => setShowMobileMenu(false)}
            src={assets.cross_icon}
            className="w-6"
            alt=""
          ></img>
        </div>
        <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium text-gray-700">
          <a
            onClick={() => setShowMobileMenu(false)}
            href="#Header"
            className="px-4 py-2 w-full text-center"
          >
            Home
          </a>

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

          <a
            onClick={() => setShowMobileMenu(false)}
            href="#Testimonials"
            className="px-4 py-2 w-full text-center"
          >
            Contact
          </a>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
