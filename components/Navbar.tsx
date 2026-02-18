export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-black text-white">
      
      {/* Logo */}
      <div className="text-xl font-semibold tracking-wide">
        SkySnap Studio
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-8 text-sm">
        <a href="#" className="hover:text-gray-400 transition">Drones</a>
        <a href="#" className="hover:text-gray-400 transition">Pricing</a>
        <a href="#" className="hover:text-gray-400 transition">About</a>
        <a href="#" className="hover:text-gray-400 transition">Contact</a>
      </div>

      {/* CTA Button */}
      <button className="bg-teal-500 hover:bg-teal-600 px-5 py-2 rounded-full text-sm font-medium transition">
        Rent a Drone
      </button>
    </nav>
  )
}
