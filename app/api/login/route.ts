import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    const token = jwt.sign(
  {
    userId: user._id,
    role: user.role
  },
  process.env.JWT_SECRET as string,
  { expiresIn: "7d" }
)

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}