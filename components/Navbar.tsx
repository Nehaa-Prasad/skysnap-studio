"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

useEffect(() => {

  const token = localStorage.getItem("token")

  if (!token) {
    setIsLoggedIn(false)
    setIsAdmin(false)
    return
  }

  try {

    const payload = JSON.parse(atob(token.split(".")[1]))

    setIsLoggedIn(true)

    if (payload.role === "admin") {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }

  } catch {
    setIsLoggedIn(false)
    setIsAdmin(false)
  }

}, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    router.push("/")
  }

  const linkStyle = (path: string) =>
    `relative text-sm tracking-widest transition duration-300 ${
      pathname === path
        ? "text-white"
        : "text-gray-400 hover:text-white"
    }`

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-10 py-6 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/drone_web_logo.png"
            alt="SkySnap Studio Logo"
            width={60}
            height={60}
            className="h-16 w-auto opacity-90 hover:opacity-100 transition duration-300"
          />
          <span className="text-lg tracking-[0.35em] font-semibold text-white">
            SKYSNAP STUDIO
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-12">

          <Link href="/about" className={linkStyle("/about")}>
            ABOUT
          </Link>

          <Link href="/policies" className={linkStyle("/policies")}>
            POLICIES
          </Link>

          {isAdmin && (
            <Link href="/admin/bookings">
              ADMIN
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link href="/login" className={linkStyle("/login")}>
                LOGIN
              </Link>

              <Link
                href="/signup"
                className="px-6 py-2 border border-white/20 rounded-full text-white text-sm tracking-widest hover:bg-white hover:text-black transition duration-300"
              >
                SIGN UP
              </Link>
            </>
          ) : (
            <>
              <Link href="/checkout" className={linkStyle("/checkout")}>
                CHECKOUT
              </Link>

              <button
                onClick={handleLogout}
                className="px-6 py-2 border border-red-500/40 rounded-full text-red-400 text-sm tracking-widest hover:bg-red-500 hover:text-white transition duration-300"
              >
                LOGOUT
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  )
}