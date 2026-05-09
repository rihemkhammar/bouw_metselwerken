import React, { useEffect, useState } from "react";
import {
  getClientRequests,
  approveClientRequest,
  declineClientRequest,
  markClientRequestViewed,
} from "../../../services/api";
import AdminLayout from "../../../components/layout/admin/AdminLayout";
import { toast } from "react-toastify";

const ListClientsDemande = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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
      setProcessingId(id);
      const { request } = await approveClientRequest(id);
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, ...request } : req)),
      );

      toast.success(`Client approuvé avec succès. Email envoyé avec succès.`);

      const data = await getClientRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error approving request:", err);
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (id) => {
    try {
      setProcessingId(id);
      await declineClientRequest(id);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "DECLINED", viewed: true } : req,
        ),
      );
      toast.info("Demande refusée avec succès.");
      const data = await getClientRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error declining request:", err);
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };
  const handleMarkViewed = async (id) => {
    try {
      setProcessingId(id);
      await markClientRequestViewed(id);
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, viewed: true } : req)),
      );
      toast.info("Demande marquée comme vue.");
      const data = await getClientRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error marking client request viewed:", err);
      toast.error(err.message);
    } finally {
      setProcessingId(null);
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
            <h2 className="text-xl font-bold text-gray-800">
              Liste des demandes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50 transition-colors animate-fadeIn"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {req.user.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {req.user.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {req.user.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {req.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              disabled={processingId === req.id}
                              className={`px-3 py-1 rounded text-white ${
                                processingId === req.id
                                  ? "bg-green-400 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                            >
                              {processingId === req.id ? (
                                <span className="flex items-center">
                                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                  Processing...
                                </span>
                              ) : (
                                "Approve"
                              )}
                            </button>

                            <button
                              onClick={() => handleDecline(req.id)}
                              disabled={processingId === req.id}
                              className={`px-3 py-1 rounded text-white ${
                                processingId === req.id
                                  ? "bg-red-400 cursor-not-allowed"
                                  : "bg-red-600 hover:bg-red-700"
                              }`}
                            >
                              {processingId === req.id ? (
                                <span className="flex items-center">
                                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                  Processing...
                                </span>
                              ) : (
                                "Remove"
                              )}
                            </button>

                            {!req.viewed && (
                              <button
                                onClick={() => handleMarkViewed(req.id)}
                                disabled={processingId === req.id}
                                className={`px-3 py-1 rounded text-white ${
                                  processingId === req.id
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                              >
                                {processingId === req.id ? (
                                  <span className="flex items-center">
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                    Processing...
                                  </span>
                                ) : (
                                  "Mark as Viewed"
                                )}
                              </button>
                            )}
                          </>
                        )}

                        {req.status === "APPROVED" && (
                          <span className="text-green-600 font-medium">
                            ✔ Approved
                          </span>
                        )}
                        {req.status === "DECLINED" && (
                          <span className="text-red-600 font-medium">
                            ✖ Declined
                          </span>
                        )}
                        {req.status === "PENDING" && req.viewed && (
                          <span className="text-blue-600 font-medium">
                            👁 Déjà vu
                          </span>
                        )}
                      </div>
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
