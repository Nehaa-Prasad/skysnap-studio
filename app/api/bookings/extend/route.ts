import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"
import Drone from "@/models/Drone"

export async function POST(req: Request) {

  await connectDB()

  const { bookingId, extendDays } = await req.json()

  const booking = await Booking.findById(bookingId)

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    )
  }

  if (booking.status !== "active") {
    return NextResponse.json(
      { error: "Booking is not active" },
      { status: 400 }
    )
  }

  const now = new Date()
  const endDate = new Date(booking.endDate)

  // ❌ Prevent extension if booking already ended
  if (now > endDate) {
    return NextResponse.json(
      { error: "Booking already ended. Extension not allowed." },
      { status: 400 }
    )
  }

  const drone = await Drone.findById(booking.droneId)

  if (!drone) {
    return NextResponse.json(
      { error: "Drone not found" },
      { status: 404 }
    )
  }

  const newEndDate = new Date(
    endDate.getTime() + extendDays * 24 * 60 * 60 * 1000
  )

  // 🚫 Check if another booking exists in extension period
  const conflict = await Booking.findOne({
    droneId: booking.droneId,
    status: "active",
    _id: { $ne: booking._id },
    startDate: { $lte: newEndDate },
    endDate: { $gte: endDate }
  })

  if (conflict) {
    return NextResponse.json(
      { error: "Cannot extend. Drone reserved for another booking." },
      { status: 400 }
    )
  }

  // ⏳ Check remaining hours for penalty
  const hoursRemaining =
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  let penalty = 0
  let penaltyApplied = false

  if (hoursRemaining < 12) {
    penalty = 500
    penaltyApplied = true
  }

  const extensionPrice = extendDays * drone.pricePerDay + penalty

  booking.endDate = newEndDate
  booking.totalDays += extendDays
  booking.totalPrice += extensionPrice

  booking.extensions.push({
    newEndDate,
    extensionDays: extendDays,
    extensionPrice,
    penaltyApplied,
    extendedAt: new Date()
  })

  await booking.save()

  return NextResponse.json({
    message: "Booking extended successfully",
    newEndDate,
    extensionPrice,
    penaltyApplied
  })
}