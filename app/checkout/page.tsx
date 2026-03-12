"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function CheckoutPage() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const droneId = searchParams.get("droneId")

  const [drone, setDrone] = useState<any>(null)

  const [pickupDate, setPickupDate] = useState<Date | null>(null)
  const [pickupTime, setPickupTime] = useState<Date | null>(null)

  const [days, setDays] = useState<number>(1)

  const [dropDate, setDropDate] = useState<Date | null>(null)
  const [dropTime, setDropTime] = useState<Date | null>(null)

  const [blockedDates, setBlockedDates] = useState<any[]>([])

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/login")
  }, [router])

  // 📦 Fetch drone
  useEffect(() => {

    if (!droneId) return

    fetch(`/api/drones/${droneId}`)
      .then(res => res.json())
      .then(data => setDrone(data))

  }, [droneId])

  // 📅 Fetch blocked booking dates
  useEffect(() => {

    if (!droneId) return

    fetch(`/api/bookings/drone/${droneId}`)
      .then(res => res.json())
      .then(data => {

        const intervals = data.map((b: any) => ({
          start: new Date(b.startDate),
          end: new Date(b.endDate)
        }))

        setBlockedDates(intervals)

      })

  }, [droneId])

  // ⏱ Auto calculate drop date/time
  useEffect(() => {

    if (!pickupDate || !pickupTime) return

    const start = new Date(pickupDate)

    start.setHours(
      pickupTime.getHours(),
      pickupTime.getMinutes(),
      0,
      0
    )

    const drop = new Date(start)
    drop.setHours(drop.getHours() + days * 24)

    setDropDate(new Date(drop))
    setDropTime(new Date(drop))

  }, [pickupDate, pickupTime, days])


  // 💰 Pricing
  const subtotal = drone ? drone.pricePerDay * days : 0
  const gst = subtotal * 0.18
  const total = subtotal + gst


  // 🚀 Proceed
  const handleProceed = () => {

    if (!pickupDate || !pickupTime) {
      alert("Please select pickup date and time")
      return
    }

    if (days < 1) {
      alert("Minimum booking is 1 day")
      return
    }

    router.push(
`/checkout/summary?droneId=${droneId}
&start=${pickupDate.toISOString()}
&pickup=${pickupTime.toISOString()}
&days=${days}
&drop=${dropDate?.toISOString()}
&total=${total}`
)
  }


  // 🔒 Loading check
  if (!drone) return <div className="pt-32 text-white">Loading...</div>


  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10">

      <div className="max-w-4xl mx-auto bg-neutral-900 p-10 rounded-xl shadow-lg">

        {/* Drone Info */}
        <div className="mb-8 bg-neutral-800 p-6 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Booking</p>
          <h2 className="text-2xl font-semibold mt-2">{drone.name}</h2>
          <p className="text-gray-400">₹{drone.pricePerDay} / day</p>
        </div>


        {/* PICKUP DATE */}
        <div className="mb-6">

          <label className="block mb-2">Pickup Date</label>

          <DatePicker
            selected={pickupDate}
            onChange={(date: Date | null) => setPickupDate(date)}
            minDate={new Date()}
            excludeDateIntervals={blockedDates}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select pickup date"
            className="w-full bg-black border border-gray-600 p-2 text-white"
          />

          {/* Calendar legend */}
          <p className="text-xs text-gray-400 mt-2">
            Dates already booked are <span className="text-red-400">disabled</span>.
          </p>

        </div>


        {/* PICKUP TIME */}
        <div className="mb-6">

          <label className="block mb-2">Pickup Time</label>

          <DatePicker
            selected={pickupTime}
            onChange={(date: Date | null) => setPickupTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={5}
            minTime={new Date(0, 0, 0, 8, 0)}
            maxTime={new Date(0, 0, 0, 20, 0)}
            dateFormat="h:mm aa"
            className="w-full bg-black border border-gray-600 p-2 text-white"
          />

          <p className="text-sm text-gray-400 mt-2">
            Pickup allowed between <b>8:00 AM and 8:00 PM</b>.
          </p>

        </div>


        {/* NUMBER OF DAYS */}
        <div className="mb-6">

          <label className="block mb-2">Number of Days</label>

          <input
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full bg-black border border-gray-600 p-2 text-white"
          />

        </div>


        {/* AUTO DROP TIME */}
        <div className="mb-6">

          <label className="block mb-2">Drop Time (Auto Calculated)</label>

          <div className="bg-black border border-gray-600 p-3 text-gray-300">

            {dropDate
              ? `${dropDate.toLocaleDateString()} — ${dropDate.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}`
              : "Select pickup date and time"}

          </div>

        </div>


        {/* RULE */}
        <p className="text-sm text-gray-400 mb-6">
          Minimum booking is <b>24 hours</b>. Returning even a few minutes late will count as an extra day.
        </p>


        {/* PRICE */}
        <div className="border-t border-gray-700 pt-6">

          <div className="flex justify-between mb-2">
            <span>Total Days</span>
            <span>{days}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>GST (18%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-xl font-bold mt-4">
            <span>Grand Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

        </div>


        {/* BUTTON */}
        <button
          onClick={handleProceed}
          disabled={!pickupDate || !pickupTime}
          className="w-full mt-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 transition py-3 rounded-lg text-lg font-semibold"
        >
          Review Booking
        </button>

      </div>

    </div>
  )
}