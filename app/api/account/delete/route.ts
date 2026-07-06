import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { deleteUserAccount, getCurrentUser } from "@/lib/session";
import clientPromise from "@/lib/mongodb";

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const password = typeof body.password === "string" ? body.password : "";

    const client = await clientPromise;
    const dbUser = await client
      .db()
      .collection("users")
      .findOne({ _id: new ObjectId(user.id) });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (dbUser.password) {
      if (!password) {
        return NextResponse.json(
          { error: "Password is required to delete your account." },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(password, dbUser.password as string);
      if (!isValid) {
        return NextResponse.json(
          { error: "Incorrect password." },
          { status: 400 }
        );
      }
    }

    await deleteUserAccount(user.id);

    return NextResponse.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
