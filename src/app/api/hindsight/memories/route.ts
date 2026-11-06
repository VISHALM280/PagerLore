import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data/store";

export async function GET() {
  try {
    const memories = DataStore.getMemories();
    return NextResponse.json({
      memories,
      total: memories.length,
      types_distribution: {
        experience: memories.filter((m) => m.type === "experience").length,
        observation: memories.filter((m) => m.type === "observation").length,
        world: memories.filter((m) => m.type === "world").length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
