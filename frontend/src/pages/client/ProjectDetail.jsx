import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getProjectDetail } from "../../services/api";

import {
  HiArrowLeft,
  HiEnvelope,
  HiPhone,
  HiUser,
  HiHashtag,
  HiChatBubbleLeft,
  HiPencilSquare,
  HiClipboardDocumentList,
  HiUserGroup,
  HiArrowPath,
  HiInbox,
  HiExclamationTriangle,
  HiMagnifyingGlass,
} from "react-icons/hi2";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const userId = getUserId();
        if (!userId) throw new Error("Utilisateur non authentifié");
        const data = await getProjectDetail(projectId, userId);
        setProject(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement du projet");
        console.error("Erreur fetch project:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  const formatBudget = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

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
      PENDING: { label: "En attente", class: "status-pending" },
      IN_PROGRESS: { label: "En cours", class: "status-in-progress" },
      COMPLETED: { label: "Terminé", class: "status-completed" },
      CANCELLED: { label: "Annulé", class: "status-cancelled" },
    };
    return (
      config[status] || {
        label: status,
        class: "bg-gray-100 text-gray-800 border-gray-200",
      }
    );
  };

  const getServiceLabel = (serviceKey) => {
    const services = {
      CONSTRUCTION_GENERALE: "Construction Générale",
      RENOVATION: "Rénovation",
      ELECTRICITE: "Électricité",
      PLOMBERIE: "Plomberie",
      PEINTURE: "Peinture",
      TRAITEMENT_HYDROFUGE: "Traitement Hydrofuge",
    };
    if (Array.isArray(serviceKey)) {
      return serviceKey.map((s) => services[s] || s).join(", ");
    }
    return services[serviceKey] || serviceKey;
  };

  const getUpdateTypeConfig = (type) => {
    const config = {
      "state change": {
        label: "Changement de statut",
        class: "bg-blue-100 text-blue-800 border-blue-200",
      },
      progress: {
        label: "Avancement",
        class: "bg-green-100 text-green-800 border-green-200",
      },
      comment: {
        label: "Commentaire",
        class: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      document: {
        label: "Document ajouté",
        class: "bg-purple-100 text-purple-800 border-purple-200",
      },
    };
    return (
      config[type] || {
        label: type,
        class: "bg-gray-100 text-gray-800 border-gray-200",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-secondary">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-border">
          <HiExclamationTriangle className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary mb-2">Oups !</h2>
          <p className="text-secondary mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-off-white hover:bg-gray-200 text-secondary rounded-lg font-medium transition-colors border border-border"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <HiMagnifyingGlass className="w-16 h-16 text-primary mx-auto mb-4" />
          <p className="text-secondary text-lg">Projet non trouvé</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary hover:opacity-80 font-medium transition-opacity"
          >
            Retourner en arrière
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 justify-start">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-off-white rounded-lg transition-colors text-secondary"
              aria-label="Retour"
            >
              <HiArrowLeft className="w-5 h-5 text-primary" />
            </button>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-primary truncate">
                {project.title}
              </h1>
              <p className="text-sm text-muted mt-1">
                ID:{" "}
                <code className="bg-off-white px-1.5 py-0.5 rounded text-xs border border-border">
                  {project.id}
                </code>
              </p>
            </div>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.class}`}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Informations Générales */}
        <section className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <HiClipboardDocumentList className="w-6 h-6 text-primary" />
            Informations du projet
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-4 border border-success/30">
              <p className="text-xs font-medium text-success uppercase tracking-wide">
                Budget
              </p>
              <p className="text-2xl font-bold text-success mt-1">
                {formatBudget(project.budget)}
              </p>
            </div>

            <div className="bg-off-white rounded-xl p-4 border border-border">
              <p className="text-xs font-medium text-muted uppercase tracking-wide">
                Service
              </p>
              <p className="text-lg font-semibold text-primary mt-1">
                {getServiceLabel(project.services)}
              </p>
            </div>

            <div className="bg-off-white rounded-xl p-4 border border-border">
              <p className="text-xs font-medium text-muted uppercase tracking-wide">
                Statut
              </p>
              <p className="text-lg font-semibold text-primary mt-1">
                {statusConfig.label}
              </p>
            </div>

            <div className="bg-off-white rounded-xl p-4 border border-border">
              <p className="text-xs font-medium text-muted uppercase tracking-wide">
                Client ID
              </p>
              <p
                className="text-xs font-mono text-secondary mt-1 truncate"
                title={project.clientId}
              >
                {project.clientId}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
              Description
            </label>
            <p className="text-secondary leading-relaxed bg-off-white rounded-lg p-4 border border-border">
              {project.description || "Aucune description"}
            </p>
          </div>
        </section>

        {/* Chef de Projet */}
        {project.chef && (
          <section className="bg-white rounded-2xl shadow-sm border border-border p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <HiUserGroup className="w-6 h-6 text-primary" />
              Chef de projet
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-off-white rounded-xl border border-border">
                <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {project.chef.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary text-lg">
                    {project.chef.name}
                  </p>
                  <p className="text-sm text-muted">
                    Matricule:{" "}
                    <code className="bg-white px-1 rounded">
                      {project.chef.matricule || "N/A"}
                    </code>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-border space-y-3">
                <div className="mt-3 space-y-2">
                  <a
                    href={`mailto:${project.chef.email}`}
                    className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
                  >
                    <HiEnvelope className="w-4 h-4 text-primary" />
                    {project.chef.email}
                  </a>
                  <a
                    href={`tel:${project.chef.phone}`}
                    className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
                  >
                    <HiPhone className="w-4 h-4 text-primary" />
                    {project.chef.phone}
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Client */}
        {project.client && (
          <section className="bg-white rounded-2xl shadow-sm border border-border p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <HiUser className="w-6 h-6 text-primary" />
              Client
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-off-white rounded-xl border border-border">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                  {project.client.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary text-lg">
                    {project.client.name}
                  </p>

                  <div className="mt-3 space-y-2">
                    <a
                      href={`mailto:${project.client.email}`}
                      className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
                    >
                      <HiEnvelope className="w-4 h-4 text-primary" />
                      {project.client.email}
                    </a>
                    <a
                      href={`tel:${project.client.phone}`}
                      className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
                    >
                      <HiPhone className="w-4 h-4 text-primary" />
                      {project.client.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-border space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted uppercase">
                    Entreprise
                  </p>
                  <p className="text-secondary">
                    {project.client.companyName || "Particulier"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted uppercase">
                    Adresse
                  </p>
                  <p className="text-secondary">
                    {project.client.address || "Non renseignée"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted uppercase">
                    ID Client
                  </p>
                  <p
                    className="text-xs font-mono text-secondary truncate"
                    title={project.client.id}
                  >
                    {project.client.id}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Updates */}
        <section className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <HiArrowPath className="w-6 h-6 text-primary" />
            Mises à jour
            {project.updates?.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-off-white text-secondary text-xs font-medium rounded-full border border-border">
                {project.updates.length}
              </span>
            )}
          </h2>
          {project.updates?.length > 0 ? (
            <ul className="space-y-4">
              {project.updates.map((update, index) => {
                const typeConfig = getUpdateTypeConfig(update.updateType);
                // FIX: handle progress as string or number
                const progressValue =
                  update.progress !== null && update.progress !== undefined
                    ? Number(update.progress)
                    : null;

                return (
                  <li
                    key={update.id || index}
                    className="p-4 bg-off-white rounded-xl border border-border"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {index + 1}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${typeConfig.class}`}
                          >
                            {typeConfig.label}
                          </span>

                          {update.services && (
                            <span className="text-xs text-muted bg-white px-2 py-1 rounded border border-border">
                              {getServiceLabel(update.services)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted bg-white px-2 py-1 rounded">
                        {formatDate(update.timestamp || update.createdAt)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(update.message || update.content || update.details) && (
                        <p className="text-secondary pl-1">
                          {update.message || update.content || update.details}
                        </p>
                      )}

                      {/* FIX: use progressValue instead of typeof check */}
                      {progressValue !== null && !isNaN(progressValue) && (
                        <div className="pl-1">
                          <div className="flex justify-between text-xs text-muted mb-1">
                            <span>Progression</span>
                            <span className="font-semibold text-primary">
                              {progressValue}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressValue}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-3 border-t border-border text-xs text-muted">
                        {update.updatedBy && (
                          <span className="flex items-center gap-1">
                            <HiUser className="w-3.5 h-3.5 text-primary" />
                            <code className="bg-white px-1.5 py-0.5 rounded">
                              {update.updatedBy.slice(0, 8)}...
                            </code>
                          </span>
                        )}
                        {update.id && (
                          <span className="flex items-center gap-1">
                            <HiHashtag className="w-3.5 h-3.5 text-primary" />
                            <code className="bg-white px-1.5 py-0.5 rounded">
                              {update.id.slice(0, 6)}...
                            </code>
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-8">
              <HiInbox className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="text-secondary">
                Aucune mise à jour pour le moment.
              </p>
            </div>
          )}
        </section>
        {/* Documents */}
        <section className="bg-white rounded-2xl shadow-sm border border-border p-6 mt-6">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <HiClipboardDocumentList className="w-6 h-6 text-primary" />
            Documents
            {project.documents?.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-off-white text-secondary text-xs font-medium rounded-full border border-border">
                {project.documents.length}
              </span>
            )}
          </h2>
          {project.documents?.length > 0 ? (
            <ul className="space-y-3">
              {project.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between bg-off-white p-3 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-medium text-primary">{doc.fileName}</p>
                    <p className="text-xs text-muted">
                      {doc.fileType} • {formatDate(doc.timestamp)}
                    </p>
                  </div>
                  <a
                    href={doc.fileUrl}
                    download={doc.fileName}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Télécharger
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <HiInbox className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="text-secondary">Aucun document disponible.</p>
            </div>
          )}
        </section>
      </main>

      {/* Barre d'actions mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 sm:hidden z-20">
        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-3 bg-primary hover:bg-primary-light text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            aria-label="Contacter le chef de projet"
          >
            <HiChatBubbleLeft className="w-5 h-5 text-white" />
            Contacter
          </button>
          <button
            className="flex-1 px-4 py-3 bg-off-white hover:bg-gray-200 text-secondary font-medium rounded-xl transition-colors flex items-center justify-center gap-2 border border-border"
            aria-label="Modifier le projet"
          >
            <HiPencilSquare className="w-5 h-5 text-primary" />
            Modifier
          </button>
        </div>
      </div>

      {/* Barre d'actions desktop */}
    </div>
  );
};

export default ProjectDetail;