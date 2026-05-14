import React, { useEffect, useState } from "react";
import { getClients } from "../../../services/api";
import Navbar from "../../../components/admin/Navbar";
import Sidebar from "../../../components/admin/Sidebar";
import AdminLayout from "../../../components/layout/admin/AdminLayout";
import { Link } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
        <FiRefreshCw className="w-8 h-8 text-green-600 animate-spin" />
        <span className="ml-3 text-gray-600">Loading Clients...</span>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 text-lg">No clients found</p>
      </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
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
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {client.companyName || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {client.address || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {client.phone || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {client.projects?.map((project) => (
                        <span
                          key={project.id}
                          className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-200"
                        >
                          {project.title} ({project.status})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
