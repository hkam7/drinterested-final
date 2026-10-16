import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Supabase relay endpoint removed for this project. This endpoint is no longer available." },
    { status: 410 }
  )
}
