import { NextResponse } from "next/server";
import { hindsight } from "@/lib/hindsight/client";

export async function GET() {
  try {
    const status = await hindsight.checkConnection();
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        error: error.message,
        health: "disconnected",
        is_demo_mode: true,
      },
      { status: 500 }
    );
  }
}
