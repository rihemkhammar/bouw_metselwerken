import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getProjectDetail,
  uploadProjectDocument,
  getClientProjectUpdates,
} from "../../services/api";

import {
  HiArrowLeft,
  HiEnvelope,
  HiPhone,
  HiUserGroup,
  HiClipboardDocumentList,
  HiArrowUpTray,
  HiInbox,
  HiExclamationTriangle,
  HiChartBar,
  HiClock,
  HiCheckCircle,
  HiWrenchScrewdriver,
} from "react-icons/hi2";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatBudget = (amount) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);

const formatDate = (dateString) => {
  if (!dateString) return "Non disponible";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusConfig = (status) => {
  const config = {
    PENDING:     { label: "En attente", cls: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    IN_PROGRESS: { label: "En cours",   cls: "bg-blue-100   text-blue-800   border-blue-300"   },
    COMPLETED:   { label: "Terminé",    cls: "bg-green-100  text-green-800  border-green-300"  },
    CANCELLED:   { label: "Annulé",     cls: "bg-red-100    text-red-800    border-red-300"    },
  };
  return config[status] || { label: status, cls: "bg-gray-100 text-gray-800 border-gray-200" };
};

const getServiceLabel = (serviceKey) => {
  const services = {
    CONSTRUCTION_GENERALE: "Construction Générale",
    RENOVATION:            "Rénovation",
    ELECTRICITE:           "Électricité",
    PLOMBERIE:             "Plomberie",
    PEINTURE:              "Peinture",
    TRAITEMENT_HYDROFUGE:  "Traitement Hydrofuge",
  };
  if (Array.isArray(serviceKey)) return serviceKey.map((s) => services[s] || s).join(", ");
  return services[serviceKey] || serviceKey;
};

const getUpdateTypeConfig = (type) => {
  const map = {
    STATUS_CHANGE:   { label: "Changement de statut", color: "text-blue-600",   bg: "bg-blue-50"   },
    PROGRESS_UPDATE: { label: "Progression",           color: "text-green-600",  bg: "bg-green-50"  },
    DOCUMENT_ADDED:  { label: "Document ajouté",       color: "text-purple-600", bg: "bg-purple-50" },
    GENERAL:         { label: "Mise à jour",           color: "text-gray-600",   bg: "bg-gray-50"   },
  };
  return map[type] || { label: type, color: "text-gray-600", bg: "bg-gray-50" };
};

// ─── Barre de progression colorée ────────────────────────────────────────────
// Couleur réelle (pas de variable CSS) selon le pourcentage
const getProgressColor = (pct) => {
  if (pct === 100) return "#22c55e"; // green-500
  if (pct >= 70)   return "#3b82f6"; // blue-500
  if (pct >= 30)   return "#f59e0b"; // amber-500
  return "#94a3b8";                  // slate-400
};

const getProgressLabel = (pct) => {
  if (pct === 100) return "Projet terminé avec succès";
  if (pct >= 70)   return "Projet presque terminé";
  if (pct >= 30)   return "Le projet avance bien";
  return "Le projet vient de commencer";
};

// ─── Composant principal ──────────────────────────────────────────────────────

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project,      setProject]      = useState(null);
  const [updates,      setUpdates]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [uploadError,  setUploadError]  = useState(null);
  const [activeTab,    setActiveTab]    = useState("documents"); // "documents" | "updates"

  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.userId || decoded.id || decoded.sub;
      }
    } catch (e) {
      console.error("Token invalide:", e);
    }
    return localStorage.getItem("userId");
  };

  // ─── Chargement initial ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const userId = getUserId();
        if (!userId) throw new Error("Utilisateur non authentifié");

        // Projet + documents + updates (dans le même appel)
        const data = await getProjectDetail(projectId, userId);
        console.log("[DEBUG] project data:", data); // ← vérification
        setProject(data);

        // Updates viennent déjà dans data.updates — on les sépare pour plus de clarté
        if (data.updates) {
          setUpdates(data.updates);
        } else {
          // Fallback : appel séparé si le backend ne les inclut pas encore
          const upd = await getClientProjectUpdates(userId, projectId);
          setUpdates(upd);
        }

        setError(null);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement du projet");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchAll();
  }, [projectId]);

  // ─── Upload fichier ─────────────────────────────────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError(null);
      const userId = getUserId();

      await uploadProjectDocument(userId, projectId, file);

      // Rafraîchir les données du projet
      const updatedData = await getProjectDetail(projectId, userId);
      setProject(updatedData);
      if (updatedData.updates) setUpdates(updatedData.updates);
    } catch (err) {
      setUploadError("Échec de l'upload : " + err.message);
    } finally {
      setUploading(false);
      // Réinitialiser l'input file pour pouvoir ré-uploader le même fichier
      e.target.value = "";
    }
  };

  // ─── États de chargement / erreur ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-secondary">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <HiExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary mb-2">Oups !</h2>
          <p className="text-secondary mb-6">{error || "Projet non trouvé"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const progress     = typeof project.progress === "number" ? project.progress : 0;
  const progressColor = getProgressColor(progress);

  // Documents viennent de project.documents
  const documents = project.documents ?? [];

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-primary truncate">
                {project.title}
              </h1>
              <p className="text-sm text-muted">ID : {project.id}</p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${statusConfig.cls}`}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* ── Progression ──────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <HiChartBar className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-semibold text-primary">
              Progression du projet
            </h2>
          </div>

          {/* Pourcentage + label */}
          <div className="flex items-end justify-between mb-3">
            <p className="text-sm text-muted">{getProgressLabel(progress)}</p>
            <span
              className="text-2xl font-extrabold"
              style={{ color: progressColor }}
            >
              {progress}%
            </span>
          </div>

          {/* Barre — couleur inline pour éviter le problème bg-primary */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: progressColor,
                minWidth: progress > 0 ? "1rem" : "0",
              }}
            />
          </div>

          {/* Repères 0 / 50 / 100 */}
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-muted">0%</span>
            <span className="text-xs text-muted">50%</span>
            <span className="text-xs text-muted">100%</span>
          </div>
        </section>

        {/* ── Détails du projet ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <HiClipboardDocumentList className="w-6 h-6" />
            Détails du projet
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase text-muted mb-1">Service(s)</p>
              <p className="font-medium">{getServiceLabel(project.services)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted mb-1">Budget</p>
              <p className="font-semibold text-primary">
                {formatBudget(project.budget)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted mb-1">Date de début</p>
              <p>{formatDate(project.startDate)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted mb-1">
                Date estimée de fin
              </p>
              <p>{formatDate(project.endDate)}</p>
            </div>
          </div>

          {project.description && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs uppercase text-muted mb-2">Description</p>
              <p className="text-secondary leading-relaxed">
                {project.description}
              </p>
            </div>
          )}
        </section>

        {/* ── Chef de projet ────────────────────────────────────────────────── */}
        {project.chef && (
          <section className="bg-white rounded-2xl shadow-sm border border-border p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <HiUserGroup className="w-6 h-6" />
              Chef de projet
            </h2>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-border">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {project.chef.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-lg">{project.chef.name}</p>
                <p className="text-sm text-muted">
                  Matricule : {project.chef.matricule || "N/A"}
                </p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <a
                    href={`mailto:${project.chef.email}`}
                    className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
                  >
                    <HiEnvelope className="w-4 h-4" />
                    {project.chef.email}
                  </a>
                  {project.chef.phone && (
                    <a
                      href={`tel:${project.chef.phone}`}
                      className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
                    >
                      <HiPhone className="w-4 h-4" />
                      {project.chef.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Documents & Historique (onglets) ─────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-border p-6">

          {/* Onglets */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "documents"
                  ? "bg-white shadow text-primary"
                  : "text-muted hover:text-primary"
              }`}
            >
              <HiClipboardDocumentList className="w-4 h-4" />
              Documents
              {documents.length > 0 && (
                <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {documents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("updates")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "updates"
                  ? "bg-white shadow text-primary"
                  : "text-muted hover:text-primary"
              }`}
            >
              <HiClock className="w-4 h-4" />
              Historique
              {updates.length > 0 && (
                <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {updates.length}
                </span>
              )}
            </button>
          </div>

          {/* ── Onglet : Documents ─────────────────────────────────────────── */}
          {activeTab === "documents" && (
            <>
              {/* Bouton upload */}
              <div className="flex justify-end mb-4">
                <label
                  className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-all ${
                    uploading ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  <HiArrowUpTray className="w-5 h-5" />
                  {uploading ? "Envoi en cours..." : "Ajouter un document"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Erreur upload */}
              {uploadError && (
                <div className="flex items-start gap-3 text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mb-4 text-sm">
                  <HiExclamationTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {uploadError}
                </div>
              )}

              {/* Liste des documents */}
              {documents.length > 0 ? (
                <ul className="space-y-3">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-border hover:border-primary/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-primary truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {doc.fileType} &bull; {formatDate(doc.timestamp)}
                        </p>
                      </div>
                      <a
                         href={
    doc.fileUrl.startsWith("http")
      ? doc.fileUrl.replace("http://localhost:3000", "http://localhost:5000")
      : `http://localhost:5000${doc.fileUrl}`
  }
  target="_blank"
  rel="noopener noreferrer"
  download={doc.fileName}
  className="ml-4 flex-shrink-0 text-primary hover:underline font-medium text-sm"
>
  Télécharger
</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-14 text-muted">
                  <HiInbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">Aucun document pour le moment</p>
                  <p className="text-sm mt-1">
                    Ajoutez un fichier via le bouton ci-dessus
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── Onglet : Historique des updates ───────────────────────────── */}
          {activeTab === "updates" && (
            <>
              {updates.length > 0 ? (
                <ol className="relative border-l-2 border-gray-200 pl-6 space-y-6">
                  {updates.map((upd, idx) => {
                    const typeConfig = getUpdateTypeConfig(upd.updateType);
                    return (
                      <li key={upd.id} className="relative">
                        {/* Point de la timeline */}
                        <span
                          className={`absolute -left-[1.6rem] top-1 w-4 h-4 rounded-full border-2 border-white ${typeConfig.bg} flex items-center justify-center`}
                          style={{ boxShadow: "0 0 0 2px #e5e7eb" }}
                        >
                          {upd.updateType === "COMPLETED" ? (
                            <HiCheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <HiWrenchScrewdriver className={`w-3 h-3 ${typeConfig.color}`} />
                          )}
                        </span>

                        <div
                          className={`${typeConfig.bg} rounded-xl p-4 border border-gray-100`}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                            <span
                              className={`text-xs font-semibold uppercase tracking-wide ${typeConfig.color}`}
                            >
                              {typeConfig.label}
                            </span>
                            <span className="text-xs text-muted">
                              {formatDate(upd.timestamp)}
                            </span>
                          </div>

                          {upd.details && (
                            <p className="text-sm text-secondary leading-relaxed">
                              {upd.details}
                            </p>
                          )}

                          {/* Progression si présente */}
                          {upd.progress !== null &&
                            upd.progress !== undefined && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-muted">
                                    Progression
                                  </span>
                                  <span
                                    className="text-xs font-bold"
                                    style={{
                                      color: getProgressColor(upd.progress),
                                    }}
                                  >
                                    {upd.progress}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{
                                      width: `${upd.progress}%`,
                                      backgroundColor: getProgressColor(
                                        upd.progress
                                      ),
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                          {upd.updatedBy && (
                            <p className="text-xs text-muted mt-2">
                              Par : {upd.updatedBy}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className="text-center py-14 text-muted">
                  <HiClock className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">Aucune mise à jour pour le moment</p>
                  <p className="text-sm mt-1">
                    L'historique des changements apparaîtra ici
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProjectDetail;