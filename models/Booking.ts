import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
  {
    droneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drone",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema)
