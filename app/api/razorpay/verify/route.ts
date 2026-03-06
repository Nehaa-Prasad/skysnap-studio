import { NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"

export async function POST(req: Request) {

  const body = await req.json()

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId
  } = body

  const secret = process.env.RAZORPAY_KEY_SECRET!

  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex")

  if (generated_signature !== razorpay_signature) {
    return NextResponse.json({ success: false })
  }

  await connectDB()

  await Booking.findByIdAndUpdate(bookingId, {
    status: "paid",
    paymentId: razorpay_payment_id
  })

  return NextResponse.json({ success: true })
}