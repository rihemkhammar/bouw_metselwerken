// src/components/Service/Service.jsx
import React, { useEffect, useState } from "react";
import { getChefServices } from "../../services/api"; 

import { GiCrane, GiBrickWall, GiBroom } from "react-icons/gi";
import { FaHammer, FaLandmark, FaHardHat, FaUserTie, FaUsers, FaFolderOpen } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";

// ─── Config statique des services ────────────────────────────────────────────
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
  REJOINTOIEMENT_RUSTIQUE: {
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

// ─── Carte : service actif du chef (avec stats clients + projets) ─────────────
function ActiveServiceCard({ service }) {
  const config = serviceConfig[service.service] || {
    name: service.service?.replace(/_/g, " ") || "Service",
    description: "Service professionnel",
    iconName: "FaHardHat",
    color: "#64748b",
  };
  const Icon = iconMap[config.iconName] || FaHardHat;
  const color = config.color;

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
      style={{ borderTop: `4px solid ${color}` }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div
          className="w-14 h-14 flex items-center justify-center rounded-xl mb-4"
          style={{ backgroundColor: color + "18" }}
        >
          <Icon className="text-2xl" style={{ color }} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">
          {config.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{config.description}</p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 border-t border-gray-100">
        {/* Projets */}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold"
            style={{ backgroundColor: color }}
          >
            {service.projectCount}
          </span>
          <span className="text-xs text-gray-500">
            projet{service.projectCount > 1 ? "s" : ""}
          </span>
        </div>

        <div className="w-px h-4 bg-gray-200" />

        {/* Clients */}
        <div className="flex items-center gap-1.5">
          <FaUsers className="text-gray-400 text-xs" />
          <span className="text-xs text-gray-500">
            {service.clientCount} client{service.clientCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Liste des projets */}
      {service.projects?.length > 0 && (
        <div className="px-6 py-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Projets
          </p>
          {service.projects.map((proj) => (
            <div
              key={proj.id}
              className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FaFolderOpen className="text-gray-300 text-xs flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">{proj.title}</span>
              </div>
              <StatusBadge status={proj.status} />
            </div>
          ))}
        </div>
      )}

      {/* Liste des clients */}
      {service.clients?.length > 0 && (
        <div className="px-6 pb-5 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Clients
          </p>
          {service.clients.map((client) => (
            <div key={client.id} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: color }}
              >
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {client.name}
                </p>
                {client.companyName && (
                  <p className="text-xs text-gray-400 truncate">
                    {client.companyName}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Carte compacte : service disponible (pas encore de projet pour ce chef) ──
function AvailableServiceCard({ serviceKey }) {
  const config = serviceConfig[serviceKey] || {
    name: serviceKey.replace(/_/g, " "),
    description: "Service professionnel",
    iconName: "FaHardHat",
    color: "#94a3b8",
  };
  const Icon = iconMap[config.iconName] || FaHardHat;
  const color = config.color;

  return (
    <div className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
      <div
        className="w-11 h-11 flex items-center justify-center rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: color + "18" }}
      >
        <Icon className="text-xl" style={{ color }} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{config.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
      </div>
    </div>
  );
}

// ─── Badge statut projet ───────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    PLANNED: { label: "Planifié", bg: "bg-gray-100", text: "text-gray-500" },
    IN_PROGRESS: { label: "En cours", bg: "bg-blue-50", text: "text-blue-600" },
    COMPLETED: { label: "Terminé", bg: "bg-green-50", text: "text-green-600" },
  };
  const s = map[status] || map.PLANNED;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text} flex-shrink-0`}>
      {s.label}
    </span>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function Service() {
  const [activeServices, setActiveServices] = useState([]);   // services avec projets
  const [availableServices, setAvailableServices] = useState([]); // services sans projets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getChefServices(userId); // ← appel corrigé

        const apiKeys = new Set((data || []).map((item) => item.service));

        // Services actifs : ceux retournés par l'API
        const active = (data || []).map((item) => ({ ...item }));

        // Services disponibles : ceux dans serviceConfig mais PAS dans l'API
        const available = Object.keys(serviceConfig).filter(
          (key) => !apiKeys.has(key)
        );

        setActiveServices(active);
        setAvailableServices(available);
      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="py-20 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-gray-500 text-sm">Chargement des services…</p>
      </section>
    );
  }

  // ── Erreur ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="py-20 text-center">
        <p className="text-red-500 font-medium">⚠️ {error}</p>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gray-50" id="services">
      <div className="max-w-6xl mx-auto">

        {/* En-tête */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Mes Services
          </h2>
          <p className="text-gray-500 mt-3 text-base">
            Aperçu de vos activités et projets en cours
          </p>
        </div>

        {/* ── Services actifs (avec projets) ───────────────────────────────── */}
        {activeServices.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Services en activité
              </h3>
              <span className="ml-auto text-xs text-gray-400">
                {activeServices.length} service{activeServices.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeServices.map((service) => (
                <ActiveServiceCard key={service.service} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* ── Services disponibles (sans projets encore) ───────────────────── */}
        {availableServices.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Autres services disponibles
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableServices.map((key) => (
                <AvailableServiceCard key={key} serviceKey={key} />
              ))}
            </div>
          </div>
        )}

        {/* ── Aucun service ─────────────────────────────────────────────────── */}
        {activeServices.length === 0 && availableServices.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FaHardHat className="text-5xl mx-auto mb-4 opacity-30" />
            <p className="text-base">Aucun service trouvé.</p>
          </div>
        )}

      </div>
    </section>
  );
}