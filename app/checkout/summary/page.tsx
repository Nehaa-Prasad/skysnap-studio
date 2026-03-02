"use client"

import { useSearchParams, useRouter } from "next/navigation"

export default function SummaryPage() {
  const router = useRouter()
  const params = useSearchParams()

  const droneId = params.get("droneId")
  const start = params.get("start")
  const end = params.get("end")
  const pickup = params.get("pickup")
  const drop = params.get("drop")
  const total = params.get("total")

  // 📅 Format Date (DD/MM/YYYY)
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-GB")
  }

  // ⏰ Format Time (HH:MM AM/PM)
  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // 🔁 Edit Booking (preserve all values)
  const handleEdit = () => {
    const query = new URLSearchParams({
      droneId: droneId || "",
      start: start || "",
      end: end || "",
      pickup: pickup || "",
      drop: drop || "",
    }).toString()

    router.push(`/checkout?${query}`)
  }

  // 🧾 Create Booking Before Payment
  const handlePayment = async () => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          droneId,
          startDate: start,
          endDate: end,
          pickupTime: pickup,
          dropTime: drop,
          totalAmount: total,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const booking = await response.json()

      console.log("Booking created:", booking)

      alert("Booking created successfully! Next: Razorpay 🔥")

      // 🔥 Later:
      // Here we will trigger Razorpay
      // and update booking.status to "confirmed"

    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Something went wrong while creating booking.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10">
      <div className="max-w-3xl mx-auto bg-neutral-900 p-10 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold mb-8">Review Your Booking</h1>

        <div className="space-y-4 text-gray-300">

          <div className="flex justify-between">
            <span className="font-semibold">Start Date</span>
            <span>{formatDate(start)}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">End Date</span>
            <span>{formatDate(end)}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Pickup Time</span>
            <span>{formatTime(pickup)}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Drop Time</span>
            <span>{formatTime(drop)}</span>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex justify-between text-xl font-bold">
            <span>Total Amount</span>
            <span>₹{Number(total || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={handleEdit}
            className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition"
          >
            Edit Booking
          </button>

          <button
            onClick={handlePayment}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition"
          >
            Proceed to Payment
          </button>
        </div>

      </div>
    </div>
  )
}