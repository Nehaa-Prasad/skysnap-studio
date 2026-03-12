"use client"

import { useEffect, useState } from "react"

export default function MyBookingsPage() {

  const [bookings, setBookings] = useState<any[]>([])
  const [extendDays, setExtendDays] = useState<{ [key: string]: number }>({})

  // Fetch bookings
  const fetchBookings = async () => {
    const res = await fetch("/api/bookings/user")
    const data = await res.json()
    setBookings(data)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Cancel booking
  const cancelBooking = async (bookingId: string) => {

    const confirmCancel = confirm("Are you sure you want to cancel this booking?")
    if (!confirmCancel) return

    const res = await fetch(`/api/bookings/cancel/${bookingId}`, {
      method: "POST"
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Failed to cancel booking")
      return
    }

    alert(`Booking cancelled. Refund: ₹${data.refund}`)

    setBookings(prev =>
      prev.map(b =>
        b._id === bookingId ? { ...b, status: "cancelled" } : b
      )
    )
  }

  // Extend booking
  const extendBooking = async (bookingId: string) => {

    const days = extendDays[bookingId] || 1

    const confirmExtend = confirm(`Extend booking by ${days} day(s)?`)
    if (!confirmExtend) return

    const res = await fetch("/api/bookings/extend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bookingId,
        extendDays: days
      })
    })

    const data = await res.json()

    if (!res.ok) {

      // If next user booked the drone
      if (data.error?.includes("reserved")) {
        alert("Cannot extend booking because the drone is reserved for another customer.")
      } else {
        alert(data.error || "Extension failed")
      }

      return
    }

    alert(`Booking extended successfully.\nExtra cost: ₹${data.extensionPrice}`)

    // refresh bookings
    fetchBookings()
  }

  return (

    <div className="min-h-screen bg-black text-white pt-32 px-10">

      <h1 className="text-3xl font-bold mb-10">My Bookings</h1>

      <div className="space-y-6">

        {bookings.map((b) => (

          <div
            key={b._id}
            className="bg-neutral-900 p-6 rounded-lg border border-gray-700"
          >

            <p className="text-lg font-semibold">
              Drone: {b.droneId?.name}
            </p>

            <p className="text-gray-400">
              Days: {b.totalDays}
            </p>

            <p className="text-gray-400">
              Total: ₹{b.totalPrice}
            </p>

            <p className="text-gray-400">
              Status: {b.status}
            </p>

            {b.status === "active" && (

              <div className="mt-4 space-y-3">

                {/* Cancel */}

                <button
                  onClick={() => cancelBooking(b._id)}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancel Booking
                </button>

                {/* Extend */}

                <div className="flex items-center gap-3">

                  <select
                    className="bg-neutral-800 px-3 py-2 rounded"
                    value={extendDays[b._id] || 1}
                    onChange={(e) =>
                      setExtendDays(prev => ({
                        ...prev,
                        [b._id]: Number(e.target.value)
                      }))
                    }
                  >
                    <option value={1}>Extend 1 Day</option>
                    <option value={2}>Extend 2 Days</option>
                    <option value={3}>Extend 3 Days</option>
                  </select>

                  <button
                    onClick={() => extendBooking(b._id)}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Extend Booking
                  </button>

                </div>

                <p className="text-xs text-gray-500">
                  Extension will fail if another customer already booked the drone for the next day.
                </p>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  )
}