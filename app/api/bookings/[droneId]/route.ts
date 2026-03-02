import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"

export async function GET(
  req: Request,
  { params }: { params: { droneId: string } }
) {
  await connectDB()

  const bookings = await Booking.find({
    droneId: params.droneId,
  })

  return NextResponse.json(bookings)
}