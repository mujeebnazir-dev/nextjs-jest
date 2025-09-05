import { NextResponse } from "next/server";
import User from "@/models/User.model";
import connectToDB from "@/lib/db";
import jwt from "jsonwebtoken";


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectToDB();

    const user = await User.findOne({ email, password }).select("-password");
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }


    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email }, // payload
      process.env.JWT_SECRET!,             // secret key
      { expiresIn: "1h" }                  // options
    );

    return NextResponse.json(
      { message: "Login successful", data: user, token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  }
}
