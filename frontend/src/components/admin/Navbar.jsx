import { Phone } from "lucide-react";
import { IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
<div className="fixed top-0 left-20 w-screen bg-white border-b shadow-md z-40 ">
  <div className="flex items-center justify-between px-40 py-3">
    {/* Left: Section Title */}
    <h1 className="text-xl font-semibold text-gray-700 ml-40">Admin Dashboard</h1>

    {/* Center: Search */}
    <div className="hidden md:flex items-center w-1/3">
      <input
        type="text"
        placeholder="Search clients, chefs..."
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-300"
      />
    </div>

    {/* Right: Actions */}
    <div className="flex items-center gap-6">
      {/* Notifications */}
      <button className="relative text-gray-600 hover:text-blue-600">
        <IoMdNotifications size={24} />
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span>
      </button>

      {/* Quick Action */}
      <Link
        to="/chefs/create"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Add Chef
      </Link>

      {/* Profile Dropdown */}
      <div className="flex items-center gap-2 cursor-pointer">
        <img src={null}alt="Admin" className="w-8 h-8 rounded-full" />
        <span className="text-gray-700 font-medium">Admin</span>
      </div>
    </div>
  </div>
</div>

  );
};

export default Navbar;