import { useEffect, useState } from "react"
import { assets } from '../../../assets/assets'
import Navbar from '../../../components/layout/Navbar'

const images = [
  assets.header_img,
  assets.interiorHouse,
  assets.restaurantInterior,
]

const Header = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-screen relative overflow-hidden w-full" id="Header">

      <Navbar />

      {/* SLIDES */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* optional dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

    </div>
  )
}

export default Header