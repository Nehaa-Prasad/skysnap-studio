import { connectDB } from "@/lib/db"

export default async function Home() {
  try {
    await connectDB()
    console.log("✅ MongoDB Connected")
  } catch (error) {
    console.log("❌ MongoDB Connection Failed", error)
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold">
        SkySnap Studio
      </h1>
      <p className="mt-4 text-gray-400">
        Checking MongoDB connection...
      </p>
    </main>
  )
}
