import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/admin/AdminLayout";
import { FaSearch, FaFolderOpen, FaPlus } from "react-icons/fa";
import { getAllProjects, getClients, getChefs, createProject } from "../../services/api";
import { useNavigate } from "react-router-dom";

const SERVICES = [
  { value: "MACONNERIE", label: "Maçonnerie" },
  { value: "RENOVATION", label: "Rénovation" },
  { value: "RESTAURATION", label: "Restauration" },
  { value: "CONSTRUCTION_GENERALE", label: "Construction générale" },
  { value: "REJOINTOIEMENT_RUSTIQUE", label: "Rejointoiement rustique" },
  { value: "TRAITEMENT_HYDROFUGE", label: "Traitement hydrofuge" },
  { value: "DEMOUSSAGE", label: "Démoussage" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  budget: "",
  services: "",
  clientId: "",
  chefId: "",
};

const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ===================== FETCH PROJECTS =====================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Erreur chargement projets", e);
      }
    };
    load();
  }, []);

  // ===================== OPEN MODAL + FETCH CLIENTS & CHEFS =====================
  const handleOpenModal = async () => {
    setShowModal(true);
    setDropdownLoading(true);
    setError("");
    try {
      const [clientsRes, chefsRes] = await Promise.all([getClients(), getChefs()]);
      setClients(Array.isArray(clientsRes) ? clientsRes : []);
      setChefs(Array.isArray(chefsRes) ? chefsRes : []);
    } catch (e) {
      console.error("Erreur chargement données modal", e);
      setError("Impossible de charger les clients/chefs.");
    } finally {
      setDropdownLoading(false);
    }
  };

  // ===================== COMPTEURS =====================
  const totalCount = projects.length;
  const inProgressCount = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const completedCount = projects.filter((p) => p.status === "COMPLETED").length;

  // ===================== FILTRAGE =====================
  const filtered = projects
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => statusFilter === "ALL" || p.status === statusFilter);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleClose = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setError("");
  };

  // ===================== SUBMIT CREATE PROJECT =====================
  const handleSubmit = async () => {
    setError("");
    if (!form.title.trim()) return setError("Le titre est obligatoire.");
    if (!form.services) return setError("Veuillez choisir un type de service.");
    if (!form.clientId) return setError("Veuillez choisir un client.");
    if (!form.chefId) return setError("Veuillez choisir un chef de projet.");

    setSubmitting(true);
    try {
      const newProject = await createProject({
        title: form.title.trim(),
        description: form.description.trim(),
        budget: form.budget ? parseFloat(form.budget) : null,
        services: form.services,
        clientId: form.clientId,
        chefId: form.chefId,
      });
      setProjects((prev) => [newProject, ...prev]);
      handleClose();
    } catch (e) {
      console.error("Erreur création projet", e);
      setError(e.message || "Impossible de créer le projet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout pageTitle="Liste des Projets">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaFolderOpen className="text-blue-600" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Tous les projets</h1>
            </div>
            <p className="text-gray-500 ml-11">
              Vue globale des projets avec client, chef et statut.
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition font-medium"
          >
            <FaPlus size={14} />
            Créer un projet
          </button>
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-6">
          {[
            { label: "Tous", value: "ALL", count: totalCount },
            { label: "En cours", value: "IN_PROGRESS", count: inProgressCount },
            { label: "Terminés", value: "COMPLETED", count: completedCount },
          ].map(({ label, value, count }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-2 rounded-lg border ${
                statusFilter === value
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un projet par titre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200
              hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100
              transition-all duration-200"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-[#FF8C00]" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Titre</th>
                  <th className="p-4 font-medium text-gray-600">Service</th>
                  <th className="p-4 font-medium text-gray-600">Client</th>
                  <th className="p-4 font-medium text-gray-600">Chef</th>
                  <th className="p-4 font-medium text-gray-600">Statut</th>
                  <th className="p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{p.title}</td>
                    <td className="p-4 text-gray-600">
                      {SERVICES.find((s) => s.value === p.services)?.label || p.services}
                    </td>
                    <td className="p-4">{p.client?.name}</td>
                    <td className="p-4">{p.chef?.name}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : p.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {p.status === "COMPLETED"
                          ? "Terminé"
                          : p.status === "IN_PROGRESS"
                          ? "En cours"
                          : "Planifié"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/admin/projects/${p.id}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs font-medium"
                      >
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 text-sm">
                      Aucun projet trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Nouveau projet</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du projet <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ex: Rénovation bureaux Paris"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Détails, objectifs, contraintes..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Budget + Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget (€)</label>
                  <input
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    type="number"
                    placeholder="0.00"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de service <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="services"
                    value={form.services}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="">Sélectionner</option>
                    {SERVICES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client + Chef */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Client */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client associé <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="clientId"
                    value={form.clientId}
                    onChange={handleChange}
                    disabled={dropdownLoading}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white disabled:opacity-50"
                  >
                    <option value="">
                      {dropdownLoading ? "Chargement..." : "Choisir un client"}
                    </option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || c.email}
                      </option>
                    ))}
                  </select>
                  {!dropdownLoading && clients.length === 0 && (
                    <p className="text-xs text-red-400 mt-1">Aucun client trouvé.</p>
                  )}
                </div>

                {/* Chef */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chef de projet <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="chefId"
                    value={form.chefId}
                    onChange={handleChange}
                    disabled={dropdownLoading}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white disabled:opacity-50"
                  >
                    <option value="">
                      {dropdownLoading ? "Chargement..." : "Choisir un chef"}
                    </option>
                    {chefs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || c.email}
                      </option>
                    ))}
                  </select>
                  {!dropdownLoading && chefs.length === 0 && (
                    <p className="text-xs text-red-400 mt-1">Aucun chef trouvé.</p>
                  )}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={handleClose}
                disabled={submitting}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || dropdownLoading}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Création...
                  </>
                ) : (
                  "Créer le projet"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProjectsListPage;