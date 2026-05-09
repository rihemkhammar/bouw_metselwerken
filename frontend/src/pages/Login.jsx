import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Header from "./Guest/sections/Header";
import { login } from "../services/api";

import { assets } from "../assets/assets";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { login } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

<<<<<<< HEAD
  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);

      if (data.user.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else if (data.user.role === "CHEF") {
        window.location.href = "/chef/dashboard";
      } else if (data.user.role === "CLIENT") {
        window.location.href = "/client/dashboard";
      } else {
        window.location.href = "/"; // fallback
      }
    } catch (err) {
      alert(err.message);
    }
  };
=======
    const handleLogin = async () => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
>>>>>>> origin/GuestPage_Rihem

      if (data.user.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else if (data.user.role === "CHEF") {
        window.location.href = "/chef/dashboard";
      } else if (data.user.role === "CLIENT") {
        window.location.href = "/client/Dashboard";
      }
       else {
      window.location.href = "/"; // fallback
       }
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        {/* LEFT: Login */}
        <div className="flex-1 bg-gray-100">
          <div className="w-full h-full p-10 bg-white rounded-none shadow-lg flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Connexion
              <span className="block w-16 h-1 bg-[#0073CF] mx-auto mt-2 rounded"></span>
            </h2>

            {/* Email */}
            <div className="w-3/4 mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Adresse e-mail
              </label>
              <input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="w-3/4 mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-[#0073CF] hover:text-[#0073CF]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Button */}
            <div className="w-3/4">
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Connecter
              </button>
            </div>

            {/* Helper Links */}
            <div className="w-3/4 mt-6 flex justify-between text-sm">
              <a
                href="/ForgotPassword"
                className="text-[#0073CF] hover:underline"
              >
                Mot de passe oublié ?
              </a>
              <a href="/register" className="text-[#0073CF] hover:underline">
                Créer un compte
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: Video */}
        <div className="hidden lg:flex flex-1 relative">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={assets.workers}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-6">
            <h3 className="text-white text-3xl font-bold text-center drop-shadow-md mb-6">
              Bâtir l'avenir, ensemble
            </h3>

            {/* Icons Row */}
            <div className="flex gap-8 text-white text-xl">
              <div className="flex flex-col items-center">
                <FaPhone />
                <span className="text-sm mt-2">+32 465 51 361 </span>
              </div>
              <div className="flex flex-col items-center">
                <FaEnvelope />
                <span className="text-sm mt-2">gharredam@gmail.com</span>
              </div>
              <div className="flex flex-col items-center">
                <FaMapMarkerAlt />
                <span className="text-sm mt-2">Tunis, Tunisie</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
