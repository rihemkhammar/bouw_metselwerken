import React from "react";
import Footer from "../../components/layout/Footer/Footer";
import GeoMap from "./Sections/map";
import ContactHeader from "../Contact/Sections/ContactHeader";
import CompteForm from "./Sections/ContactSection";
const ActiverCompte = () => {
  return (
    <div>
      <ContactHeader />
      <CompteForm />
      <GeoMap/>
      <Footer />
    </div>
  );
};

export default ActiverCompte;
