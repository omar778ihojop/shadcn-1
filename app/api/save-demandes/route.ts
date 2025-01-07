import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("db-test-flux");
    const collection = db.collection("fluxDetails");

    const demandes = await collection.find({}).toArray();
    return new Response(JSON.stringify(demandes), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes :", error);
    return new Response(JSON.stringify({ message: "Erreur interne du serveur" }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("db-test-flux");
    const collection = db.collection("fluxDetails");

    if (!Array.isArray(body)) {
      return new Response(JSON.stringify({ message: "Les données doivent être un tableau." }), { status: 400 });
    }

    const result = await collection.insertMany(
      body.map((demande) => ({
        numero: demande.numero,
        etat: demande.etat,
        nomDNSSource: demande.nomDNSSource,
        adresseIPSource: demande.adresseIPSource,
        maskSource: demande.maskSource,
        adresseIPNASource: demande.adresseIPNASource,
        nomDNSDestination: demande.nomDNSDestination,
        adresseIPDestination: demande.adresseIPDestination,
        maskDestination: demande.maskDestination,
        adresseIPNADestination: demande.adresseIPNADestination,
        protocole: demande.protocole,
        nomService: demande.nomService,
        portService: demande.portService,
        description: demande.description,
        dateImplementation: demande.dateImplementation,
        etablissement: demande.etablissement,
        demandeur: demande.demandeur,
        dateMaj: demande.dateMaj,
        application: demande.application,
      }))
    );

    return new Response(
      JSON.stringify({ message: "Demandes sauvegardées", insertedCount: result.insertedCount }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des demandes :", error);
    return new Response(JSON.stringify({ message: "Erreur interne du serveur" }), { status: 500 });
  }
}
