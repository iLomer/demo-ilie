export interface HealthStatus {
  status: "ok";
}

/**
 * Business logic for the health check. Returns the current service health.
 */
export function getHealthStatus(): HealthStatus {
  return { status: "ok" };
}
