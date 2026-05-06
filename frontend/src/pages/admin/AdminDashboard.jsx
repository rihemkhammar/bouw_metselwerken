import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";

const AdminDashboard = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="ml-64 mt-20 p-6"></div>
    </div>
  );
};

export default AdminDashboard;
