import { assets } from '../../assets/assets'
import { Phone } from "lucide-react"

const Navbar = () => { 

  return (
<div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-20 py-4">

    {/* LEFT: LOGO */}
    <div className="flex items-center">
      <img 
        src={assets.logo} 
        alt="Logo" 
        className="h-[70px] md:h-[55px] w-auto object-contain"
      />
    </div>

    {/* CENTER: MENU */}
    <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
<a href="#Header" className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all">
  Home
</a>

<a href="#About" className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all">
  About
</a>

<a href="#Projects" className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all">
  Services
</a>

<a href="#Testimonials" className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all">
  Work Gallery
</a>
<a href="#Testimonials" className="relative text-gray-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0073CF] hover:after:w-full after:transition-all">
  Contact
</a>

    </ul>

    {/* RIGHT: CTA */}
    <div className="hidden md:flex items-center gap-4">
     <a href="tel:+19164120162" className="text-gray-700 font-medium flex items-center gap-2 hover:text-[#0073CF]">
  <Phone size={18} />
  (916) 412-0162
</a>

      <a 
        href="#contact" 
        className="bg-[#f16c13] text-white 	font-bold px-5 py-2 rounded-full hover:opacity-90"
      >
        Get Started Today
      </a>
    </div>

  </div>
</div>

  )
}


export default Navbar
