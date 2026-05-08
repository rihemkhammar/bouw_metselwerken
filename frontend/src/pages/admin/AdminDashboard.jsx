import React from "react";
import AdminLayout from "../../components/layout/admin/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout pageTitle="Admin Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Clients</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">128</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Chefs</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
          <p className="mt-2 text-2xl font-bold text-yellow-600">5</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Approved Projects</h3>
          <p className="mt-2 text-2xl font-bold text-green-600">34</p>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Recent Clients Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
      
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">•</span>
            <p className="text-gray-700"></p>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">•</span>
            <p className="text-gray-700"></p>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-600 font-bold">•</span>
            <p className="text-gray-700"></p>
          </li>
        </ul>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
