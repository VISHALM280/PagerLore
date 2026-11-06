import { NextRequest, NextResponse } from "next/server";
import { hindsight } from "@/lib/hindsight/client";
import { HindsightRecallRequest } from "@/lib/hindsight/types";

export async function POST(req: NextRequest) {
  try {
    const body: HindsightRecallRequest = await req.json();

    if (!body.query || body.query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query is required for Hindsight recall" },
        { status: 400 }
      );
    }

    const result = await hindsight.recall(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Recall error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
