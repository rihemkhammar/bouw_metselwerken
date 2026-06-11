import React, { useEffect, useState } from "react";
import { getChefs, deleteChef, updateChef } from "../../services/api";
import AdminLayout from "../../components/layout/admin/AdminLayout";

const ListChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editChef, setEditChef] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression de ce chef ?")) return;
    try {
      await deleteChef(id);
      setChefs((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const openEdit = (chef) => {
    setEditChef(chef);
    setFormData({
      name: chef.name || "",
      email: chef.email || "",
      phone: chef.phone || "",
    });
    setError("");
  };

  const closeEdit = () => {
    setEditChef(null);
    setFormData({});
    setError("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await updateChef(editChef.id, formData);
      setChefs((prev) =>
        prev.map((c) => (c.id === editChef.id ? { ...c, ...updated } : c))
      );
      closeEdit();
    } catch (err) {
      setError("Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading Chefs...</span>
      </div>
    );
  }

  return (
    <AdminLayout pageTitle="Liste des Chefs">
      {chefs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Aucun chef trouvé.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Liste des Chefs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chefs.map((chef) => (
                  <tr key={chef.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{chef.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{chef.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {chef.services?.map((service, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{chef.phone || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(chef)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(chef.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
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
      )}

      {/* Modal Modifier */}
      {editChef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Modifier le chef</h3>

            {error && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {[
                { label: "Nom", name: "name" },
                { label: "Email", name: "email" },
                { label: "Téléphone", name: "phone" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ListChefs;