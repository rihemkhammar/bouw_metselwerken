import React, { useEffect, useState } from "react";
import { getClients } from "../../../services/api";
import AdminLayout from "../../../components/layout/admin/AdminLayout";
import { Link } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (err) {
        console.error("Erreur lors du chargement des clients :", err);
      } finally {
        setChargement(false);
      }
    };
    fetchClients();
  }, []);

  if (chargement) {
    return (
      <AdminLayout pageTitle="Liste des Clients">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium">
              Chargement des clients...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (clients.length === 0) {
    return (
      <AdminLayout pageTitle="Liste des Clients">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Aucun client trouvé</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Liste des Clients">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Liste des Clients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="hover:bg-gray-50 transition-colors animate-fadeIn">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Projets
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 transition-colors animate-fadeIn"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {client.companyName || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {client.address || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {client.phone || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {client.projects?.map((project) => (
                        <span
                          key={project.id}
                          className={`text-xs px-2.5 py-1 rounded-lg border ${
                            project.status === "COMPLETED"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : project.status === "IN_PROGRESS"
                              ? "bg-gray-100 text-gray-700 border-gray-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {project.title} ({project.status})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/clients/${client.id}/edit`}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        Modifier
                      </Link>
                      <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ListClients;
