import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"
import Drone from "@/models/Drone"

export async function GET() {

  await connectDB()

  const bookings = await Booking.find().sort({ createdAt: -1 })

  const data = await Promise.all(
    bookings.map(async (b: any) => {

      const drone = await Drone.findById(b.droneId)

      return {
        _id: b._id,
        drone: drone?.name || "Unknown Drone",
        startDate: b.startDate,
        endDate: b.endDate,
        amount: b.totalAmount,
        status: b.status
      }

    })
  )

  return NextResponse.json(data)
}