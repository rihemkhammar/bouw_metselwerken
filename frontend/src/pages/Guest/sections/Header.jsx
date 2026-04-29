import Navbar from "../../../components/layout/Navbar";
import { assets } from "../../../assets/assets";
import { useState, useRef, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaTools,
  FaHardHat,
  FaHome,
  FaBuilding,
  FaPaintRoller,
  FaWater,
  FaLeaf,
  FaBrush,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const services = [
  { value: "", label: "Service souhaité", icon: null, disabled: true },
  {
    value: "masonry",
    label: "Maçonnerie",
    icon: FaBuilding,
    description: "Murs, fondations",
  },
  {
    value: "renovation",
    label: "Rénovation",
    icon: FaHome,
    description: "Modernisation",
  },
  {
    value: "restoration",
    label: "Restauration",
    icon: FaPaintRoller,
    description: "Pierres anciennes",
  },
  {
    value: "general-construction",
    label: "Construction générale",
    icon: FaHardHat,
    description: "Projets neufs",
  },
  {
    value: "repointing",
    label: "Rejointoiement rustique",
    icon: FaBrush,
    description: "Finitions",
  },
  {
    value: "waterproofing",
    label: "Traitement hydrofuge",
    icon: FaWater,
    description: "Protection humidité",
  },
  {
    value: "moss-removal",
    label: "Démoussage",
    icon: FaLeaf,
    description: "Nettoyage façades",
  },
  {
    value: "other",
    label: "Autre service",
    icon: FaTools,
    description: "Projet personnalisé",
  },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedService = services.find((s) => s.value === value);
  const SelectedIcon = selectedService?.icon;

  const handleSelect = (serviceValue) => {
    if (serviceValue) {
      setValue(serviceValue);
      setIsOpen(false);
    }
  };

  return (
    <div
      className="relative h-[55vh] md:h-screen w-full overflow-hidden"
      id="Header"
    >
      <Navbar />

      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={assets.workers}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full pt-40 md:pt-0 px-6 md:pl-40 md:pr-0 ">
        {/* LEFT: Hero Text */}
        <div className="text-white md:flex-1 lg:max-w-2xl text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
            Votre Projet , Notre Expertise
          </h1>
          <p className="text-lg md:text-2xl mt-4 drop-shadow-md">
            Nous transformons vos idées en réalisations solides, durables et
            parfaitement maîtrisées.
          </p>
          <div className="flex gap-4 mt-8 justify-center md:justify-start">
            <Link
              to = "/login"
              className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full text-lg hover:bg-[#0073CF] hover:text-white transition shadow-lg"
            >
              Se Connecter
            </Link>
          </div>
        </div>

        {/* RIGHT: Contact Form */}
        <div className="hidden md:flex h-full items-center">
          <div className="pt-10 md:pt-10 md:self-start">
            <div className="relative z-20 bg-white/70 h-screen md:p-10 md:w-[380px] md:pt-40 rounded-l-lg md:rounded-r-none shadow-xl gap-4 ">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Démarrons Votre Projet
              </h2>
              <form className="flex flex-col gap-5">
                <input
                  type="text"
                  placeholder="Nom"
                  className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-[#0073CF] transition"
                />
                <input
                  type="text"
                  placeholder="Téléphone"
                  className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-[#0073CF] transition"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-[#0073CF] transition"
                />

                {/* Services Dropdown */}
                <div
                  ref={dropdownRef}
                  className="border bg-white rounded focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-[#0073CF] transition"
                >
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-3 py-2"
                  >
                    <span
                      className={`truncate ${
                        !value ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {selectedService?.label || "Service souhaité"}
                    </span>

                    {isOpen ? (
                      <FaChevronUp size={14} className="text-gray-400" />
                    ) : (
                      <FaChevronDown size={14} className="text-gray-400" />
                    )}
                  </button>
                  {isOpen && (
                    <ul className="max-h-48 overflow-y-auto py-1 bg-white shadow-lg rounded">
                      {services.map((service) => {
                        const Icon = service.icon;
                        const isSelected = value === service.value;
                        return (
                          <li
                            key={service.value}
                            role="option"
                            onClick={() =>
                              !service.disabled && handleSelect(service.value)
                            }
                            className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors ${
                              service.disabled
                                ? "text-gray-300 cursor-not-allowed"
                                : isSelected
                                  ? "bg-[#0073CF]/10 text-[#0073CF]"
                                  : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {Icon && (
                              <div
                                className={`w-6 h-6 rounded flex items-center justify-center ${
                                  isSelected
                                    ? "bg-[#0073CF] text-white"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                <Icon size={12} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${
                                  isSelected ? "text-[#0073CF]" : ""
                                }`}
                              >
                                {service.label}
                              </p>
                              {service.description && (
                                <p className="text-xs text-gray-400 truncate">
                                  {service.description}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <FaCheck
                                size={14}
                                className="text-[#0073CF] flex-shrink-0"
                              />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <textarea
                  placeholder="Message"
                  className="border p-3 rounded h-24 focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-[#0073CF] transition"
                ></textarea>
                <button
                  type="submit"
                  className="bg-[#f16c13] text-white font-semibold px-5 py-2 rounded-full hover:opacity-90 transition"
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
