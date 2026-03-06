"use client"

import { useEffect, useState } from "react"

export default function AdminBookings() {

  const [bookings, setBookings] = useState<any[]>([])
  const [revenue, setRevenue] = useState(0)

  useEffect(() => {

    fetch("/api/admin/bookings")
      .then(res => res.json())
      .then(data => {

        setBookings(data)

        const total = data.reduce(
          (sum: number, b: any) => sum + Number(b.amount || 0),
          0
        )

        setRevenue(total)

      })

  }, [])

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-10">

          <div className="bg-neutral-900 p-6 rounded-xl">
            <p className="text-gray-400">Total Bookings</p>
            <h2 className="text-3xl font-bold mt-2">
              {bookings.length}
            </h2>
          </div>

          <div className="bg-neutral-900 p-6 rounded-xl">
            <p className="text-gray-400">Total Revenue</p>
            <h2 className="text-3xl font-bold mt-2">
              ₹{revenue}
            </h2>
          </div>

        </div>

        {/* Table */}
        <div className="bg-neutral-900 rounded-xl overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-neutral-800 text-gray-300">
              <tr>
                <th className="p-4">Drone</th>
                <th className="p-4">Start</th>
                <th className="p-4">End</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>

              {bookings.map((b) => (

                <tr
                  key={b._id}
                  className="border-t border-gray-700"
                >

                  <td className="p-4">{b.drone}</td>

                  <td className="p-4">
                    {new Date(b.startDate).toLocaleDateString("en-GB")}
                  </td>

                  <td className="p-4">
                    {new Date(b.endDate).toLocaleDateString("en-GB")}
                  </td>

                  <td className="p-4">
                    ₹{b.amount}
                  </td>

                  <td className="p-4">

                    {b.status === "paid" ? (
                      <span className="text-green-400">
                        Paid
                      </span>
                    ) : (
                      <span className="text-yellow-400">
                        Pending
                      </span>
                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}