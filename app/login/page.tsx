"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem("token", data.token)
      router.refresh()
      router.push("/")
    } else {
      alert(data.message)
    }
  }

  return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-96 space-y-4 border border-white/20 shadow-xl"
      >
        <h2 className="text-white text-xl mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-cyan-400 hover:bg-cyan-300 text-black py-3 rounded-lg font-semibold transition duration-300 shadow-lg"
        >
          Login
        </button>
      </form>
    </div>
  )
}