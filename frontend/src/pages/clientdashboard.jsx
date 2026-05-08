import React from "react";
import {
  FaUser,
  FaChartLine,
  FaTasks,
  FaBell,
  FaCog
} from "react-icons/fa";
import Sidebar from "../components/client/sidebar.jsx"
import ClientProfilePage from "../pages/client/ClientProfilePage.jsx"

const ClientDashboard = () => {
  return (
    <>
    <Sidebar/>
    <ClientProfilePage/>
   {/*
      <div className="min-h-screen bg-gray-100 p-6">

      {/* Header *//*}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <FaBell className="text-gray-600 text-xl cursor-pointer" />
      </div>

      {/* Cards *//*}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-lg shadow">
          <FaUser className="text-blue-500 text-2xl mb-2" />
          <h2 className="font-semibold">Utilisateurs</h2>
          <p className="text-gray-500">120 inscrits</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <FaChartLine className="text-green-500 text-2xl mb-2" />
          <h2 className="font-semibold">Statistiques</h2>
          <p className="text-gray-500">+15% ce mois</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <FaTasks className="text-purple-500 text-2xl mb-2" />
          <h2 className="font-semibold">Tâches</h2>
          <p className="text-gray-500">8 en cours</p>
        </div>

      </div>

      {/* Section activité *//*}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Activité récente</h2>
        <ul className="space-y-2 text-gray-600">
          <li>✔ Utilisateur ajouté</li>
          <li>✔ Rapport généré</li>
          <li>✔ Mise à jour système</li>
        </ul>
      </div>

      {/* Settings button *//*}
      <div className="mt-6 flex justify-end">
        <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded">
          <FaCog /> Paramètres
        </button>
      </div>

    </div>*/}

    </>

   

  );
};

export default ClientDashboard;