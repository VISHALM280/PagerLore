import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let preserveRetainedMemories = true;
    try {
      const body = await req.json();
      if (typeof body.preserveRetainedMemories === "boolean") {
        preserveRetainedMemories = body.preserveRetainedMemories;
      }
    } catch {
      // no JSON body provided, default to preserving retained memories
    }

    const res = DataStore.resetDemo({ preserveRetainedMemories });
    return NextResponse.json({
      success: true,
      message: preserveRetainedMemories
        ? "PagerLore demo environment reset: incidents reset to un-mitigated state while preserving newly retained Hindsight memories."
        : "PagerLore demo environment hard-reset: all incidents and memories restored to factory seed state.",
      ...res,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
