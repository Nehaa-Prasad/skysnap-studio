"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const droneId = searchParams.get("droneId")

  const [drone, setDrone] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [dropTime, setDropTime] = useState("")

  const [bookedDates, setBookedDates] = useState<any[]>([])

  const GST_PERCENT = 18

  // Fetch drone details
  useEffect(() => {
    if (!droneId) return

    const fetchDrone = async () => {
      const res = await fetch(`/api/drones/${droneId}`)
      const data = await res.json()
      setDrone(data)
      setLoading(false)
    }

    fetchDrone()
  }, [droneId])

  // Fetch existing bookings for overlap check
  useEffect(() => {
    if (!droneId) return

    const fetchBookings = async () => {
      const res = await fetch(`/api/bookings/${droneId}`)
      const data = await res.json()
      setBookedDates(data)
    }

    fetchBookings()
  }, [droneId])

  if (loading) {
    return <div className="p-10 text-white">Loading...</div>
  }

  if (!drone) {
    return <div className="p-10 text-white">Drone not found</div>
  }

  // Calculate rental days
  const days =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate).getTime() -
            new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0

  const subtotal = days > 0 ? days * drone.pricePerDay : 0
  const gstAmount = (subtotal * GST_PERCENT) / 100
  const totalAmount = subtotal + gstAmount

  const handleBooking = async () => {
    if (
      !startDate ||
      !endDate ||
      !pickupTime ||
      !dropTime ||
      days <= 0
    ) {
      alert("Please fill all fields correctly")
      return
    }

    // 🔥 Check overlapping bookings
    const overlapping = bookedDates.some((b: any) => {
      const existingStart = new Date(b.startDate)
      const existingEnd = new Date(b.endDate)

      return (
        new Date(startDate) <= existingEnd &&
        new Date(endDate) >= existingStart
      )
    })

    if (overlapping) {
      alert("These dates are already booked!")
      return
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          droneId,
          startDate,
          endDate,
          totalAmount,
        }),
      })

      if (!res.ok) {
        throw new Error("Booking failed")
      }

      router.push("/confirmation")
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div>
        <h2 className="text-xl font-semibold">{drone.name}</h2>
        <p className="text-gray-400">
          ₹{drone.pricePerDay} per day
        </p>
      </div>

      {/* Start Date */}
      <div>
        <label className="block mb-2">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-64 p-3 rounded-lg bg-white text-black"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block mb-2">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-64 p-3 rounded-lg bg-white text-black"
        />
      </div>

      {/* Pickup Time */}
      <div>
        <label className="block mb-2">Pickup Time</label>
        <input
          type="time"
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          className="w-64 p-3 rounded-lg bg-white text-black"
        />
      </div>

      {/* Drop Time */}
      <div>
        <label className="block mb-2">Drop Time</label>
        <input
          type="time"
          value={dropTime}
          onChange={(e) => setDropTime(e.target.value)}
          className="w-64 p-3 rounded-lg bg-white text-black"
        />
      </div>

      {/* Price Breakdown */}
      {days > 0 && (
        <div className="bg-gray-900 p-6 rounded-lg w-96 space-y-2">
          <p>Rental Days: {days}</p>
          <p>Subtotal: ₹{subtotal}</p>
          <p>GST ({GST_PERCENT}%): ₹{gstAmount}</p>
          <hr className="border-gray-700" />
          <p className="text-lg font-bold">
            Total Amount: ₹{totalAmount}
          </p>
        </div>
      )}

      <button
        onClick={handleBooking}
        className="bg-teal-500 px-8 py-3 rounded-full"
      >
        Confirm Booking
      </button>
    </div>
  )
}
