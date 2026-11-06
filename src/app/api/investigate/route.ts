import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data/store";
import { runInvestigation } from "@/lib/investigation/engine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { incidentId, mode } = await req.json();

    if (!incidentId) {
      return NextResponse.json({ error: "incidentId is required" }, { status: 400 });
    }

    const incident = DataStore.getIncidentById(incidentId);
    if (!incident) {
      return NextResponse.json({ error: `Incident ${incidentId} not found` }, { status: 404 });
    }

    const investigationMode = mode === "without_memory" ? "without_memory" : "with_memory";
    const result = await runInvestigation(incident, investigationMode);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Investigation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

