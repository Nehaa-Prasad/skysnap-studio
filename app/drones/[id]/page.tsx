import { connectDB } from "@/lib/db"
import Drone from "@/models/Drone"
import mongoose from "mongoose"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function DroneDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await connectDB()

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFound()
  }

  const drone = await Drone.findOne({
    _id: new mongoose.Types.ObjectId(id),
  }).lean()

  if (!drone) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">
        {drone.name}
      </h1>

      <p className="text-lg text-gray-400 mb-10">
        ₹{drone.pricePerDay} per day
      </p>

      <Link href={`/checkout?droneId=${drone._id}`}>
        <button className="bg-teal-500 px-8 py-3 rounded-full">
          Continue to Booking
        </button>
      </Link>
    </div>
  )
}
