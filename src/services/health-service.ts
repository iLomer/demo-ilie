export interface HealthStatus {
  status: "ok";
}

/**
 * Returns the current health status of the application.
 * Kept dependency-free so the endpoint can act as a liveness probe.
 */
export function getHealthStatus(): HealthStatus {
  return { status: "ok" };
}
