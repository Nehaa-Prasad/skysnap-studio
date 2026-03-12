"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SummaryPage() {

  const router = useRouter()
  const params = useSearchParams()

  const droneId = params.get("droneId")
  const start = params.get("start")
  const drop = params.get("drop")
  const pickup = params.get("pickup")
  const total = params.get("total")

  const end = drop

  const [droneName, setDroneName] = useState("")

  useEffect(() => {
    if (!droneId) return

    fetch(`/api/drones/${droneId}`)
      .then(res => res.json())
      .then(data => setDroneName(data.name))
  }, [droneId])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-GB")
  }

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  }

  const handleEdit = () => {
    const query = new URLSearchParams({
      droneId: droneId || "",
      start: start || "",
      drop: drop || "",
      pickup: pickup || ""
    }).toString()

    router.push(`/checkout?${query}`)
  }

  const handlePayment = async () => {

    try {

      const userId = localStorage.getItem("userId")

      if (!userId) {
        alert("Please login again")
        router.push("/login")
        return
      }

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          droneId,
          startDate: start,
          endDate: end
        })
      })

      const bookingData = await bookingRes.json()

      if (!bookingRes.ok) {
        alert(bookingData.error || "Failed to create booking")
        return
      }

      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: total
        })
      })

      const order = await orderRes.json()

      if (!orderRes.ok) {
        alert("Failed to create payment order")
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "SkySnap Studio",
        description: "Drone Rental Booking",
        order_id: order.id,

        handler: async function (response: any) {

          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...response,
              bookingId: bookingData._id
            })
          })

          const result = await verifyRes.json()

          if (result.success) {
            router.push(
              `/confirmation?drone=${droneName}&start=${start}&end=${end}&pickup=${pickup}&drop=${drop}&total=${total}`
            )
          } else {
            alert("Payment verification failed")
          }

        },

        theme: {
          color: "#ef4444"
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()

    } catch (err) {
      console.error(err)
      alert("Payment failed")
    }

  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10">

      <div className="max-w-3xl mx-auto bg-neutral-900 p-10 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold mb-8">Review Your Booking</h1>

        <div className="space-y-4 text-gray-300">

          <div className="flex justify-between">
            <span className="font-semibold">Drone</span>
            <span>{droneName || "Loading..."}</span>
          </div>

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