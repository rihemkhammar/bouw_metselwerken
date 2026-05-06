import React, { useState } from "react";
import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { createChef } from "../../services/api";

export default function CreateChef() {
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
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.password.trim())
      newErrors.password = "Le mot de passe est requis";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const response = await createChef(formData); // 👈 call backend
      console.log("Chef created:", response);

      setSubmitStatus("success");
      setFormData({ name: "", email: "", password: "", service: "" });
    } catch (error) {
      setSubmitStatus("error");
      console.error("Form submission error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className=" max-w-lg mx-auto border border-[#FF8C00]/70 rounded-xl mt-40 p-7 shadow-lg bg-white hover:shadow-xl transition-shadow">
        <h1 className="text-2xl font-bold mb-4 pb-2">Créer un compte Chef</h1>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom et prénom"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.name ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vous@email.com"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.email ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="pb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-[#0073CF] hover:text-[#0073CF]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Création en cours..." : "Créer le chef"}
          </button>
        </form>

        {submitStatus === "success" && (
          <p className="mt-3 text-green-600">Chef créé avec succès !</p>
        )}
        {submitStatus === "error" && (
          <p className="mt-3 text-red-600">Erreur lors de la création.</p>
        )}
      </div>
    </>
  );
}
