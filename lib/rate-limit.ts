import clientPromise from "@/lib/mongodb";

interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export class RateLimitError extends Error {
  retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Too many requests. Please try again later.");
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export async function assertRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions) {
  const client = await clientPromise;
  const collection = client.db().collection("rate_limits");
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  await collection.deleteMany({ expiresAt: { $lt: now } });

  const record = await collection.findOne({ key });

  if (!record || new Date(record.windowStartedAt) < windowStart) {
    await collection.updateOne(
      { key },
      {
        $set: {
          key,
          count: 1,
          windowStartedAt: now,
          expiresAt: new Date(now.getTime() + windowMs),
        },
      },
      { upsert: true }
    );
    return;
  }

  const count = Number(record.count || 0);

  if (count >= limit) {
    const retryAfterMs =
      new Date(record.windowStartedAt).getTime() + windowMs - now.getTime();
    throw new RateLimitError(Math.max(1, Math.ceil(retryAfterMs / 1000)));
  }

  await collection.updateOne(
    { key },
    { $inc: { count: 1 }, $set: { expiresAt: new Date(now.getTime() + windowMs) } }
  );
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export async function assertAuthEmailRateLimit(
  request: Request,
  scope: string,
  email: string,
  limit = 5,
  windowMs = 15 * 60 * 1000
) {
  const ip = getClientIp(request);
  const normalizedEmail = email.toLowerCase().trim();

  await assertRateLimit({
    key: `${scope}:ip:${ip}`,
    limit,
    windowMs,
  });

  await assertRateLimit({
    key: `${scope}:email:${normalizedEmail}`,
    limit: Math.max(3, limit - 2),
    windowMs,
  });
}
