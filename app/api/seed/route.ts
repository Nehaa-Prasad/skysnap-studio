import { NextResponse } from "next/server"
import {connectDB} from "@/lib/db"
import Drone from "@/models/Drone"

export async function GET() {
  try {
    await connectDB()

    // Delete existing data (optional but clean)
    await Drone.deleteMany({})

    // Insert sample drones
    await Drone.insertMany([
      {
        name: "DJI Air 3S Fly More Combo",
        category: "Cinematic",
        pricePerDay: 2000,
        image: "/air3s.jpg",
        description: "High-end cinematic drone with dual camera system.",
      },
      {
        name: "DJI Flip",
        category: "Cinematic",
        pricePerDay: 1500,
        image: "/djiflip.jpg",
        description: "Compact cinematic drone perfect for travel shoots.",
      },
      {
        name: "FPV Racer Pro",
        category: "FPV",
        pricePerDay: 2500,
        image: "/fpv.jpg",
        description: "High-speed FPV drone built for action shots.",
      },
    ])

    return NextResponse.json({ message: "Seeded successfully 🚀" })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Seeding failed" })
  }
}
