import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaListUl } from "react-icons/fa";
import { getServicesWithChefs } from "../../services/api";

const ServicesCardsSection = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getServicesWithChefs();
        setData(result);
      } catch (e) {
        console.error("Erreur chargement services", e);
      }
    };
    load();
  }, []);

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">Services et Chefs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item.service}
            onClick={() => navigate(`/admin/projects/by-service?service=${item.service}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-lg border border-gray-100 p-5 
              hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <FaListUl className="text-blue-500" />
              <h2 className="text-lg font-bold text-gray-800">{item.service}</h2>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <FaUserTie className="text-blue-400" />
              Chef : {item.chef ? item.chef.name : "Non assigné"}
            </div>

            <p className="text-sm text-gray-500">
              {item.projectsCount} projet(s) associé(s)
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesCardsSection;
