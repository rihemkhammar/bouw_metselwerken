import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/admin/AdminLayout";
import ServicesCardsSection from "../../pages/admin/ServicesCardSection";
import { getAdminDashboard } from "../../services/api";
import { FiRefreshCw } from "react-icons/fi";

const SkeletonCard = () => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 animate-pulse">
    <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
    <div className="h-8 w-16 bg-gray-300 rounded"></div>
  </div>
);
const SkeletonTable = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 animate-pulse">
    <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

// StatCard amélioré pour le style "Premium"
const StatCard = ({ titre, valeur, icone, accent }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center gap-4">
    <div
      className={`${accent} w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white`}
    >
      {icone}
    </div>
    <div>
      <p className="text-sm text-gray-500">{titre}</p>
      <p className="text-2xl font-bold text-gray-800">{valeur}</p>
    </div>
  </div>
);
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalChefs: 0,
    totalProjects: 0,
    guestPending: 0,
    clientPending: 0,
  });

  const [clientsRecents, setClientsRecents] = useState([]);

  const [projetsRecents, setProjetsRecents] = useState([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1️⃣ Load cache immediately (no async here)
  useEffect(() => {
    const cached = sessionStorage.getItem("admin-dashboard");

    if (cached) {
      const parsed = JSON.parse(cached);
      setStats(parsed.stats);
      setClientsRecents(parsed.clientsRecents);
      setProjetsRecents(parsed.projetsRecents);
      setChargement(false);
    }
  }, []);

  // 2️⃣ Fetch fresh data AFTER initial render
  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        setChargement(true);

        const data = await getAdminDashboard();

        setStats({
          totalClients: data.totalClients ?? 0,
          totalChefs: data.totalChefs ?? 0,
          totalProjects: data.totalProjects ?? 0,
          guestPending: data.guestPending ?? 0,
          clientPending: data.clientPending ?? 0,
        });

        setClientsRecents(data.recentClients || []);
        setProjetsRecents(data.recentProjects || []);

        // Update cache
        sessionStorage.setItem(
          "admin-dashboard",
          JSON.stringify({
            stats: {
              totalClients: data.totalClients,
              totalChefs: data.totalChefs,
              totalProjects: data.totalProjects,
              guestPending: data.guestPending,
              clientPending: data.clientPending,
            },
            clientsRecents: data.recentClients,
            projetsRecents: data.recentProjects,
          }),
        );
      } catch (err) {
        setErreur("Impossible de charger les données du tableau de bord.");
        console.error("Erreur dashboard :", err);
      } finally {
        setChargement(false);
      }
    };

    // Always refresh in background
    chargerDonnees();
  }, []);

  if (chargement) {
    return (
      <AdminLayout pageTitle="Admin Dashboard">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium">
              Chargement du tableau de bord...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  if (erreur)
    return (
      <div className="p-8 text-center text-red-700 bg-red-50 rounded-lg">
        {erreur}
      </div>
    );

  return (
    <AdminLayout pageTitle="Admin Dashboard">
      {/* KPI Cards */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        🏗️ Tableau de Bord Administrateur
      </h1>

      {/* Grille des indicateurs clés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          titre="Clients Totaux"
          valeur={stats.totalClients}
          icone="👥"
        />

        <StatCard
          titre="Chefs de Chantier"
          valeur={stats.totalChefs}
          icone="👷"
        />

        <StatCard
          titre="Chantiers Actifs"
          valeur={stats.totalProjects}
          icone="🏗️"
        />

        <StatCard
          titre="Devis en Attente"
          valeur={stats.guestPending}
          icone="📝"
        />

        <StatCard
          titre="Clients à Valider"
          valeur={stats.clientPending}
          icone="⏳"
        />
      </div>

      {/* Tableau des clients récents */}
      {/* Clients récemment inscrits */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          👤 Derniers Clients Inscrits
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 font-semibold text-gray-700">Nom</th>
                <th className="p-3 font-semibold text-gray-700">Email</th>
                <th className="p-3 font-semibold text-gray-700">Téléphone</th>
                <th className="p-3 font-semibold text-gray-700">Statut</th>
                <th className="p-3 font-semibold text-gray-700">Inscrit le</th>
              </tr>
            </thead>

            <tbody>
              {clientsRecents.map((client) => (
                <tr
                  key={client.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {client.name}
                  </td>
                  <td className="p-3 text-gray-700">{client.email}</td>
                  <td className="p-3 text-gray-700">{client.phone ?? "-"}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        client.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : client.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>

                  <td className="p-3 text-gray-600">
                    {new Date(client.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {clientsRecents.length === 0 && (
            <p className="text-center py-6 text-gray-500">
              Aucun client récent à afficher.
            </p>
          )}
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          🏗️ Derniers Projets
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 font-semibold text-gray-700">Titre</th>
                <th className="p-3 font-semibold text-gray-700">Client</th>
                <th className="p-3 font-semibold text-gray-700">Chef</th>
                <th className="p-3 font-semibold text-gray-700">Statut</th>
                <th className="p-3 font-semibold text-gray-700">Budget</th>
                <th className="p-3 font-semibold text-gray-700">
                  Dernière mise à jour
                </th>
              </tr>
            </thead>

            <tbody>
              {projetsRecents.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3">{p.client.name}</td>
                  <td className="p-3">{p.chef.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.status === "PLANNED"
                          ? "bg-gray-200 text-gray-700"
                          : p.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">{p.budget ?? "-"}</td>
                  <td className="p-3 text-gray-700">
                    {p.updates?.length > 0
                      ? new Date(p.updates[0].timestamp).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "Aucune"}
                  </td>
                  <td className="p-3">
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      {" "}
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ServicesCardsSection />
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          ⇧
        </button>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
