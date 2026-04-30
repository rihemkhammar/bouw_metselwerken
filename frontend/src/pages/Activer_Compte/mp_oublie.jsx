import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaClock } from "react-icons/fa";
import Footer from "../../components/layout/Footer/Footer";
import GeoMap from "./Sections/map";
import ContactHeader from "../Contact/Sections/ContactHeader";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [matricule, setMatricule] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email requis");
      return;
    }
    
    if (!matricule) {
      setError("Matricule fiscal requis");
      return;
    }
    
    const matriculeRegex = /^\d{15}$/;
    if (!matriculeRegex.test(matricule)) {
      setError("Matricule fiscal invalide (doit contenir 15 chiffres)");
      return;
    }

    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      setSent(true);
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ContactHeader />
      <div className="flex items-center justify-center bg-gray-100 py-40">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          {!sent ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">
                Mot de passe oublié
              </h2>
              
              <p className="text-gray-600 text-center mb-6">
                Entrez votre email et matricule fiscal pour recevoir un lien de réinitialisation
              </p>

              {/* 📋 SECTION EXPLICATION */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Comment ça marche ?</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Remplissez votre email et matricule fiscal</li>
                      <li>Cliquez sur "Envoyer le lien"</li>
                      <li>Vérifiez votre boîte mail (et spams)</li>
                      <li>Nous traiterons vos données et réinitialiserons votre login et mot de passe</li>
                    </ol>
                    
                    {/* ⏱️ REMARQUE AVEC ICÔNE REACT */}
                    <p className="mt-3 text-xs text-blue-700 bg-blue-100 px-2.5 py-1.5 rounded-md border border-blue-200 flex items-center gap-1.5">
                      <FaClock className="text-blue-600" />
                      <span><strong>Remarque :</strong> Le traitement peut prendre un peu de temps. Merci de patienter.</span>
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Champ Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Champ Matricule Fiscal */}
                <div className="mb-4">
                  <label htmlFor="matricule" className="sr-only">Matricule Fiscal</label>
                  <input
                    id="matricule"
                    type="text"
                    placeholder="Ex: 123456789012345"
                    value={matricule}
                    onChange={(e) => {
                      setMatricule(e.target.value);
                      setError("");
                    }}
                    className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Affichage des erreurs */}
                {error && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mb-4">
                    <FaExclamationCircle /> {error}
                  </p>
                )}

                {/* Bouton Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Envoi..." : "Envoyer le lien"}
                </button>
              </form>

              <button
                onClick={() => navigate(-1)}
                className="w-full mt-4 text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Retour à la connexion
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <FaCheckCircle size={50} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Demande envoyée ! 🎉</h3>
              <p className="text-gray-600 mb-6">
                Nous traitons votre demande. Vous recevrez un email avec vos nouveaux identifiants.
              </p>
              
              {/* 📋 EXPLICATION POST-ENVOI */}
              <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  <FaInfoCircle className="inline mr-1" />
                  Vous n'avez pas reçu l'email ?
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Vérifiez votre dossier <strong>Spams / Courriers indésirables</strong></li>
                  <li>Assurez-vous que l'email et le matricule saisis sont corrects</li>
                  <li>Le traitement est manuel et peut prendre <strong>quelques heures</strong></li>
                  <li>Contactez le support si le problème persiste après 24h</li>
                </ul>
              </div>
              
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </div>
      </div>
      <GeoMap />
      <Footer />
    </>
  );
};

export default ForgotPassword;