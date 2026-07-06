import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import clientPromise from "@/lib/mongodb";

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All password fields are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New passwords do not match." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const dbUser = await client
      .db()
      .collection("users")
      .findOne({ _id: new ObjectId(user.id) });

    if (!dbUser?.password) {
      return NextResponse.json(
        { error: "Password updates are only available for email accounts." },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(currentPassword, dbUser.password as string);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await client
      .db()
      .collection("users")
      .updateOne(
        { _id: new ObjectId(user.id) },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
