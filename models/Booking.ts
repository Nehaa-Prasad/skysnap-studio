import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema(
  {
    droneId: String,
    startDate: Date,
    endDate: Date,
    pickupTime: Date,
    dropTime: Date,
    totalAmount: Number,
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  { timestamps: true }
)

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema)