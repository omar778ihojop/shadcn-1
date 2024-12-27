// app/flux/route.ts
import { NextRequest, NextResponse } from "next/server";

// On simule une base de données en mémoire
const fluxData = [
  { etablissement: "Hopital X", demandeur: "Dr. Y", dateMaj: "10/10/2024", objet: "Demande A" },
  // ...
];

const fluxDetails = [
  { numero: 1, etat: "AJOUT", nomDNSSource: "DNS1", adresseIPSource: "10.0.0.1", /* ... */ },
  // ...
];

export async function GET(request: NextRequest) {
  // Renvoie fluxData et fluxDetails en JSON
  return NextResponse.json({ fluxData, fluxDetails });
}

// Si vous voulez gérer l'upload d’un Excel, vous feriez un POST, etc. 
// Mais attention, le file upload en Next 13 requiert un peu de config (edge runtime vs node, etc.).
// Voir la doc : https://nextjs.org/docs/app/api-reference/file-conventions/route 
