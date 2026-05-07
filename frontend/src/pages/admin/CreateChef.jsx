// components/admin/CreateChef.jsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { createChef } from "../../services/api";
import AdminLayout from "../../components/layout/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function CreateChef() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // ✅ Name is OPTIONAL
    
    // ✅ Email: REQUIRED
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    // ✅ Password: REQUIRED + min 6 characters ONLY
    if (!formData.password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 caractères requis";
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
      await createChef(formData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", password: "" });
      
      // Optional: redirect after success
      // setTimeout(() => navigate("/admin/chefs"), 1500);
    } catch (error) {
      setSubmitStatus("error");
      console.error("Form submission error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout pageTitle="Création des Chefs">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUser className="text-blue-600" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Créer un compte Chef</h1>
          </div>
          <p className="text-gray-500 ml-11">
            Remplissez les informations ci-dessous. <span className="text-red-500">*</span> indique un champ requis.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Decorative Top Border */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-[#FF8C00]" />
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Name Field - OPTIONAL */}
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaUser className="text-gray-400" size={14} />
                Nom complet <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Marie Dubois"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 
                  ${errors.name 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  } focus:outline-none`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <FaExclamationCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            {/* Email Field - REQUIRED */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="text-gray-400" size={14} />
                Email professionnel <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="chef@restaurant.com"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 
                  ${errors.email 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  } focus:outline-none`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <FaExclamationCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field - REQUIRED (min 6 chars) */}
            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaLock className="text-gray-400" size={14} />
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 
                    ${errors.password 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    } focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              
              {/* Simple hint only */}
              <p className="mt-2 text-xs text-gray-500">
                Minimum 6 caractères
              </p>
              
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <FaExclamationCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-green-800">Chef créé avec succès !</p>
                  <p className="text-sm text-green-700 mt-1">Le compte est maintenant actif et prêt à être utilisé.</p>
                </div>
              </div>
            )}
            
            {submitStatus === "error" && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-sm text-red-700">Une erreur est survenue. Veuillez réessayer ou contacter le support.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium 
                  hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl 
                  hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 
                  transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed 
                  flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <FaCheckCircle size={18} />
                    Créer le chef
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Helper Text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Les chefs créés recevront un email de confirmation avec leurs identifiants de connexion.
        </p>
      </div>
    </AdminLayout>
  );
}