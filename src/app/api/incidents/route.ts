import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data/store";
import { Incident } from "@/lib/types/incident";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const incidents = DataStore.getIncidents();
    return NextResponse.json({ incidents, total: incidents.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.affected_service) {
      return NextResponse.json(
        { error: "Title and affected_service are required" },
        { status: 400 }
      );
    }

    const newId = `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newIncident: Incident = {
      id: newId,
      title: body.title,
      description: body.description || "Active production incident under investigation.",
      severity: body.severity || "SEV-2",
      status: "investigating",
      affected_service: body.affected_service,
      environment: body.environment || "production",
      started_at: new Date().toISOString(),
      duration_minutes: 1,
      assigned_engineer: body.assigned_engineer || {
        name: "Marcus Vance",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        email: "m.vance@pagerlore.internal",
        role: "Lead SRE Engineer",
      },
      metrics: body.metrics || {
        error_rate_pct: 14.5,
        p95_latency_ms: 1200,
        request_rate_rps: 320,
        cpu_usage_pct: 68,
        memory_usage_pct: 75,
      },
      logs: body.logs || [
        {
          id: `log-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          level: "ERROR",
          source: body.affected_service,
          message: `Uncaught exception in service handler: ${body.title}`,
        },
      ],
      recent_deployments: body.recent_deployments || [],
    };

    const saved = DataStore.createIncident(newIncident);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

