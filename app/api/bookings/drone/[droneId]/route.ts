import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"
import mongoose from "mongoose"

export async function GET(
  req: Request,
  context: { params: Promise<{ droneId: string }> }
) {

  await connectDB()

  const { droneId } = await context.params

  const bookings = await Booking.find({
    droneId: new mongoose.Types.ObjectId(droneId),
    status: "paid"
  }).select("startDate endDate")

  return NextResponse.json(bookings)

}