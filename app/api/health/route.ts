import { NextResponse } from "next/server";
import { getHealthStatus, type HealthStatus } from "@/lib/services/health-service";

export function GET(): NextResponse<HealthStatus> {
  return NextResponse.json(getHealthStatus());
}
