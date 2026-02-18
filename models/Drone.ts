import mongoose, { Schema, models } from "mongoose"

const DroneSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // Cinematic / FPV
    pricePerDay: { type: Number, required: true },
    image: { type: String },
    description: { type: String },
  },
  { timestamps: true }
)

const Drone = models.Drone || mongoose.model("Drone", DroneSchema)

export default Drone
