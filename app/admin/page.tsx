import { connectDB } from "@/lib/db"
import Booking from "@/models/Booking"
import Drone from "@/models/Drone"

export default async function AdminPage() {
  await connectDB()

  const bookings = await Booking.find().lean()

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking: any) => (
            <div
              key={booking._id}
              className="bg-gray-900 p-6 rounded-lg"
            >
              <p>
                Drone ID: {booking.droneId}
              </p>
              <p>
                From: {new Date(booking.startDate).toDateString()}
              </p>
              <p>
                To: {new Date(booking.endDate).toDateString()}
              </p>
              <p>
                Amount: ₹{booking.totalAmount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
