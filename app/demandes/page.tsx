"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

type FluxDetailItem = {
  numero: number;
  etat: string;
  nomDNSSource: string;
  adresseIPSource: string;
  maskSource: string;
  adresseIPNASource: string;
  nomDNSDestination: string;
  adresseIPDestination: string;
  maskDestination: string;
  adresseIPNADestination: string;
  protocole: string;
  nomService: string;
  portService: string;
  description: string;
  dateImplementation: string;
  etablissement: string;
  demandeur: string;
  dateMaj: string;
  application: string;
};

const columns = [
  { accessorKey: "etablissement", header: "Nom de l’établissement" },
  { accessorKey: "demandeur", header: "Nom du demandeur" },
  { accessorKey: "dateMaj", header: "Date de la dernière MAJ" },
  { accessorKey: "application", header: "Application" },
  { accessorKey: "etat", header: "État" },
  { accessorKey: "nomDNSSource", header: "Nom DNS Source" },
  { accessorKey: "adresseIPSource", header: "Adresse IP Source" },
  { accessorKey: "maskSource", header: "Mask Source" },
  { accessorKey: "adresseIPNASource", header: "Adresse IP NAT Source" },
  { accessorKey: "nomDNSDestination", header: "Nom DNS Destination" },
  { accessorKey: "adresseIPDestination", header: "Adresse IP Destination" },
  { accessorKey: "maskDestination", header: "Mask Destination" },
  { accessorKey: "adresseIPNADestination", header: "Adresse IP NAT Destination" },
  { accessorKey: "protocole", header: "Protocole" },
  { accessorKey: "nomService", header: "Nom Service" },
  { accessorKey: "portService", header: "N° Port" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "dateImplementation", header: "Date d'implémentation" },
];


export default function demandesPage() {
  const [data, setData] = useState<FluxDetailItem[]>([]);

  useEffect(() => {
    async function fetchDemandes() {
      try {
        const response = await fetch("/api/save-demandes");
        console.log("Statut de la réponse :", response.status);
    
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des demandes : ${response.statusText}`);
        }
    
        const demandes = await response.json();
        console.log("Demandes récupérées :", demandes); // Ajouté pour debug
    
        setData(demandes);
      } catch (error) {
        console.error("Erreur dans fetchDemandes :", error);
      }
    }
  
    fetchDemandes();
  }, []);
  

  return (
    <div className="p-8">

      <DataTable columns={columns} data={data} />
    </div>
  );
}
