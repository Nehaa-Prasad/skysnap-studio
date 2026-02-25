import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black" />
      <div className="absolute w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[180px] top-[-200px] left-[-200px]" />
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] bottom-[-200px] right-[-150px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
          SkySnap Studio
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Elevate your vision. Capture cinematic moments with premium drone
          rentals crafted for creators, filmmakers and visionaries.
        </p>

        <Link
          href="/drones"
          className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-semibold text-lg hover:scale-105 transition duration-300 shadow-2xl shadow-teal-500/40"
        >
          Explore Drones
        </Link>

      </div>
    </div>
  )
}