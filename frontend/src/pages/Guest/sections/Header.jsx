import Navbar from "../../../components/layout/Navbar"
import { assets } from "../../../assets/assets"

const Header = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden" id="Header">

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
         


    </div>
  )
}

export default Header
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
