import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Fonction de validation
function validateFluxDetail(body: any) {
  if (!body.etat) return "Le champ 'etat' est requis.";
  if (!body.nomDNSSource) return "Le champ 'nomDNSSource' est requis.";
  if (!body.adresseIPSource) return "Le champ 'adresseIPSource' est requis.";
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(body.adresseIPSource)) {
    return "Le champ 'adresseIPSource' doit être une adresse IP valide.";
  }
  if (body.maskSource && isNaN(Number(body.maskSource))) {
    return "Le champ 'maskSource' doit être un nombre.";
  }
  // Ajoutez d'autres validations si nécessaire

  return null; // Aucun problème
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const fluxDetails = await db.collection("fluxDetails").find({}).toArray();

    return NextResponse.json({ success: true, fluxDetails });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return NextResponse.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Body reçu :", body);

    // Validation des données
    const validationError = validateFluxDetail(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("fluxDetails");

    if (body.action === "add-flux-detail") {
      console.log("Ajout d'un détail de flux :", body);

      // Générez un numéro unique si nécessaire
      const numero = body.numero || (await collection.countDocuments()) + 1;

      const fluxDetail = {
        numero: numero,
        etat: body.etat,
        nomDNSSource: body.nomDNSSource,
        adresseIPSource: body.adresseIPSource,
        maskSource: body.maskSource,
        adresseIPNASource: body.adresseIPNASource,
        nomDNSDestination: body.nomDNSDestination,
        adresseIPDestination: body.adresseIPDestination,
        maskDestination: body.maskDestination,
        adresseIPNADestination: body.adresseIPNADestination,
        protocole: body.protocole,
        nomService: body.nomService,
        portService: body.portService,
        description: body.description,
        dateImplementation: body.dateImplementation,
      };

      // Insérer dans MongoDB
      const result = await collection.insertOne(fluxDetail);
      return NextResponse.json({
        success: true,
        message: "Détail ajouté avec succès.",
        insertedId: result.insertedId,
      });
    }

    return NextResponse.json(
      { success: false, message: "Action non reconnue." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erreur lors du traitement de la requête :", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne." },
      { status: 500 }
    );
  }
}


