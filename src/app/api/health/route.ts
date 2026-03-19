import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      appVersion: process.env.npm_package_version ?? "0.1.0",
      environment: env.NODE_ENV,
      database: "reachable",
    });
  } catch (error) {
    logger.error("Health check failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        ok: false,
        appVersion: process.env.npm_package_version ?? "0.1.0",
        environment: env.NODE_ENV,
        database: "unreachable",
      },
      { status: 503 },
    );
  }
}

