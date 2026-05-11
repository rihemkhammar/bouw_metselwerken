import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import AdminLayout from "../../components/layout/admin/AdminLayout";
import { getAdminProfile, updateAdminProfile } from "../../services/api";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getAdminProfile();
        setAdmin(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du profil admin :", err);
        setError("Impossible de charger le profil.");
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await updateAdminProfile(admin);
      setMessage(data.message);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setError("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
    <AdminLayout pageTitle="Paramètres Administrateur">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUser className="text-blue-600" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Profil Administrateur
            </h1>
          </div>
          <p className="text-gray-500 ml-11">
            Modifiez vos informations personnelles ci-dessous.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading && (
            <p className="text-center text-gray-500">Chargement du profil...</p>
          )}

          <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-[#FF8C00]" />

          <form onSubmit={handleUpdate} className="p-8 space-y-6">
            {/* Success Message */}
            {message && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <FaCheckCircle
                  className="text-green-500 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <p className="text-green-700">{message}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <FaExclamationCircle
                  className="text-red-500 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaUser className="text-gray-400" size={14} />
                Nom complet
              </label>
              <input
                name="name"
                value={admin.name}
                onChange={handleChange}
                placeholder="Ex : Jean Dupont"
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
                value={admin.email}
                onChange={handleChange}
                placeholder="admin@exemple.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 
                focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="text-gray-400" size={14} />
                Téléphone
              </label>
              <input
                name="phone"
                value={admin.phone || ""}
                onChange={handleChange}
                placeholder="Ex : +33 6 12 34 56 78"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 
                focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="text-gray-400" size={14} />
                Adresse
              </label>
              <input
                name="address"
                value={admin.address || ""}
                onChange={handleChange}
                placeholder="Ex : 12 Rue de Paris, Lyon"
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl 
                hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 
                transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <FaCheckCircle size={18} />
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
