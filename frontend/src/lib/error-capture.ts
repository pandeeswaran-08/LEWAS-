let lastCapturedError: unknown = undefined;

if (typeof globalThis !== "undefined") {
  // Capture any unhandled errors that h3/nitro might swallow.
  // This is a best-effort capture; it only works in environments where
  // process.on is available (Node/Bun). In edge runtimes it is a no-op.
  if (typeof process !== "undefined" && typeof process.on === "function") {
    process.on("uncaughtException", (error: unknown) => {
      lastCapturedError = error;
    });
    process.on("unhandledRejection", (reason: unknown) => {
      lastCapturedError = reason;
    });
  }
}

export function consumeLastCapturedError(): unknown {
  const err = lastCapturedError;
  lastCapturedError = undefined;
  return err;
}
