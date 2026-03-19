import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Metrics endpoint stub for future Stage 6 observability.",
  });
}

