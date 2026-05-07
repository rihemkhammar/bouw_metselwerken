import React, { useState } from "react";
import Sidebar from "../../admin/Sidebar";
import Navbar from "../../admin/Navbar";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
    
      <Sidebar onToggle={setIsSidebarOpen} />
      
     
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Navbar isSidebarOpen={isSidebarOpen} />
        <main className="p-6 pt-20">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;