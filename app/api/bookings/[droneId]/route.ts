import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"
import mongoose from "mongoose"

export async function GET(
  req: Request,
  context: { params: Promise<{ droneId: string }> }
) {
  try {
    await connectDB()

    // 🔥 IMPORTANT FIX
    const { droneId } = await context.params

    if (!mongoose.Types.ObjectId.isValid(droneId)) {
      return NextResponse.json([], { status: 200 })
    }

    const bookings = await Booking.find({
      droneId,
    })

    return NextResponse.json(bookings)

  } catch (error) {
    console.error(error)
    return NextResponse.json([], { status: 500 })
  }
}
