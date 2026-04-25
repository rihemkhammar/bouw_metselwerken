import Navbar from "../../../components/layout/Navbar";
import { assets } from "../../../assets/assets";

const Header = () => {
  return (
    <div className="relative h-[55vh] md:h-screen w-full overflow-hidden" id="Header">
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
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full pt-40 md:pt-0 px-6 md:pl-20 md:pr-0 ">
        {/* LEFT: Hero Text */}
        <div className="text-white max-w-xl md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
            Construire l’Avenir,
            <br /> Un Projet à la Fois
          </h1>
          <p className="text-lg md:text-2xl mt-4 drop-shadow-md">
            Des solutions de construction fiables, durables et réalisées avec un
            savoir‑faire d’excellence.
          </p>
          <div className="flex gap-4 mt-8 justify-center md:justify-start">
            <a
              href="/login"
              className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full text-lg hover:bg-[#0073CF] hover:text-white transition shadow-lg"
            >
              Se Connecter
            </a>
          </div>
        </div>

        {/* RIGHT: Contact Form */}
        <div className="hidden md:flex h-full items-center">
        <div className="pt-10  md:pt-10 md:self-start">
        <div className=" bg-white/70 h-screen  md:p-10  md:w-[380px] md:pt-40 rounded-l-lg md:rounded-r-none shadow-xl gap-4 ">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Démarrons Votre Projet
          </h2>
          <form className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Nom"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-[#0073CF] transition"
            />
            <input
              type="text"
              placeholder="Téléphone"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-[#0073CF] transition"
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-[#0073CF] transition"
            />
            <select className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-[#0073CF] transition">
              <option value="">Service souhaité</option>
              <option value="Kitchens">Maçonnerie</option>
              <option value="Bathrooms">Rénovation</option>
              <option value="Addition">Restauration</option>
              <option value="Concrete">Travaux de construction générale</option>
              <option value="Concrete">Rejointoiement rustique</option>
              <option value="Concrete">Traitement hydrofuge</option>
              <option value="Concrete">Démoussage</option> 
              <option value="Other">Autre service</option>
            </select>
            <textarea
              placeholder="Message"
              className="border p-3 rounded h-24 focus:outline-none focus:ring-2 focus:ring-[#0073CF] focus:border-[#0073CF] transition"
            ></textarea>
            <button
              type="submit"
              className="bg-[#f16c13] text-white font-semibold px-5 py-2 rounded-full hover:opacity-90 transition"
            >
              Envoyer
            </button>
          </form>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
// import { useEffect, useState } from "react"
// import { assets } from '../../../assets/assets'
// import Navbar from '../../../components/layout/Navbar'

// const images = [
//   assets.header_img,
//   assets.interiorHouse,
//   assets.restaurantInterior,
// ]

// const Header = () => {
//   const [index, setIndex] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % images.length)
//     }, 4000)

//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <div className="h-screen relative overflow-hidden w-full" id="Header">

//       <Navbar />

//       {images.map((img, i) => (
//         <img
//           key={i}
//           src={img}
//           className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
//             i === index ? "opacity-100" : "opacity-0"
//           }`}
//         />
//       ))}

//       <div className="absolute inset-0 bg-black/30" />
//     </div>
//   )
// }

// export default Header
