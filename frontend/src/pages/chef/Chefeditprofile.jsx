import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTools,
  FaCheckCircle,
  FaExclamationCircle,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { fetchChefProfile, updateChefProfile, updateChefPassword } from "../../services/api";

export default function ChefEditProfile() {
  const userId = localStorage.getItem("userId");
  const token  = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState("");
  const [error, setError]         = useState("");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", specialty: "",
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [showPw, setShowPw] = useState({
    current: false, new: false, confirm: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchChefProfile(userId, token);
        const u = data.user ?? data;
        setForm({
          name:      u.name      ?? "",
          email:     u.email     ?? "",
          phone:     u.phone     ?? "",
          specialty: u.specialty ?? "",
        });
      } catch (e) {
        setError("Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showFeedback = (type, msg) => {
    if (type === "success") { setMessage(msg); setError(""); }
    else                    { setError(msg);   setMessage(""); }
    setTimeout(() => { setMessage(""); setError(""); }, 4000);
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await updateChefProfile(userId, form);
      showFeedback("success", data.message || "Profil mis à jour avec succès !");
    } catch (e) {
      showFeedback("error", e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showFeedback("error", "Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      showFeedback("error", "Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setSaving(true);
    try {
      const data = await updateChefPassword(userId, {
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      showFeedback("success", data.message || "Mot de passe changé avec succès !");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      showFeedback("error", e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaUser className="text-blue-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Modifier mon compte
          </h1>
        </div>
        <p className="text-gray-500 ml-11">
          Modifiez vos informations personnelles ci-dessous.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "info",     label: "Informations",  icon: <FaUser size={13} /> },
          { id: "password", label: "Mot de passe",  icon: <FaLock size={13} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMessage(""); setError(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading && (
          <p className="text-center text-gray-500 py-6">Chargement du profil...</p>
        )}

        <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-[#FF8C00]" />

        {/* ── Tab: Infos ── */}
        {!loading && activeTab === "info" && (
          <form onSubmit={handleSaveInfo} className="p-8 space-y-6">
            {message && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-green-700">{message}</p>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Nom */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaUser className="text-gray-400" size={14} />
                Nom complet
              </label>
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ex : Ahmed Ben Ali"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="text-gray-400" size={14} />
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="chef@exemple.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="text-gray-400" size={14} />
                Téléphone
              </label>
              <input
                name="phone"
                value={form.phone || ""}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Ex : +216 XX XXX XXX"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            {/* Spécialité */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaTools className="text-gray-400" size={14} />
                Spécialité
              </label>
              <input
                name="specialty"
                value={form.specialty || ""}
                onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))}
                placeholder="Ex : Maçonnerie, Électricité…"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium
                  hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl
                  hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200
                  transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
              >
                <FaCheckCircle size={18} />
                {saving ? "Enregistrement…" : "Mettre à jour"}
              </button>
            </div>
          </form>
        )}

        {/* ── Tab: Mot de passe ── */}
        {!loading && activeTab === "password" && (
          <form onSubmit={handleSavePassword} className="p-8 space-y-6">
            {message && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-green-700">{message}</p>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {[
              { label: "Mot de passe actuel",  key: "currentPassword", show: "current" },
              { label: "Nouveau mot de passe", key: "newPassword",     show: "new"     },
              { label: "Confirmer le nouveau", key: "confirmPassword", show: "confirm" },
            ].map(({ label, key, show }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="text-gray-400" size={14} />
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={showPw[show] ? "text" : "password"}
                    value={pwForm[key]}
                    onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 hover:border-gray-300
                      focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => ({ ...p, [show]: !p[show] }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw[show] ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
            ))}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium
                  hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl
                  hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200
                  transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
              >
                <FaCheckCircle size={18} />
                {saving ? "Enregistrement…" : "Changer le mot de passe"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}