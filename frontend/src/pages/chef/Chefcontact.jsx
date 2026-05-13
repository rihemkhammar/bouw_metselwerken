import React, { useState, useRef, useEffect } from "react";
import {
  FaPhone, FaEnvelope, FaFacebookF, FaCheck, FaExclamationTriangle,
  FaPaperPlane, FaLock, FaFileAlt, FaHardHat,
  FaBuilding, FaTools, FaSearch, FaTimes, FaChevronDown,
  FaCheckCircle
} from "react-icons/fa";
import { sendContactRequest } from "../../services/api";

const CONTACT_TYPES = [
  { value: "suivi",        label: "Suivi de chantier",      desc: "Avancement de vos travaux",  icon: FaHardHat },
  { value: "modification", label: "Modification de projet", desc: "Changements ou ajustements", icon: FaBuilding },
  { value: "facture",      label: "Facturation",            desc: "Devis, factures, paiements", icon: FaTools },
  { value: "urgence",      label: "Urgence / SAV",          desc: "Problème urgent",            icon: FaExclamationTriangle },
  { value: "autre",        label: "Autre demande",          desc: "Toute autre question",       icon: FaSearch },
];

const PRIORITY_LEVELS = [
  { value: "normal",   label: "Normal",   detail: "Réponse 24–48h",  dot: "#0073CF" },
  { value: "urgent",   label: "Urgent",   detail: "Réponse sous 4h", dot: "#0073CF" },
  { value: "critique", label: "Critique", detail: "Immédiat",        dot: "#0073CF" },
];

const TypeSelect = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [isOpen]);

  const filtered = CONTACT_TYPES.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  const selected = CONTACT_TYPES.find(t => t.value === value);
  const SelIcon = selected?.icon;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0073CF] bg-white ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-[#0073CF]/50"
        } ${isOpen ? "ring-2 ring-[#0073CF] border-transparent" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${selected ? "bg-[#0073CF]/10 text-[#0073CF]" : "bg-gray-100 text-gray-400"}`}>
            {SelIcon ? <SelIcon size={15} /> : <FaChevronDown size={13} />}
          </div>
          <span className={`truncate text-sm ${!value ? "text-gray-400" : "text-gray-800 font-medium"}`}>
            {selected?.label || "Sélectionnez un type de demande"}
          </span>
        </div>
        <FaChevronDown size={14} className={`flex-shrink-0 ml-2 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073CF]/20 focus:border-[#0073CF]"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaTimes size={11} />
                </button>
              )}
            </div>
          </div>
          <ul className="max-h-56 overflow-y-auto py-1" role="listbox">
            {filtered.map(t => {
              const Icon = t.icon;
              const isSel = value === t.value;
              return (
                <li
                  key={t.value}
                  role="option"
                  aria-selected={isSel}
                  tabIndex={0}
                  onClick={() => { onChange(t.value); setIsOpen(false); setSearch(""); }}
                  onKeyDown={e => { if (e.key === "Enter") { onChange(t.value); setIsOpen(false); setSearch(""); } }}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    isSel ? "bg-[#0073CF]/10 text-[#0073CF]" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isSel ? "bg-[#0073CF] text-white" : "bg-gray-100 text-gray-500"}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isSel ? "text-[#0073CF]" : "text-gray-800"}`}>{t.label}</p>
                    <p className={`text-xs mt-0.5 truncate ${isSel ? "text-[#0073CF]/70" : "text-gray-500"}`}>{t.desc}</p>
                  </div>
                  {isSel && <FaCheck size={14} className="flex-shrink-0 text-[#0073CF] mt-1" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <FaExclamationTriangle size={11} /> {error}
        </p>
      )}
    </div>
  );
};

const PrioritySelector = ({ value, onChange }) => (
  <div className="flex gap-3">
    {PRIORITY_LEVELS.map(p => (
      <button
        key={p.value}
        type="button"
        onClick={() => onChange(p.value)}
        className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 border-2 rounded-xl transition-all duration-200 ${
          value === p.value ? "border-[#0073CF] bg-[#0073CF]/5" : "border-gray-200 bg-white hover:border-[#0073CF]/40"
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.dot }} />
        <span className={`text-xs font-semibold ${value === p.value ? "text-[#0073CF]" : "text-gray-700"}`}>{p.label}</span>
        <span className="text-[10px] text-gray-500 text-center leading-tight">{p.detail}</span>
      </button>
    ))}
  </div>
);

const QuickContact = () => {
  const items = [
    {
      href: "tel:003246551361",
      Icon: FaPhone,
      label: "Téléphone",
      value: "+32 465 51 361",
      bg: "#FAF9F6",
      border: "#FAF9F6",
      iconBg: "#0073CF",
    },
    {
      href: "mailto:gharredam@gmail.com",
      Icon: FaEnvelope,
      label: "Email",
      value: "gharredam@gmail.com",
      bg: "#FAF9F6",
      border: "#FAF9F6",
      iconBg: "#0073CF",
    },
    {
      href: "https://www.facebook.com/profile.php?id=61570607073910",
      Icon: FaFacebookF,
      label: "Facebook",
      value: "A&M Gharred",
      bg: "#FAF9F6",
      border: "#ddd6fe",
      iconBg: "#0073CF",
      ext: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <span className="w-1 h-7 bg-[#f16c13]" style={{ borderRadius: 0 }} />
        Contact direct
      </h2>

      <div className="space-y-3">
        {items.map((it, i) => (
          <a
            key={i}
            href={it.href}
            target={it.ext ? "_blank" : undefined}
            rel={it.ext ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 p-3 rounded-xl no-underline transition-all duration-200 hover:shadow-sm border"
            style={{ background: it.bg, borderColor: it.border }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: it.iconBg }}
            >
              <it.Icon size={14} color="white" />
            </div>

            <div>
              <p className="text-xs text-gray-500 m-0">{it.label}</p>
              <p className="text-sm font-bold text-gray-900 m-0">{it.value}</p>
            </div>
          </a>
        ))}
      </div>

     <div className="mt-4 px-4 py-2.5 bg-[#0073CF]/10 rounded-xl border border-[#0073CF]/30 text-[#0073CF] text-xs font-medium text-center">
  Lun–Ven 8h00 – 17h00
</div>
    </div>
  );
};
const ChefContact = () => {
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", projectRef: "",
    contactType: "", priority: "normal", subject: "", message: "", file: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [apiError, setApiError] = useState("");
  const fileRef = useRef(null);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())  e.fullName    = "Nom requis";
    if (!form.phone.trim())     e.phone       = "Téléphone requis";
    if (!form.email.trim())     e.email       = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.contactType)      e.contactType = "Sélectionnez un type de demande";
    if (!form.subject.trim())   e.subject     = "Objet requis";
    if (!form.message.trim())   e.message     = "Message requis";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setSubmitting(true);
    setStatus(null);
    setApiError("");
    try {
      await sendContactRequest({
        fullName: form.fullName, phone: form.phone, email: form.email,
        projectRef: form.projectRef || undefined, contactType: form.contactType,
        priority: form.priority, subject: form.subject, message: form.message,
      });
      setStatus("success");
      setForm({ fullName:"",phone:"",email:"",projectRef:"",contactType:"",priority:"normal",subject:"",message:"",file:null });
    } catch (err) {
      setStatus("error");
      setApiError(err?.message || "Une erreur est survenue. Veuillez réessayer ou nous appeler.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) => `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-transparent transition ${
    errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"
  }`;

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          <div className="space-y-6 order-2 lg:order-1">
            <QuickContact />
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-1 h-7 bg-[#f16c13]" style={{ borderRadius: 0 }} />
                Nouvelle demande
              </h2>

              {status === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-800">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <p className="font-semibold text-sm m-0">Demande envoyée avec succès !</p>
                    <p className="text-sm mt-1 m-0">L'équipe A&M Gharred vous répondra dans les délais indiqués.</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800">
                  <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <p className="font-semibold text-sm m-0">Erreur d'envoi</p>
                    <p className="text-sm mt-1 m-0">{apiError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet <span className="text-red-500">*</span></label>
                    <input className={inputClass("fullName")} value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Prénom Nom" />
                    {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
                    <input className={inputClass("phone")} type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+32 XXX XX XX XX" />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <input className={inputClass("email")} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="vous@email.com" />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Référence projet</label>
                    <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-transparent transition" value={form.projectRef} onChange={e => set("projectRef", e.target.value)} placeholder="AMG-2025-XXX (facultatif)" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de demande <span className="text-red-500">*</span></label>
                  <TypeSelect value={form.contactType} onChange={v => set("contactType", v)} error={errors.contactType} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objet <span className="text-red-500">*</span></label>
                  <input className={inputClass("subject")} value={form.subject} onChange={e => set("subject", e.target.value)} placeholder="Résumez votre demande en quelques mots" />
                  {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée <span className="text-red-500">*</span></label>
                  <textarea
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-transparent transition resize-none ${errors.message ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                    rows={4}
                    value={form.message}
                    onChange={e => set("message", e.target.value)}
                    placeholder="Décrivez votre situation : localisation, problème constaté, date souhaitée d'intervention..."
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                </div>

                

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#f16c13] text-white font-semibold py-4 rounded-xl hover:bg-[#d95a0f] focus:outline-none focus:ring-4 focus:ring-[#f16c13]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <><FaPaperPlane size={14} /> Envoyer ma demande</>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                  <FaLock size={10} /> Données confidentielles — réponse sous 24–48h
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefContact;