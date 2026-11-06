import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const incident = DataStore.getIncidentById(params.id);
  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }
  return NextResponse.json(incident);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await req.json();
    const updated = DataStore.updateIncident(params.id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const success = DataStore.deleteIncident(params.id);
  if (!success) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: `Incident ${params.id} deleted` });
}
