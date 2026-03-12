import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"
import Drone from "@/models/Drone"

export async function POST(req: Request) {

  await connectDB()

  try {

    const body = await req.json()

    const { userId, droneId, startDate, endDate } = body

    if (!droneId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing booking details" },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // 🚫 CHECK FOR OVERLAPPING BOOKINGS
    const conflict = await Booking.findOne({
      droneId,
      status: "active",
      startDate: { $lte: end },
      endDate: { $gte: start }
    })

    if (conflict) {
      return NextResponse.json(
        { error: "Drone already booked for selected dates" },
        { status: 400 }
      )
    }

    const drone = await Drone.findById(droneId)

    if (!drone) {
      return NextResponse.json(
        { error: "Drone not found" },
        { status: 404 }
      )
    }

    const totalDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    const totalPrice = totalDays * drone.pricePerDay

    const booking = await Booking.create({
      userId,
      droneId,
      startDate: start,
      endDate: end,
      totalDays,
      totalPrice,
      status: "active"
    })

    return NextResponse.json(booking)

  } catch (error) {

    console.error("Booking error:", error)

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}