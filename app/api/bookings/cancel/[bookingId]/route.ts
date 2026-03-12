import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"
import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function POST(
  req: Request,
  { params }: { params: { bookingId: string } }
) {

  await connectDB()

  const { bookingId } = params

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return NextResponse.json(
      { error: "Invalid booking id" },
      { status: 400 }
    )
  }

  const booking = await Booking.findById(bookingId)

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    )
  }

  if (booking.status === "cancelled") {
    return NextResponse.json(
      { error: "Booking already cancelled" },
      { status: 400 }
    )
  }

  const now = new Date()
  const created = new Date(booking.createdAt)

  const diffHours =
    (now.getTime() - created.getTime()) / (1000 * 60 * 60)

  // declare refund properly so TypeScript knows its type
  let refund: number = 0

  // Refund rule (within 4 hours)
  if (diffHours <= 4) {

    refund = booking.totalPrice

    if (booking.paymentId) {
      try {

        await razorpay.payments.refund(booking.paymentId,{})

      } catch (err) {

        console.error("Razorpay refund failed:", err)

      }
    }
  }

  // update booking status
  booking.status = "cancelled"
  booking.cancelledAt = new Date()
  booking.refundAmount = refund

  await booking.save()

  return NextResponse.json({
    message: "Booking cancelled successfully",
    refundAmount: refund
  })
}