import React from "react";
import Navbar from "../../../components/layout/Navbar";
import { assets } from "../../../assets/assets";
const ContactHeader = () => {
  return (
    <div
      className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden"
      id="Header"
    >
      <Navbar />

      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={assets.workers}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-start justify-center px-8 md:px-16 text-left">
        <h1 className="text-3xl pt-14 md:pt-2 md:text-4xl font-bold leading-tight drop-shadow-lg text-white mb-4">
          Contactez A&M Gharred
        </h1>
        <p className="text-lg text-gray-200 max-w-xl">
          Prêt à démarrer votre projet ? Remplissez le formulaire ou
          contactez-nous directement.
        </p>
      </div>
    </div>
  );
};

export default ContactHeader;
