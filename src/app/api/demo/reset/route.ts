import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const res = DataStore.resetDemo();
    return NextResponse.json({
      success: true,
      message: "PagerLore demo environment reset to clean seeded state successfully.",
      ...res,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

