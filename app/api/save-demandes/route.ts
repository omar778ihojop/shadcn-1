import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("fluxDetails");

    // Insérer les données dans MongoDB
    const result = await collection.insertOne(body);

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Erreur dans save-demandes :", error);
    return NextResponse.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const demandes = await db.collection("fluxDetails").find({}).toArray();

    return NextResponse.json(demandes);
  } catch (error) {
    console.error("Erreur dans get-demandes :", error);
    return NextResponse.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
