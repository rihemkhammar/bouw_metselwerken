import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getProjectsChef } from "../../services/api";
import ChefProjectCard from "../../components/chef/ProjectCard";
import ChefProjectFilters from "../../components/chef/Chefprojectfilters";
import LoadingSpinner from "../../components/client/LoadingSpinner";

export default function ChefProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

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

  useEffect(() => {
    fetchProjects();
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
    <div className="space-y-6">
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
    </div>
  );
}