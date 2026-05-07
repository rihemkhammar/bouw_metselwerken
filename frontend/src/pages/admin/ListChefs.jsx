import React, { useEffect, useState } from "react";
import { getChefs } from "../../services/api";
import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";
import AdminLayout from "../../components/layout/admin/AdminLayout";
import { Link } from "react-router-dom";

const ListChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const data = await getChefs();
        setChefs(data);
      } catch (err) {
        console.error("Error fetching chefs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChefs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading Chefs...</span>
      </div>
    );
  }

  if (chefs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 text-lg">No chefs found</p>
      </div>
    );
  }

  return (
    <AdminLayout pageTitle="Liste des Chefs">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Liste des Chefs</h2>
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
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéros
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chefs.map((chef) => (
                <tr
                  key={chef.id}
                  className="hover:bg-gray-50 transition-colors animate-fadeIn"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {chef.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {chef.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {chef.services?.map((service, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {chef.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/chefs/${chef.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Modifier
                      </Link>
                      <button className="text-red-600 hover:text-red-800">
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

export default ListChefs;
