import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  return session.user;
}

export async function deleteUserAccount(userId: string) {
  const client = await clientPromise;
  const db = client.db();
  const objectId = new ObjectId(userId);

  await Promise.all([
    db.collection("users").deleteOne({ _id: objectId }),
    db.collection("accounts").deleteMany({ userId: objectId }),
    db.collection("sessions").deleteMany({ userId: objectId }),
  ]);
}
