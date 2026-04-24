import React from "react";
import Footer from "../../components/layout/Footer/Footer";
import GeoMap from "../../components/layout/map/map";
import Project from "../../components/layout/project/project";
import Service from "../../components/layout/service/service";

import AOS from "aos";
import "aos/dist/aos.css";

const GuestDashboard = () => {
  React.useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
  });
  return (
    <>
    <Service/>
    <Project/>
      <GeoMap/>
      <Footer />
      
    </>
  );
};

export default GuestDashboard;