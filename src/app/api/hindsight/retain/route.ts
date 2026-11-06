import { NextRequest, NextResponse } from "next/server";
import { hindsight } from "@/lib/hindsight/client";
import { DataStore } from "@/lib/data/store";
import { HindsightRetainRequest } from "@/lib/hindsight/types";

export async function POST(req: NextRequest) {
  try {
    const body: HindsightRetainRequest = await req.json();

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required for Hindsight retention" },
        { status: 400 }
      );
    }

    const result = await hindsight.retain(body);

    // If an incidentId is attached, update incident's postmortem retention status
    if (body.metadata?.incidentId) {
      const inc = DataStore.getIncidentById(body.metadata.incidentId);
      if (inc && inc.postmortem) {
        inc.postmortem.hindsight_retained = true;
        inc.postmortem.hindsight_memory_id = result.memory_id;
        DataStore.updateIncident(inc.id, { postmortem: inc.postmortem });
      }
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Retain error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
