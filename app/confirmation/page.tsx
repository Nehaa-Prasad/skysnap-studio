"use client"

import { useSearchParams, useRouter } from "next/navigation"

export default function ConfirmationPage() {

  const params = useSearchParams()
  const router = useRouter()

  const drone = params.get("drone")
  const start = params.get("start")
  const end = params.get("end")
  const pickup = params.get("pickup")
  const drop = params.get("drop")
  const total = params.get("total")

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-GB")
  }

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  }

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="max-w-xl w-full bg-neutral-900 p-10 rounded-xl shadow-lg text-center">

        <h1 className="text-3xl font-bold text-green-400 mb-6">
          Booking Confirmed 🎉
        </h1>

        <p className="text-gray-400 mb-8">
          Your drone booking has been successfully confirmed.
        </p>

        <div className="text-left space-y-4 text-gray-300">

          <div className="flex justify-between">
            <span>Drone ID</span>
            <span>{drone}</span>
          </div>

          <div className="flex justify-between">
            <span>Start Date</span>
            <span>{formatDate(start)}</span>
          </div>

          <div className="flex justify-between">
            <span>End Date</span>
            <span>{formatDate(end)}</span>
          </div>

          <div className="flex justify-between">
            <span>Pickup Time</span>
            <span>{formatTime(pickup)}</span>
          </div>

          <div className="flex justify-between">
            <span>Drop Time</span>
            <span>{formatTime(drop)}</span>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">

          <div className="flex justify-between text-xl font-bold">
            <span>Total Paid</span>
            <span>₹{Number(total || 0).toFixed(2)}</span>
          </div>

        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold"
        >
          Back to Home
        </button>

      </div>

    </div>
  )
}