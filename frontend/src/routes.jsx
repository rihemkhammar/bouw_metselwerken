import React from "react";
import { Routes, Route } from "react-router-dom";
import GuestHome from "./pages/Guest/GuestDashboard";
import Contact from "./pages/Contact/Contact";
import  Login  from "./pages/Login";
import Compte from "./pages/Activer_Compte/activer_compte";
import ClientDashboard from "./pages/client/clientdashboard";
import ForgotPassword from "./pages/Activer_Compte/mp_oublie";
import ClientProfilePage from "./pages/client/ClientProfilePage";
import ClientLayout from "../src/components/layout/ClientLayout";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GuestHome />} />
      <Route path="/contact" element={<Contact />} />
       <Route path="/login" element={<Login />} />
        <Route path="/Activer_Compte" element={<Compte />} />
        <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
         {/*<Route path="/client_dashboard" element={<ClientDashboard/>}/>*/}
        {/*<Route path="/client/ClientProfile" element={<ClientProfilePage/>}/>*/}
        <Route element={<ClientLayout />}>
        <Route path="/client/Dashboard" element={<ClientDashboard />} />
        <Route path="/client/ClientProfile" element={<ClientProfilePage />} />
        </Route>
        
     
    

        
    </Routes>
  );
}
//