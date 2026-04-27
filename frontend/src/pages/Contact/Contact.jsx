import React from "react";
import Footer from "../../components/layout/Footer/Footer";
import GeoMap from "./Sections/map";
import ContactHeader from "../Contact/Sections/ContactHeader";
import ContactForm from "./Sections/ContactSection";
const Contact = () => {
  return (
    <div>
      <ContactHeader />
      <ContactForm />
      <GeoMap/>
      <Footer />
    </div>
  );
};

export default Contact;
