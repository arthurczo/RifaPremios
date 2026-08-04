const globalForRuntime = globalThis as typeof globalThis & {
  databaseFallbackEnabled?: boolean;
};

export function isDemoDataMode() {
  return (
    globalForRuntime.databaseFallbackEnabled === true ||
    process.env.DEMO_DATA === '1' ||
    !process.env.DATABASE_URL?.trim()
  );
}

export function enableDemoDataMode() {
  globalForRuntime.databaseFallbackEnabled = true;
}

export function isDatabaseUnavailable(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const cause =
    error.cause instanceof Error
      ? `${error.cause.name}: ${error.cause.message}`
      : typeof error.cause === 'string'
        ? error.cause
        : '';

  const signature = `${error.name}: ${error.message}\n${cause}`;

  return /pool timeout|failed to retrieve a connection from pool|driveradaptererror|can't reach database server|connect econnrefused|ecconnrefused|p1001|p1002|p1017|p2024|p2037/i.test(
    signature,
  );
}

export async function runWithFallback<T>(
  query: () => Promise<T>,
  fallback: () => Promise<T> | T,
) {
  if (isDemoDataMode()) {
    return fallback();
  }

  try {
    return await query();
  } catch (error) {
    if (!isDatabaseUnavailable(error)) {
      throw error;
    }

    enableDemoDataMode();
    return fallback();
  }
}
