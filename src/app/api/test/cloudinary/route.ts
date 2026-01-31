import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  const res = await cloudinary.api.ping();
  return NextResponse.json(res);
}
