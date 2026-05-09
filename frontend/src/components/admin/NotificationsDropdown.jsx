import { useState, useEffect } from "react";
import { IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import { getClientRequests, getGuests } from "../../../src/services/api";

const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);
  const [clientRequests, setClientRequests] = useState([]);
  const [guestRequests, setGuestRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clients = await getClientRequests();
        const guests = await getGuests();
        setClientRequests(clients);
        setGuestRequests(guests);
      } catch (err) {
        console.error("Erreur lors du chargement des notifications :", err);
      }
    };
    fetchData();
  }, []);

  const totalCount =
    clientRequests.filter((req) => !req.viewed).length +
    guestRequests.reduce(
      (acc, guest) => acc + guest.requests.filter((r) => !r.viewed).length,
      0
    );

  return (
    <div className="relative">
      {/* Icône de cloche */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <IoMdNotifications size={22} />
        {totalCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {totalCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border z-50">
          <div className="p-3 border-b flex items-center justify-between">
            <span className="font-semibold text-gray-700">Notifications</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Fermer les notifications"
            >
              ✕
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {clientRequests
              .filter((req) => !req.viewed)
              .map((req) => (
                <Link
                  key={req.id}
                  to="/admin/clients/demandes"
                  onClick={() => setOpen(false)} // 🔥 ferme au clic
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Demande client : {req.user.name}
                </Link>
              ))}

            {guestRequests.flatMap((guest) =>
              guest.requests
                .filter((r) => !r.viewed)
                .map((r) => (
                  <Link
                    key={r.id}
                    to="/admin/guests/demandes"
                    onClick={() => setOpen(false)} // 🔥 ferme au clic
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Demande invité : {guest.name}
                  </Link>
                ))
            )}

            {totalCount === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500">
                Aucune nouvelle demande
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
