// src/components/Service/Service.jsx
import React, { useEffect, useState } from "react";
import { getServices } from "../../services/api";

import { GiCrane, GiBrickWall, GiBroom } from "react-icons/gi";
import { FaHammer, FaLandmark, FaHardHat, FaUserTie } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";

const serviceConfig = {
  CONSTRUCTION_GENERALE: {
    name: "Travaux de construction générale",
    description: "Prise en charge complète de vos projets de construction",
    iconName: "FaHardHat",
    color: "#0073CF",
  },
  RENOVATION: {
    name: "Rénovation",
    description: "Transformation et modernisation de vos espaces",
    iconName: "FaHammer",
    color: "#0073CF",
  },
  TRAITEMENT_HYDROFUGE: {
    name: "Traitement hydrofuge",
    description: "Protection contre l'humidité et infiltrations",
    iconName: "IoIosWater",
    color: "#0073CF",
  },
  MACONNERIE: {
    name: "Maçonnerie",
    description: "Construction en béton, brique et pierre",
    iconName: "GiCrane",
    color: "#0073CF",
  },
  RESTAURATION: {
    name: "Restauration",
    description: "Remise en état du patrimoine bâti",
    iconName: "FaLandmark",
    color: "#0073CF",
  },
  REJOINTOIEMENT: {
    name: "Rejointoiement rustique",
    description: "Finitions traditionnelles",
    iconName: "GiBrickWall",
    color: "#0073CF",
  },
  DEMOUSSAGE: {
    name: "Démoussage",
    description: "Nettoyage toitures et façades",
    iconName: "GiBroom",
    color: "#0073CF",
  },
};

const iconMap = {
  GiCrane,
  FaHammer,
  FaLandmark,
  FaHardHat,
  GiBrickWall,
  IoIosWater,
  GiBroom,
};

// Card for services WITH API data (chefs + project count)
function ChefActiveServiceCard({ service }) {
  const Icon = iconMap[service.iconName] || FaHardHat;

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
      style={{ borderTop: `4px solid ${service.color}` }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div
          className="w-14 h-14 flex items-center justify-center rounded-xl mb-4"
          style={{ backgroundColor: service.color + "18" }}
        >
          <Icon className="text-2xl" style={{ color: service.color }} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">
          {service.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold"
            style={{ backgroundColor: service.color }}
          >
            {service.projectCount}
          </span>
          <span className="text-xs text-gray-500">
            projet{service.projectCount > 1 ? "s" : ""}
          </span>
        </div>

        <div className="w-px h-4 bg-gray-200" />

        <div className="flex items-center gap-1.5">
          <FaUserTie className="text-gray-400 text-xs" />
          <span className="text-xs text-gray-500">
            {service.chefs.length} chef{service.chefs.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Chefs list */}
      {service.chefs.length > 0 && (
        <div className="px-6 py-4 space-y-2">
          {service.chefs.map((chef) => (
            <div key={chef.id} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: service.color }}
              >
                {chef.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {chef.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{chef.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Compact card for client-side services (not in API data)
function ChefServiceCard({ service }) {
  const Icon = iconMap[service.iconName] || FaHardHat;

  return (
    <div className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
      <div
        className="w-11 h-11 flex items-center justify-center rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: service.color + "18" }}
      >
        <Icon className="text-xl" style={{ color: service.color }} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{service.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
      </div>
    </div>
  );
}

export default function Service() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        const apiKeys = new Set((data || []).map((item) => item.service));

        // Active services (from API)
        const active = (data || []).map((item, index) => {
          const config = serviceConfig[item.service] || {
            name: item.service?.replace(/_/g, " ") || "Service",
            description: "Service professionnel",
            iconName: "FaHardHat",
            color: "#64748b",
          };
          return {
            id: item.service,
            ...config,
            projectCount: item.projectCount || 0,
            chefs: item.chefs || [],
          };
        });

        // Client services: all config entries NOT in API response
        const chef = Object.entries(serviceConfig)
          .filter(([key]) => !apiKeys.has(key))
          .map(([key, config]) => ({ id: key, ...config }));

        setServices({ active, client });
      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-20 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-gray-500 text-sm">Chargement des services…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center">
        <p className="text-red-500 font-medium">⚠️ {error}</p>
      </section>
    );
  }

  const { active = [], client = [] } = services;

  return (
    <section className="py-20 px-4 bg-gray-50" id="services">
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Nos Services
          </h2>
          <p className="text-gray-500 mt-3 text-base">
            Solutions professionnelles pour tous vos projets
          </p>
        </div>

        {/* ── Active services (from API) ── */}
        {active.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Services en activité
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map((service) => (
                <ActiveServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* ── Client services (not in API) ── */}
        {client.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Services clients disponibles
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {client.map((service) => (
                <ClientServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}