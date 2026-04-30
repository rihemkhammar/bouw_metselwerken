import React from "react";
import { assets } from "../../../assets/assets";
import { motion } from "framer-motion";

const About = () => {
  return (

    <div id="About" className="w-full bg-white py-20 px-6 md:px-20 overflow-hidden">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <img
            src={assets.background3}
            alt="Artisanat expert en maçonnerie et construction"
            className="rounded-xl shadow-2xl object-cover w-full h-[400px] transition-transform duration-500 group-hover:scale-[1.02]"
          />
          
          {/* Floating Badge */}
          <div className="absolute -top-4 -right-4 bg-[#f16c13] text-white px-4 py-2 rounded-lg shadow-lg font-semibold text-sm tracking-wide">
            BOUW METSELWERKEN
          </div>
          
          {/* Orange Accent Bar */}
          <div className="absolute -bottom-4 -left-4 w-32 h-2 bg-[#f16c13] rounded-full"></div>
        </motion.div>

        {/* RIGHT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              L'Art de Construire, <span className="text-[#f16c13]">Brique après Brique</span>
            </h2>
            <p className="text-lg font-medium text-gray-700">
              Spécialisés en <span className="italic">Construction & Maçonnerie</span>
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Notre entreprise s’engage à construire avec qualité, intégrité et précision, en transformant vos idées en réalisations concrètes grâce à un savoir-faire solide et une grande rigueur.

          </p>
          <p className="text-gray-600 leading-relaxed">
            
Notre entreprise accorde une attention particulière à chaque étape de vos projets afin de garantir des travaux fiables, soignés et conformes à vos attentes, tout en respectant pleinement ses engagements.
          </p>

          <ul className="space-y-3">
            {[
              "Maçonnerie Structurelle & Décorative",
              "Façades Personnalisées en Brique & Pierre",
              "Restaurations du Patrimoine & Rénovations",
              "Respect des Délais & des Budgets"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-2 w-2 h-2 bg-[#f16c13] rounded-full flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
              <p className="text-3xl font-bold text-[#f16c13]">10+</p>
              <p className="text-sm text-gray-600">Années d'Expérience</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
              <p className="text-3xl font-bold text-[#f16c13]">150+</p>
              <p className="text-sm text-gray-600">Projets Réalisés</p>
            </div>
          </div>

          <button className="mt-4 bg-[#f16c13] hover:bg-[#d95a0b] text-white px-8 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Voir Notre Galerie
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default About;