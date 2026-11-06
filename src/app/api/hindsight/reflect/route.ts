import { NextRequest, NextResponse } from "next/server";
import { hindsight } from "@/lib/hindsight/client";
import { HindsightReflectRequest } from "@/lib/hindsight/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body: HindsightReflectRequest = await req.json();
    const query = body.query || "What are the common recurring failure patterns and timeout asymmetries across all services?";

    const result = await hindsight.reflect({
      query,
      budget: body.budget || "high",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Reflect error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

