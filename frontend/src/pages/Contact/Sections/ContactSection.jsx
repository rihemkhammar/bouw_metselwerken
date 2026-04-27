import React, { useState, useRef, useEffect } from "react";
import { 
  FaFacebook, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, 
  FaCheckCircle, FaExclamationCircle, FaChevronDown, FaChevronUp, 
  FaSearch, FaTimes, FaCheck,
  // Valid construction-related icons from react-icons/fa:
  FaTools, FaHardHat, FaHome, FaBuilding, FaPaintRoller, 
  FaWater, FaLeaf, FaBrush, FaRulerCombined, FaIndustry
} from "react-icons/fa";

// ============================================================================
// SERVICE SELECT COMPONENT (Improved Dropdown)
// ============================================================================
const services = [
  { value: "", label: "Sélectionnez un service", icon: null, disabled: true },
  { value: "masonry", label: "Maçonnerie", icon: FaBuilding, description: "Murs, fondations, structures" },
  { value: "renovation", label: "Rénovation", icon: FaHome, description: "Modernisation & remise à neuf" },
  { value: "restoration", label: "Restauration", icon: FaPaintRoller, description: "Patrimoine & pierres anciennes" },
  { value: "general-construction", label: "Construction générale", icon: FaHardHat, description: "Projets neufs clés en main" },
  { value: "repointing", label: "Rejointoiement rustique", icon: FaBrush, description: "Finitions traditionnelles" },
  { value: "waterproofing", label: "Traitement hydrofuge", icon: FaWater, description: "Protection contre l'humidité" },
  { value: "moss-removal", label: "Démoussage", icon: FaLeaf, description: "Nettoyage & entretien façades" },
  { value: "other", label: "Autre service", icon: FaTools, description: "Votre projet personnalisé" }
];

const ServiceSelect = ({ value, onChange, error, name, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredServices = services.filter(service => 
    service.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedService = services.find(s => s.value === value);
  const SelectedIcon = selectedService?.icon;

  const handleSelect = (serviceValue) => {
    if (serviceValue) {
      onChange({ target: { name, value: serviceValue } });
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e, serviceValue) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(serviceValue);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        Service souhaité <span className="text-red-500">*</span>
      </label>
      
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-transparent ${
          error 
            ? 'border-red-400 bg-red-50 hover:border-red-500' 
            : 'border-gray-300 bg-white hover:border-[#0073CF]/50'
        } ${isOpen ? 'ring-2 ring-[#0073CF] border-transparent' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {SelectedIcon && value ? (
            <div className="flex-shrink-0 w-8 h-8 bg-[#0073CF]/10 rounded-lg flex items-center justify-center text-[#0073CF]">
              <SelectedIcon size={16} />
            </div>
          ) : (
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <FaChevronDown size={14} />
            </div>
          )}
          <span className={`truncate ${!value ? 'text-gray-400' : 'text-gray-800 font-medium'}`}>
            {selectedService?.label || "Sélectionnez un service"}
          </span>
        </div>
        <div className={`flex-shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <FaChevronUp size={16} className="text-gray-400" /> : <FaChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div 
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073CF]/20 focus:border-[#0073CF] transition"
                aria-label="Rechercher dans les services"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Effacer la recherche"
                >
                  <FaTimes size={12} />
                </button>
              )}
            </div>
          </div>

          <ul className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => {
                const Icon = service.icon;
                const isSelected = value === service.value;
                
                return (
                  <li
                    key={service.value}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={service.disabled ? -1 : 0}
                    onClick={() => !service.disabled && handleSelect(service.value)}
                    onKeyDown={(e) => !service.disabled && handleKeyDown(e, service.value)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 ${
                      service.disabled 
                        ? 'text-gray-300 cursor-not-allowed bg-gray-50/50' 
                        : isSelected 
                          ? 'bg-[#0073CF]/10 text-[#0073CF]' 
                          : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected 
                        ? 'bg-[#0073CF] text-white' 
                        : service.disabled 
                          ? 'bg-gray-100 text-gray-300' 
                          : 'bg-gray-100 text-gray-500'
                    }`}>
                      {Icon ? <Icon size={18} /> : <FaChevronDown size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isSelected ? 'text-[#0073CF]' : 'text-gray-800'}`}>
                        {service.label}
                      </p>
                      {service.description && (
                        <p className={`text-xs mt-0.5 truncate ${isSelected ? 'text-[#0073CF]/70' : 'text-gray-500'}`}>
                          {service.description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0 text-[#0073CF]">
                        <FaCheck size={16} />
                      </div>
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-6 text-center text-gray-500 text-sm">
                Aucun service trouvé pour "{searchTerm}"
              </li>
            )}
          </ul>

          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
            {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
          </div>
        </div>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// MAIN CONTACT FORM COMPONENT
// ============================================================================
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // ✅ UPDATED BUSINESS INFORMATION
  const businessInfo = {
    name: "A&M Gharred",
    phone: "+32 465 51 361",
    phoneRaw: "003246551361",
    email: "gharredam@gmail.com",
    facebook: "https://www.facebook.com/profile.php?id=61570607073910",
    hours: "Lun-Ven: 8h00 - 17h00",
    location: "Tunis"
  };

  const contactInfo = [
    { icon: FaEnvelope, label: "Email", value: businessInfo.email, href: `mailto:${businessInfo.email}` },
    { icon: FaPhone, label: "Téléphone", value: businessInfo.phone, href: `tel:${businessInfo.phoneRaw}` },
    { icon: FaFacebook, label: "Facebook", value: "facebook.com/A&M Gharred", href: businessInfo.facebook, external: true },
    { icon: FaMapMarkerAlt, label: "Zone d'intervention", value: businessInfo.location, href: null },
    { icon: FaClock, label: "Horaires", value: businessInfo.hours, href: null }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.service) newErrors.service = "Veuillez sélectionner un service";
    if (!formData.message.trim()) newErrors.message = "Le message est requis";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // TODO: Replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setFormData({ name: "", phone: "", email: "", service: "", message: "" });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">   
          {/* LEFT: Contact Information */}
          <div className="space-y-8 order-2 lg:order-1">
            
            {/* Contact Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-[#f16c13] rounded-full"></span>
                Coordonnées
              </h2>
              
              <div className="space-y-5">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#0073CF]/10 rounded-xl flex items-center justify-center text-[#0073CF] group-hover:bg-[#0073CF] group-hover:text-white transition-colors duration-300">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{item.label}</p>
                      {item.href ? (
                        <a 
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="text-gray-800 font-medium hover:text-[#0073CF] transition-colors duration-200 break-all"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-800 font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-[#0073CF] rounded-2xl shadow-lg p-6 md:p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Pourquoi choisir {businessInfo.name} ?</h3>
              <ul className="space-y-2">
                {[
                  "Artisans expérimentés et qualifiés",
                  "Matériaux de qualité professionnelle",
                  "Respect strict des délais et budgets",
                  "Assurance décennale incluse"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="text-[#f16c13] flex-shrink-0" size={18} />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-[#f16c13] rounded-full"></span>
                Démarrons Votre Projet
              </h2>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-800 animate-pulse">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Message envoyé avec succès ! ✓</p>
                    <p className="text-sm">L'équipe {businessInfo.name} vous répondra sous 24h.</p>
                  </div>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800">
                  <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Oups ! Une erreur est survenue.</p>
                    <p className="text-sm">Veuillez réessayer ou nous appeler au {businessInfo.phone}.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom et prénom"
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-transparent transition ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Phone & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+32 XXX XX XX XX"
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-transparent transition ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && <p id="phone-error" className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vous@email.com"
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-transparent transition ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && <p id="email-error" className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>

                {/* Service Dropdown - IMPROVED */}
                <ServiceSelect
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  error={errors.service}
                />

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet, vos besoins, la localisation..."
                    rows={4}
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-transparent transition resize-none ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && <p id="message-error" className="mt-1 text-sm text-red-500">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f16c13] text-white font-semibold py-4 rounded-xl hover:bg-[#d95a0f] focus:outline-none focus:ring-4 focus:ring-[#f16c13]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer ma demande de devis"
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  🔒 Vos données sont confidentielles. En soumettant ce formulaire, vous acceptez notre{" "}
                  <a href="/politique-confidentialite" className="text-[#0073CF] hover:underline">politique de confidentialité</a>.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;