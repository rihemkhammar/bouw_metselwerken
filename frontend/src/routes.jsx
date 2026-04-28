import React from "react";
import { Routes, Route } from "react-router-dom";
import GuestHome from "./pages/Guest/GuestDashboard";
import Contact from "./pages/Contact/Contact";
import  Login  from "./pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GuestHome />} />
      <Route path="/contact" element={<Contact />} />
       <Route path="/login" element={<Login />} />
    </Routes>
  );
}
