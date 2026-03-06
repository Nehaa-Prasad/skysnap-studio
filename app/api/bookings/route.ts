import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      droneId,
      startDate,
      endDate,
      pickupTime,
      dropTime,
      totalAmount
    } = body

    await connectDB()

    const booking = await Booking.create({
      droneId,
      startDate,
      endDate,
      pickupTime,
      dropTime,
      totalAmount,
      status: "pending"
    })

    return NextResponse.json(booking)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Booking creation failed" },
      { status: 500 }
    )
  }
}