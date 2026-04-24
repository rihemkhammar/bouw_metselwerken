import React from "react";
import Footer from "../../components/layout/Footer/Footer";
import GeoMap from "../../components/layout/map/map";
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
      <GeoMap/>
      <Footer />
      
    </>
  );
};

export default GuestDashboard;