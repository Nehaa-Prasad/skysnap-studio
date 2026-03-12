import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"
import Drone from "@/models/Drone"

export async function POST(req: Request) {
  await connectDB()

  const { bookingId, extendDays } = await req.json()

  const booking = await Booking.findById(bookingId)

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  if (booking.status !== "booked") {
    return NextResponse.json({ error: "Booking not active" }, { status: 400 })
  }

  const drone = await Drone.findById(booking.droneId)

  if (!drone) {
    return NextResponse.json({ error: "Drone not found" }, { status: 404 })
  }

  const now = new Date()
  const endTime = new Date(booking.endDate)

  const hoursRemaining =
    (endTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  let penalty = 0
  let penaltyApplied = false

  if (hoursRemaining < 12) {
    penalty = 500
    penaltyApplied = true
  }

  const extensionPrice = extendDays * drone.pricePerDay + penalty

  const newEndDate = new Date(
    endTime.getTime() + extendDays * 24 * 60 * 60 * 1000
  )

  booking.endDate = newEndDate
  booking.totalPrice += extensionPrice

  booking.extensions.push({
    newEndDate,
    extensionDays: extendDays,
    extensionPrice,
    penaltyApplied,
    extendedAt: new Date(),
  })

  await booking.save()

  return NextResponse.json({
    message: "Booking extended successfully",
    newEndDate,
    extensionPrice,
    penaltyApplied,
  })
}