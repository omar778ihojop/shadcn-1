import { NextRequest, NextResponse } from "next/server";

// Simule une base de données en mémoire
const fluxData: Array<{ etablissement: string; demandeur: string; dateMaj: string; version?: string; objet: string }> = [
  { etablissement: "Hopital X", demandeur: "Dr. Y", dateMaj: "10/10/2024", objet: "Demande A" },
];

const fluxDetails: Array<{
  numero: number;
  etat: string;
  nomDNSSource: string;
  adresseIPSource: string;
  maskSource?: string;
  adresseIPNASource?: string;
  nomDNSDestination?: string;
  adresseIPDestination?: string;
  maskDestination?: string;
  adresseIPNADestination?: string;
  protocole?: string;
  nomService?: string;
  portService?: string;
  description?: string;
  dateImplementation?: string;
}> = [
  { numero: 1, etat: "AJOUT", nomDNSSource: "DNS1", adresseIPSource: "10.xxxx" },
];

// Gestion des requêtes GET
export async function GET(request: NextRequest) {
  return NextResponse.json({ fluxData, fluxDetails });
}

// Gestion des requêtes POST pour ajouter des flux
export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const body = await request.json();

  if (pathname.includes("add-flux")) {
    const flux = body.flux;
    if (Array.isArray(flux)) {
      flux.forEach((fluxItem) => {
        fluxData.push({
          etablissement: fluxItem.etablissement,
          demandeur: fluxItem.demandeur,
          dateMaj: fluxItem.dateMaj,
          version: fluxItem.version,
          objet: fluxItem.objet,
        });
      });
    } else {
      const { etablissement, demandeur, dateMaj, version, objet } = body;
      fluxData.push({ etablissement, demandeur, dateMaj, version, objet });
    }
    return NextResponse.json({ success: true, message: "Flux ajouté avec succès." });
  }

  if (pathname.includes("add-new-row")) {
    const newRows = body;
    if (Array.isArray(newRows)) {
      newRows.forEach((row) => {
        fluxDetails.push({
          numero: fluxDetails.length + 1,
          etat: row.etat || "",
          nomDNSSource: row.nomDNSSource || "",
          adresseIPSource: row.adresseIPSource || "",
          maskSource: row.maskSource || "",
          adresseIPNASource: row.adresseIPNASource || "",
          nomDNSDestination: row.nomDNSDestination || "",
          adresseIPDestination: row.adresseIPDestination || "",
          maskDestination: row.maskDestination || "",
          adresseIPNADestination: row.adresseIPNADestination || "",
          protocole: row.protocole || "",
          nomService: row.nomService || "",
          portService: row.portService || "",
          description: row.description || "",
          dateImplementation: row.dateImplementation || "",
        });
      });
      return NextResponse.json({ success: true, message: "Lignes ajoutées avec succès." });
    } else {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }
  }

  if (pathname.includes("add-flux-detail")) {
    const {
      etat,
      nomDNSSource,
      adresseIPSource,
      maskSource,
      adresseIPNASource,
      nomDNSDestination,
      adresseIPDestination,
      maskDestination,
      adresseIPNADestination,
      protocole,
      nomService,
      portService,
      description,
      dateImplementation,
    } = body;

    fluxDetails.push({
      numero: fluxDetails.length + 1,
      etat,
      nomDNSSource,
      adresseIPSource,
      maskSource,
      adresseIPNASource,
      nomDNSDestination,
      adresseIPDestination,
      maskDestination,
      adresseIPNADestination,
      protocole,
      nomService,
      portService,
      description,
      dateImplementation,
    });

    return NextResponse.json({ success: true, message: "Détail ajouté avec succès." });
  }

  return NextResponse.json({ success: false, message: "Route non trouvée." }, { status: 404 });
}
