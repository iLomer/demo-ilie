import { NextResponse } from "next/server";
import { getHealthStatus } from "@/services/health-service";

export function GET(): NextResponse {
  return NextResponse.json(getHealthStatus(), { status: 200 });
}
