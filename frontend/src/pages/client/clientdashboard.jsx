import React, { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiPlay,
  FiCalendar,
  FiCheck,
 
} from "react-icons/fi";
import {FaTools} from "react-icons/fa"
import { getProjects, fetchClientProfile } from "../../services/api";

const ClientDashboardDetailed = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          setError("Utilisateur non authentifié");
          setLoading(false);
          return;
        }

        const profileData = await fetchClientProfile(userId, token);
        setProfile(profileData);

        const projectsData = await getProjects(userId);
        setProjects(projectsData.projects || []);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      IN_PROGRESS: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-700",
        label: "EN COURS",
      },
      PLANNED: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-700",
        label: "PLANIFIÉ",
      },
      COMPLETED: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-700",
        label: "COMPLÉTÉ",
      },
    };
    return colors[status] || colors.PLANNED;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getProjectProgress = (project) => {
    if (project.updates && project.updates.length > 0) {
      return project.updates[project.updates.length - 1].progress || 0;
    }
    return 0;
  };

  const getTotalBudget = () => {
    return projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  };

  const getTotalSpent = () => {
    return projects.reduce((sum, p) => {
      const updates = p.updates || [];
      if (updates.length > 0) {
        const lastUpdate = updates[updates.length - 1];
        const percentage = lastUpdate.progress || 0;
        return sum + ((p.budget * percentage) / 100 || 0);
      }
      return sum;
    }, 0);
  };

  const countByStatus = (status) => {
    return projects.filter((p) => p.status === status).length;
  };

  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpent();
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        

        {/* Profile Card & Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex gap-6 mb-8">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-2xl font-semibold flex-shrink-0">
                {getInitials(profile?.name || "CD")}
              </div>
              <div className="flex-1">
               
                <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
                  {profile?.companyName}
                </h2>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ● Compte actif
            </span>
          </div>
          
        </div>
                <p className="text-gray-600 text-sm mt-1">
                  {profile?.name} • Membre depuis 24 mai 2025
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium">
                    CLIENT
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                    CONTRAT ACTIF
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-6">
                Informations de contact
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {profile?.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Téléphone
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {profile?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Adresse
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {profile?.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Matricule
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {profile?.matricule}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-xs text-gray-600 uppercase tracking-wider">
                Budget Total
              </p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {totalBudget.toLocaleString()} €
              </p>
              <p className="text-xs text-gray-600 mt-2">Pour {projects.length} projets</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-xs text-gray-600 uppercase tracking-wider">
                Dépensé
              </p>
              <p className="text-3xl font-semibold text-blue-600 mt-2">
                {Math.round(totalSpent).toLocaleString()} €
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {totalBudget > 0
                  ? Math.round((totalSpent / totalBudget) * 100)
                  : 0}
                % du budget
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-xs text-gray-600 uppercase tracking-wider">
                Restant
              </p>
              <p className="text-3xl font-semibold text-red-400 mt-2">
                {Math.round(totalRemaining).toLocaleString()} €
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {totalBudget > 0
                  ? Math.round((totalRemaining / totalBudget) * 100)
                  : 0}
                % du budget
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <FiBriefcase className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-3xl font-semibold text-gray-900">
              {projects.length}
            </p>
            <p className="text-xs text-gray-600 mt-2">Projets total</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <FiPlay className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-3xl font-semibold text-gray-900">
              {countByStatus("IN_PROGRESS")}
            </p>
            <p className="text-xs text-gray-600 mt-2">En cours</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <FiCalendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-3xl font-semibold text-gray-900">
              {countByStatus("PLANNED")}
            </p>
            <p className="text-xs text-gray-600 mt-2">Planifiés</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <FiCheck className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-3xl font-semibold text-gray-900">
              {countByStatus("COMPLETED")}
            </p>
            <p className="text-xs text-gray-600 mt-2">Complétés</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <FaTools className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-3xl font-semibold text-gray-900">
              {profile?.stats?.services?.total || 0}
            </p>
            <p className="text-xs text-gray-600 mt-2">Services</p>
          </div>
        </div>

        {/* Detailed Projects */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Vos projets en détail
          </h2>

          {projects.map((project) => {
            const status = getStatusColor(project.status);
            const progress = getProjectProgress(project);
            const projectSpent = (project.budget * progress) / 100 || 0;
            const lastUpdate =
              project.updates && project.updates.length > 0
                ? project.updates[project.updates.length - 1]
                : null;

            return (
              <div
                key={project.id}
                className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden"
              >
                <div className="p-8 grid grid-cols-3 gap-8">
                  {/* Left: Project Info */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded whitespace-nowrap ${status.bg} ${status.text}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">
                          Budget
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {project.budget?.toLocaleString()} €
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">
                          Dépensé
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {Math.round(projectSpent).toLocaleString()} €
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Progress */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wider mb-4">
                      Progression
                    </p>
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-600">Tâches</span>
                        <span className="text-xs font-semibold text-gray-900">
                          {Math.round(progress * 0.25)}/25
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">
                          Chef
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {project.chef?.name || "Non assigné"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">
                          Démarrage
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          15 Jan 2026
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Last Update */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wider mb-4">
                      Dernière mise à jour
                    </p>
                    {lastUpdate ? (
                      <div
                        className={`rounded p-4 border-l-4 ${status.border} bg-gray-50`}
                      >
                        <p className="text-sm font-semibold text-gray-900">
                          {lastUpdate.details}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Mise à jour par {lastUpdate.updatedByUser?.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(lastUpdate.timestamp).toLocaleDateString(
                            "fr-FR"
                          )}{" "}
                          • {lastUpdate.progress}% complété
                        </p>
                      </div>
                    ) : (
                      <div className="rounded p-4 bg-gray-50 text-center">
                        <p className="text-xs text-gray-600">
                          Aucune mise à jour
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Services Used */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Services utilisés
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {profile?.stats?.services?.list?.map((service, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border-l-4 border-blue-600 p-4 rounded"
              >
                <p className="text-sm font-semibold text-gray-900">{service}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Utilisé dans{" "}
                  {
                    projects.filter(
                      (p) => p.services && p.services.includes(service)
                    ).length
                  }{" "}
                  projet(s)
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardDetailed;