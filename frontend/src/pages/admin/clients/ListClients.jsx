import React, { useEffect, useState } from "react";
import { getClients, deleteClient, updateClient, resetClientPassword } from "../../../services/api";
import AdminLayout from "../../../components/layout/admin/AdminLayout";

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editClient, setEditClient] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // --- état mot de passe ---
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression de ce client ?")) return;
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const openEdit = (client) => {
    setEditClient(client);
    setFormData({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      companyName: client.companyName || "",
      address: client.address || "",
    });
    setError("");
    setShowPwdForm(false);
    setNewPassword("");
    setPwdError("");
    setPwdSuccess("");
  };

  const closeEdit = () => {
    setEditClient(null);
    setFormData({});
    setError("");
    setShowPwdForm(false);
    setNewPassword("");
    setPwdError("");
    setPwdSuccess("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await updateClient(editClient.id, formData);
      setClients((prev) =>
        prev.map((c) => (c.id === editClient.id ? { ...c, ...updated } : c))
      );
      closeEdit();
    } catch (err) {
      setError("Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    setPwdError("");
    setPwdSuccess("");
    if (!newPassword || newPassword.length < 8) {
      setPwdError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setSavingPwd(true);
    try {
      await resetClientPassword(editClient.id, newPassword);
      setPwdSuccess("Mot de passe mis à jour avec succès");
      setNewPassword("");
      setShowPwdForm(false);
    } catch (err) {
      setPwdError(err.message || "Erreur lors de la réinitialisation");
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.companyName || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.address || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.phone || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {client.projects?.map((project) => (
                        <span key={project.id} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-200">
                          {project.title} ({project.status})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(client)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
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

      {/* Modal Modifier */}
      {editClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Modifier le client</h3>

            {error && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}

            {/* Champs info client */}
            <div className="flex flex-col gap-3">
              {[
                { label: "Nom", name: "name" },
                { label: "Email", name: "email" },
                { label: "Téléphone", name: "phone" },
                { label: "Entreprise", name: "companyName" },
                { label: "Adresse", name: "address" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>

            {/* Section mot de passe */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-2">Mot de passe</p>

              {pwdSuccess && (
                <div className="mb-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                  {pwdSuccess}
                </div>
              )}

              {!showPwdForm ? (
                <button
                  onClick={() => { setShowPwdForm(true); setPwdError(""); setPwdSuccess(""); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                >
                  🔒 Changer le mot de passe
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  {pwdError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                      {pwdError}
                    </div>
                  )}
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe (min. 8 caractères)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowPwdForm(false); setNewPassword(""); setPwdError(""); }}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleResetPassword}
                      disabled={savingPwd}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-50"
                    >
                      {savingPwd ? "Enregistrement..." : "Confirmer"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
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
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50"
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

export default ListClients;