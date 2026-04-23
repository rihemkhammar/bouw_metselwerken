import Navbar from "../../../components/layout/Navbar";
import { assets } from "../../../assets/assets";

const Header = () => {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden" id="Header">
      <Navbar />

      {/* VIDEO BACKGROUND */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={assets.workers}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* MOBILE FALLBACK IMAGE */}
      <img
        src={assets.header_img}
        alt="Construction"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* HERO CONTENT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
          Construire l’Avenir,
          <br /> Un Projet à la Fois
        </h1>

        <p className="text-white text-lg md:text-2xl mt-4 max-w-2xl drop-shadow-md">
          Des solutions de construction fiables, durables et réalisées avec un
          savoir‑faire d’excellence.
        </p>

         <div className="flex flex-col md:flex-row gap-4 mt-8  max-w-xs md:max-w-none">
          
          {/* Login Button */}
          <a
            href="/login"
            className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full text-lg hover:bg-[#0073CF] hover:text-white transition shadow-lg"
          >
            Se Connecter
          </a>

          {/* Sign Up Button (Client Only) */}
          <a
            href="/signup"
            className="bg-[#f16c13] text-white font-semibold px-6 py-3 rounded-full text-lg hover:opacity-90 transition"
          >
            Demander un Compte
          </a>
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
