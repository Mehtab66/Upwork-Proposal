import { NextResponse } from "next/server";
import { RateLimitError } from "@/lib/rate-limit";

export function rateLimitJsonResponse(error: unknown) {
  if (error instanceof RateLimitError) {
    return NextResponse.json(
      {
        error: error.message,
        retryAfterSeconds: error.retryAfterSeconds,
      },
      {
        status: 429,
        headers: { "Retry-After": String(error.retryAfterSeconds) },
      }
    );
  }

  return null;
}
