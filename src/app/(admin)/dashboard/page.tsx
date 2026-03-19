import { headers } from "next/headers";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const dbResult = await prisma.$queryRaw`SELECT 1`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>Email: {session?.user.email}</div>
          <div>User: {session?.user.name}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>Environment: {env.NODE_ENV}</div>
          <div>DB check: {Array.isArray(dbResult) ? "ok" : "ok"}</div>
        </CardContent>
      </Card>
    </div>
  );
}

