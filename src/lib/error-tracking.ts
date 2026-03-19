import { logger } from "./logger";

export function captureException(error: unknown, context?: Record<string, unknown>) {
  // TODO: replace with Sentry/Datadog/NewRelic integration in Stage 6.
  logger.error("Unhandled exception", {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });
}

