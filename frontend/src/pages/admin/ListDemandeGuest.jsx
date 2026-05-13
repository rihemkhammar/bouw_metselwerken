import React, { useEffect, useState } from "react";
import { getGuests, markGuestRequestViewed } from "../../services/api";
import AdminLayout from "../../components/layout/admin/AdminLayout";
import { toast } from "react-toastify";
import { FiRefreshCw } from "react-icons/fi";

const ListDemandeGuest = () => {
  const [guests, setGuests] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await getGuests();
        setGuests(data);
      } catch (err) {
        console.error("Erreur lors du chargement des demandes guests :", err);
      } finally {
        setChargement(false);
      }
    };
    fetchGuests();
  }, []);

  if (chargement) {
    return (
      <AdminLayout pageTitle="Liste des demandes de Guests">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium">
              Chargement des demandes de guests...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleMarkViewed = async (guestId, requestId) => {
    try {
      setProcessingId(requestId);
      await markGuestRequestViewed(requestId);
      setGuests((prev) =>
        prev.map((g) =>
          g.id === guestId
            ? {
                ...g,
                requests: [{ ...g.requests[0], viewed: true }],
              }
            : g
        )
      );
      toast.info("Demande de guest marquée comme vue.");
      const data = await getGuests();
      setGuests(data);
    } catch (err) {
      console.error("Erreur lors du marquage :", err);
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout pageTitle="Liste des demandes de Guests">
      {guests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Aucune demande trouvée.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              Demandes des services
            </h2>
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
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date de demande
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="hover:bg-gray-50 transition-colors animate-fadeIn"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {guest.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{guest.email}</td>
                    <td className="px-6 py-4 text-gray-900">
                      {guest.phone || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {guest.services?.length > 0 ? (
                          guest.services.map((service, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {guest.requests?.[0]?.createdAt
                        ? new Date(
                            guest.requests[0].createdAt
                          ).toLocaleString("fr-FR")
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {!guest.requests?.[0]?.viewed ? (
                        <button
                          onClick={() =>
                            handleMarkViewed(guest.id, guest.requests[0].id)
                          }
                          disabled={processingId === guest.requests[0].id}
                          className={`text-sm px-3 py-1 rounded ${
                            processingId === guest.requests[0].id
                              ? "bg-blue-400 text-white cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {processingId === guest.requests[0].id ? (
                            <span className="flex items-center">
                              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                              Traitement...
                            </span>
                          ) : (
                            "Marquer comme vu"
                          )}
                        </button>
                      ) : (
                        <span className="text-sm text-green-600 font-medium">
                          ✔ Vu
                        </span>
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

export default ListDemandeGuest;
