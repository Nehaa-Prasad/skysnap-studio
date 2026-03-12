import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  paymentId: {
  type: String
  },

  orderId: {
  type: String
  },

  refundAmount: {
  type: Number,
  default: 0
  },

  cancelledAt: {
    type: Date
  },

  droneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drone",
    required: true
  },

  startDate: Date,
  endDate: Date,

  pickupTime: Date,
  dropTime: Date,

  totalDays: Number,

  totalPrice: Number,

  status: {
    type: String,
    enum: ["active", "cancelled"],
    default: "active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

    extensions: [
    {
      newEndDate: Date,
      extensionDays: Number,
      extensionPrice: Number,
      penaltyApplied: Boolean,
      extendedAt: Date
    }
    ]

})

export default mongoose.models.Booking ||
mongoose.model("Booking", BookingSchema)