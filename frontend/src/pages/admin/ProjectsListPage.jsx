import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/admin/AdminLayout";
import { FaSearch, FaFolderOpen } from "react-icons/fa";
import { getAllProjects } from "../../services/api";
import { useNavigate } from "react-router-dom";

const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (e) {
        console.error("Erreur chargement projets", e);
      }
    };
    load();
  }, []);

  // Compteurs par statut
  const totalCount = projects.length;
  const inProgressCount = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const completedCount = projects.filter((p) => p.status === "COMPLETED").length;

  // Filtrage par recherche + statut
  const filtered = projects
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (statusFilter === "ALL") return true;
      return p.status === statusFilter;
    });

  return (
    <AdminLayout pageTitle="Liste des Projets">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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

        {/* Filtres par statut */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-4 py-2 rounded-lg border ${
              statusFilter === "ALL" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Tous ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter("IN_PROGRESS")}
            className={`px-4 py-2 rounded-lg border ${
              statusFilter === "IN_PROGRESS" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            En cours ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter("COMPLETED")}
            className={`px-4 py-2 rounded-lg border ${
              statusFilter === "COMPLETED" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Terminés ({completedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
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
                    <td className="p-4">{p.title}</td>
                    <td className="p-4">{p.services}</td>
                    <td className="p-4">{p.client?.name}</td>
                    <td className="p-4">{p.chef?.name}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
                            p.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : p.status === "IN_PROGRESS"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/admin/projects/${p.id}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
    </AdminLayout>
  );
};

export default ProjectsListPage;
