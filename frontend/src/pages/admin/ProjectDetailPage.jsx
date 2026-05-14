import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/admin/AdminLayout";
import { getProjectById } from "../../services/api";
import {
  FiArrowLeft,
  FiAlertTriangle,
  FiSearch,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiFileText,
  FiClock,
  FiBriefcase,
  FiPhone,
  FiMail,
  FiUser,
  FiEdit2,
  FiDownload,
  FiMoreVertical,
  FiCheckCircle,
  FiRefreshCw,
  FiXCircle,
  FiFlag,
} from "react-icons/fi";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await getProjectById(projectId);
        setProject(result);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement du projet");
        console.error("❌ Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) load();
  }, [projectId]);

  const formatBudget = (amount) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount || 0);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Non disponible";

  const getStatusConfig = (status) => {
    const config = {
      PLANNED: { 
        label: "Planifié", 
        class: "bg-gray-100 text-gray-700 border-gray-200", 
        icon: <FiFlag className="w-3 h-3 mr-1" /> 
      },
      IN_PROGRESS: { 
        label: "En cours", 
        class: "bg-blue-100 text-blue-700 border-blue-200", 
        icon: <FiRefreshCw className="w-3 h-3 mr-1" /> 
      },
      COMPLETED: { 
        label: "Terminé", 
        class: "bg-green-100 text-green-700 border-green-200", 
        icon: <FiCheckCircle className="w-3 h-3 mr-1" /> 
      },
      CANCELLED: { 
        label: "Annulé", 
        class: "bg-red-100 text-red-700 border-red-200", 
        icon: <FiXCircle className="w-3 h-3 mr-1" /> 
      },
    };
    return config[status] || { label: status, class: "bg-gray-100 text-gray-800 border-gray-200", icon: null };
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  const statusConfig = getStatusConfig(project?.status || "");
 const progress = project.updates?.[0]?.progress ?? project.progress ?? 0;


  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md w-full text-center">
          <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <FiSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Projet introuvable</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium transition"
          >
            Retourner en arrière
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout pageTitle={`Projet - ${project.title}`}>
      {/* Sticky Header */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Retour"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate max-w-md md:max-w-xl">
                {project.title}
              </h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                  ID: {project.id}
                </span>
                <span className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.class}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
              <FiEdit2 className="w-4 h-4" />
              <span className="hidden sm:inline">Modifier</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
              <FiDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <FiMoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FiDollarSign, label: "Budget", value: formatBudget(project.budget), color: "bg-blue-50 text-blue-600" },
            { icon: FiCalendar, label: "Début / Fin", value: project.startDate ? formatDate(project.startDate).split(" à ")[0] : "N/A", sub: project.endDate ? `au ${formatDate(project.endDate).split(" à ")[0]}` : "", color: "bg-amber-50 text-amber-600" },
            { icon: FiMapPin, label: "Localisation", value: project.location || "Non définie", color: "bg-emerald-50 text-emerald-600" },
            { icon: FiFileText, label: "Documents", value: project.documentCount || "0 fichiers", sub: `${project.photoCount || 0} photos`, color: "bg-purple-50 text-purple-600" },
          ].map((kpi, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
              <div className={`w-10 h-10 rounded-lg ${kpi.color} flex items-center justify-center mb-3`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{kpi.value}</p>
              {kpi.sub && <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>}
            </div>
          ))}
        </div>

        {/* Progress & General Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Project Details */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiBriefcase className="w-5 h-5 text-gray-500" />
              Informations du chantier
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {project.description || "Aucune description fournie pour ce projet."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Service / Corps d'état</p>
                  <p className="text-gray-800">{project.services || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Statut actuel</p>
                  <p className="text-gray-800">{statusConfig.label}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-500">Progression globale</p>
                  <p className="text-sm font-bold text-gray-900">{progress}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Dernière mise à jour : {formatDate(project.lastUpdateAt || new Date()).split(" à ")[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contacts */}
          <div className="space-y-6">
            {project.client && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-gray-500" />
                  Client / Maître d'ouvrage
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-900">{project.client.name}</p>
                  {project.client.companyName && (
                    <p className="text-gray-500">{project.client.companyName}</p>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    {project.client.email}
                  </div>
                  {project.client.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      {project.client.phone}
                    </div>
                  )}
                  <p className="text-gray-500 mt-2 truncate">{project.client.address || "Adresse non renseignée"}</p>
                </div>
              </div>
            )}

            {project.chef && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-gray-500" />
                  Chef de projet
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-900">{project.chef.name}</p>
                  {project.chef.matricule && (
                    <p className="text-gray-500">Matricule: {project.chef.matricule}</p>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    {project.chef.email}
                  </div>
                  {project.chef.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      {project.chef.phone}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Updates Timeline */}
        {project.updates?.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiClock className="w-5 h-5 text-gray-500" />
              Historique des mises à jour
            </h2>
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
              {project.updates.map((u, index) => (
                <div key={u.id || index} className="relative pl-6">
                  <div className="absolute -left-2.5 top-1 w-5 h-5 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition">
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                      <p className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                        {formatDate(u.timestamp)}
                      </p>
                      {u.progress !== undefined && (
                        <span className="text-xs font-semibold text-blue-600">
                          {u.progress}% avancement
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {u.details || u.message || "Aucun détail fourni"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </AdminLayout>
  );
};

export default ProjectDetailPage;