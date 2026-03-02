import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"

export async function POST(req: Request) {
  await connectDB()

  const body = await req.json()

  const {
    droneId,
    startDate,
    endDate,
    pickupTime,
    dropTime,
    totalAmount,
  } = body

  const newBooking = await Booking.create({
    droneId,
    startDate,
    endDate,
    pickupTime,
    dropTime,
    totalAmount,
    status: "pending",
  })

  return NextResponse.json(newBooking)
}