import { connectDB } from "@/lib/db"
import Drone from "@/models/Drone"
import AuthGuard from "@/components/AuthGuard"
import Link from "next/link"

export default async function DronesPage() {
  await connectDB()

  const drones = await Drone.find()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white p-10 pt-32">
        <h1 className="text-3xl font-bold mb-8">Available Drones</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drones.map((drone: any) => (
            <Link key={drone._id} href={`/drones/${drone._id}`}>
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:bg-gray-800 cursor-pointer transition">
                <h2 className="text-xl font-semibold">{drone.name}</h2>
                <p className="text-gray-400 mt-2">{drone.category}</p>
                <p className="mt-2">₹ {drone.pricePerDay} / day</p>
                <p className="text-sm text-gray-500 mt-3">
                  {drone.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AuthGuard>
  )
}