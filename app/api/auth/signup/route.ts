import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import User from "@/models/User.model";

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    await connectToDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const newUser = new User({ email, password, username  });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Error signing up" }, { status: 500 });
  }
}
