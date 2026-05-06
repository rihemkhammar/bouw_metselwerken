import React from "react";
import { Routes, Route } from "react-router-dom";
import GuestHome from "./pages/Guest/GuestDashboard";
import Contact from "./pages/Contact/Contact";
import  Login  from "./pages/Login";
import Compte from "./pages/Activer_Compte/activer_compte";
import ForgotPassword from "./pages/Activer_Compte/mp_oublie";
import Dashboard from "./pages/clientdashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Chefcreate from "./pages/admin/CreateChef";



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GuestHome />} />
      <Route path="/contact" element={<Contact />} />
       <Route path="/login" element={<Login />} />
        <Route path="/Activer_Compte" element={<Compte />} />
        <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
         <Route path="/client_dashboard" element={<Dashboard/>}/>
         <Route path="/client_dashboard" element={<Dashboard/>}/>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/admin/chefs/create" element={<Chefcreate/>}/>
          
       

        
    </Routes>
  );
}
