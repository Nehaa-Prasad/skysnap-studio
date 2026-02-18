import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"
import mongoose from "mongoose"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { droneId, startDate, endDate, totalAmount } =
      await req.json()

    if (
      !mongoose.Types.ObjectId.isValid(droneId) ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // 🔥 CHECK OVERLAPPING BOOKINGS
    const existingBooking = await Booking.findOne({
      droneId,
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start },
        },
      ],
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: "Drone already booked for these dates" },
        { status: 409 }
      )
    }

    const booking = await Booking.create({
      droneId,
      startDate: start,
      endDate: end,
      totalAmount,
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
