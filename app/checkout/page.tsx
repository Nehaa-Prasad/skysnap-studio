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

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [pickupTime, setPickupTime] = useState<Date | null>(null)
  const [dropTime, setDropTime] = useState<Date | null>(null)

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/login")
  }, [router])

  // 📦 Fetch drone
  useEffect(() => {
    if (droneId) {
      fetch(`/api/drones/${droneId}`)
        .then((res) => res.json())
        .then((data) => setDrone(data))
    }
  }, [droneId])

  // 🔥 IMPORTANT: Sync state with URL params
  useEffect(() => {
    const start = searchParams.get("start")
    const end = searchParams.get("end")
    const pickup = searchParams.get("pickup")
    const drop = searchParams.get("drop")

    // Reset first
    setStartDate(null)
    setEndDate(null)
    setPickupTime(null)
    setDropTime(null)

    // Then apply new values
    if (start) setStartDate(new Date(start))
    if (end) setEndDate(new Date(end))
    if (pickup) setPickupTime(new Date(pickup))
    if (drop) setDropTime(new Date(drop))

  }, [searchParams.toString()])   // 🔥 KEY FIX

  if (!drone) return <div className="pt-32 text-white">Loading...</div>

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    const diff = endDate.getTime() - startDate.getTime()
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
  }

  const days = calculateDays()
  const subtotal = drone.pricePerDay * days
  const gst = subtotal * 0.18
  const total = subtotal + gst

  const handleProceed = () => {
    if (!startDate || !endDate || !pickupTime || !dropTime) {
      alert("Please complete all booking details")
      return
    }

    router.push(
      `/checkout/summary?droneId=${droneId}&start=${startDate.toISOString()}&end=${endDate.toISOString()}&pickup=${pickupTime.toISOString()}&drop=${dropTime.toISOString()}&total=${total}`
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10">
      <div className="max-w-4xl mx-auto bg-neutral-900 p-10 rounded-xl shadow-lg">

        <div className="mb-8 bg-neutral-800 p-6 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Booking</p>
          <h2 className="text-2xl font-semibold mt-2">{drone.name}</h2>
          <p className="text-gray-400">₹{drone.pricePerDay} / day</p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="w-full bg-black border border-gray-600 p-2 text-white"
            />
          </div>

          <div>
            <label className="block mb-2">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              dateFormat="dd/MM/yyyy"
              className="w-full bg-black border border-gray-600 p-2 text-white"
            />
          </div>
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2">Pickup Time</label>
            <DatePicker
              selected={pickupTime}
              onChange={(date: Date | null) => setPickupTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              dateFormat="h:mm aa"
              className="w-full bg-black border border-gray-600 p-2 text-white"
            />
          </div>

          <div>
            <label className="block mb-2">Drop Time</label>
            <DatePicker
              selected={dropTime}
              onChange={(date: Date | null) => setDropTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              dateFormat="h:mm aa"
              className="w-full bg-black border border-gray-600 p-2 text-white"
            />
          </div>
        </div>

        {/* Pricing */}
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

        <button
          onClick={handleProceed}
          disabled={!days || !pickupTime || !dropTime}
          className="w-full mt-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 transition py-3 rounded-lg text-lg font-semibold"
        >
          Review Booking
        </button>

      </div>
    </div>
  )
}