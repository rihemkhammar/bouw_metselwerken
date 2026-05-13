import React from "react";
import { Routes, Route } from "react-router-dom";
import GuestHome from "./pages/Guest/GuestDashboard";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login";
import Compte from "./pages/Activer_Compte/activer_compte";
import ForgotPassword from "./pages/Activer_Compte/mp_oublie";
//import Dashboard from "./pages/clientdashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Chefcreate from "./pages/admin/CreateChef";
import ListChefs from "./pages/admin/ListChefs";
import ListClients from "./pages/admin/clients/ListClients";
import ListDemandeGuest from "./pages/admin/ListDemandeGuest";
import ListClientsDemande from "./pages/admin/clients/ListClientsDemande";
import ClientProfilePage from "./pages/client/ClientProfilePage";
import ClientLayout from "../src/components/layout/ClientLayout";
import ProjectDetail from "../src/pages/client/ProjectDetail";
import Service from "../src/pages/client/Service";
import ClientContact from "../src/pages/client/Clientcontact";
import ProjectList from "./pages/client/ProjectList";
import ClientDashboard from "./pages/client/clientdashboard";
import AdminProfile from "./pages/admin/AdminProfile";

import ProjectsListPage from "./pages/admin/ProjectsListPage";
import ProjectDetailPage from "./pages/admin/ProjectDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GuestHome />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Activer_Compte" element={<Compte />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/chefs/create" element={<Chefcreate />} />
      <Route path="/admin/chefs" element={<ListChefs />} />
      <Route path="/admin/clients" element={<ListClients />} />
      <Route path="/admin/guests/demandes" element={<ListDemandeGuest />} />
      <Route path="/admin/clients/demandes" element={<ListClientsDemande />} />
      <Route path="/admin/projects" element={<ProjectsListPage />} />
      <Route
        path="/admin/projects/:projectId"
        element={<ProjectDetailPage />}
      />

      <Route path="/admin/profile" element={<AdminProfile />} />

      <Route element={<ClientLayout />}>
        <Route path="/client/Dashboard" element={<ClientDashboard />} />
        <Route path="/client/ClientProfile" element={<ClientProfilePage />} />
        <Route path="/client/projetes" element={<ProjectList />} />
        <Route
          path="/client/projeteDetail/:projectId"
          element={<ProjectDetail />}
        />
        <Route path="/client/Service" element={<Service />} />
        <Route path="/client/Contact" element={<ClientContact />} />
      </Route>
    </Routes>
  );
}
