import React, { useEffect, useState } from "react";
import { getClientRequests, approveClientRequest, declineClientRequest , markClientRequestViewed } from "../../../services/api";
import AdminLayout from "../../../components/layout/admin/AdminLayout";

const ListClientsDemande = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getClientRequests();
        setRequests(data);
      } catch (err) {
        console.error("Error fetching client requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

const handleApprove = async (id) => {
  try {
    await approveClientRequest(id);
    const updated = await getClientRequests();
    setRequests(updated);
  } catch (err) {
    console.error("Error approving request:", err);
  }
};

  const handleDecline = async (id) => {
    try {
      await declineClientRequest(id);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      console.error("Error declining request:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Chargement des demandes...</span>
      </div>
    );
  }

  return (
    <AdminLayout pageTitle="Demandes d'activation de comptes">
      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Aucune demande trouvée.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Liste des demandes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors animate-fadeIn">
                    <td className="px-6 py-4 font-medium text-gray-900">{req.user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{req.user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{req.user.phone || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecline(req.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                        
                      </div>
                    </td>
                    <td className="px-6 py-4">
  {!req.viewed && (
    <button
      onClick={async () => {
        try {
          await markClientRequestViewed(req.id);
          setRequests((prev) =>
            prev.map((r) =>
              r.id === req.id ? { ...r, viewed: true } : r
            )
          );
        } catch (err) {
          console.error("Error marking client request viewed:", err);
        }
      }}
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      Mark as Viewed
    </button>
  )}
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ListClientsDemande;
