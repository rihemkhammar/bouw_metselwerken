import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getProjectsChef } from "../../services/api";
import ChefProjectCard from "../../components/chef/ProjectCard";
import ChefProjectFilters from "../../components/chef/Chefprojectfilters";
import LoadingSpinner from "../../components/client/LoadingSpinner";

export const STATIC_CLIENTS = [
  { id: "cli_001", name: "Entreprise Dupont" },
  { id: "cli_002", name: "SARL Martin & Fils" },
  { id: "cli_003", name: "Groupe Lefèvre" },
  { id: "cli_004", name: "TechVision SAS" },
  { id: "cli_005", name: "Cabinet Moreau Architecture" }
];

export default function ChefProjectList() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    services: "",
    clientId: "",
  });

  // ===================== FETCH PROJECTS =====================
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token non trouvé");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await getProjectsChef(userId);

      if (response?.success) {
        setProjects(response.projects || []);
        setError(null);
      } else {
        setError("Impossible de charger les projets");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // ===================== FETCH CLIENTS =====================
  const fetchClients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/clients");
      const data = await res.json();

      if (data?.success) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error("Erreur clients:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  // ===================== FILTER =====================
  const filteredProjects =
    filter === "ALL"
      ? projects
      : projects.filter((p) => p.status === filter);

  const counts = {
    ALL: projects.length,
    PLANNED: projects.filter((p) => p.status === "PLANNED").length,
    IN_PROGRESS: projects.filter((p) => p.status === "IN_PROGRESS").length,
    COMPLETED: projects.filter((p) => p.status === "COMPLETED").length,
  };

  // ===================== FORM HANDLER =====================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({
      title: "",
      description: "",
      budget: "",
      services: "",
      clientId: "",
    });
  };

  const handleSubmit = () => {
    console.log("NEW PROJECT:", form);
    handleClose();
  };

  // ===================== LOADING =====================
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner message="Chargement des projets..." />
      </div>
    );
  }

  // ===================== ERROR =====================
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button
          onClick={fetchProjects}
          className="px-4 py-2 text-white rounded"
          style={{ backgroundColor: "#2563eb" }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  // ===================== UI =====================
  return (
    <div className="space-y-6 relative pb-20">

      {/* FILTERS */}
      <div className="flex justify-between items-center">
        <ChefProjectFilters
          filter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />

        <button
          onClick={fetchProjects}
          className="px-4 py-2 text-white rounded"
          style={{ backgroundColor: "#2563eb" }}
        >
          🔄 Actualiser
        </button>
      </div>

      {/* PROJECT LIST */}
      {filteredProjects.length === 0 ? (
        <p className="text-center text-gray-500">Aucun projet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ChefProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* 🔵 FLOATING BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 px-5 py-3 rounded-full text-white shadow-lg font-semibold"
        style={{ backgroundColor: "#2563eb" }}
      >
        Ajouter projet
      </button>

      {/* 🧾 MODAL */}
      {showModal && (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={handleClose} // Ferme le modal en cliquant sur le fond
  >
    <div
      className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique dans le modal
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">Nouveau projet</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-200"
          aria-label="Fermer la fenêtre"
        >
          ✕
        </button>
      </div>

      {/* Formulaire */}
      <div className="p-6 space-y-4">
        {/* TITRE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre du projet</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ex: Rénovation bureaux Paris"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Détails, objectifs, contraintes..."
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* BUDGET */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget (€)</label>
            <input
              name="budget"
              value={form.budget}
              onChange={handleChange}
              type="number"
              placeholder="0.00"
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* SERVICE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de service</label>
            <select
              name="services"
              value={form.services}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="">Sélectionner</option>
              <option value="BUILDING">Construction</option>
              <option value="RENOVATION">Rénovation</option>
              <option value="DESIGN">Design / Architecture</option>
            </select>
          </div>
        </div>

        {/* CLIENT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client associé</label>
          <select
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          >
            <option value="">Choisir un client</option>
            {STATIC_CLIENTS.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
        <button
          onClick={handleClose}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 transition-all"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
        >
          Créer le projet
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}