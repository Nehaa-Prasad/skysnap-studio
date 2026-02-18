import { NextResponse } from "next/server"
import mongoose from "mongoose"
import {connectDB} from "@/lib/db"
import Drone from "@/models/Drone"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await context.params   // ✅ IMPORTANT FIX

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      )
    }

    const drone = await Drone.findById(id)

    if (!drone) {
      return NextResponse.json(
        { error: "Drone not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(drone)

  } catch (error) {
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    )
  }
}
