import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import clientPromise from "@/lib/mongodb";

function isValidUpworkUrl(url: string) {
  if (!url.trim()) {
    return true;
  }

  try {
    const parsed = new URL(url.trim());
    return parsed.hostname.includes("upwork.com");
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const client = await clientPromise;
    const dbUser = await client
      .db()
      .collection("users")
      .findOne(
        { _id: new ObjectId(user.id) },
        { projection: { upworkProfileUrl: 1 } }
      );

    return NextResponse.json({
      upworkProfileUrl: (dbUser?.upworkProfileUrl as string) || "",
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { upworkProfileUrl } = await request.json();
    const normalizedUrl =
      typeof upworkProfileUrl === "string" ? upworkProfileUrl.trim() : "";

    if (!isValidUpworkUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: "Please enter a valid Upwork profile URL." },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    await client
      .db()
      .collection("users")
      .updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            upworkProfileUrl: normalizedUrl || null,
            updatedAt: new Date(),
          },
        }
      );

    return NextResponse.json({
      message: "Upwork profile URL saved successfully.",
      upworkProfileUrl: normalizedUrl,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
