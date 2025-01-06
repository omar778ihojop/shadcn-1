"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

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
};

const columns: ColumnDef<FluxDetailItem>[] = [
  { accessorKey: "numero", header: "N° Flux" },
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
    async function fetchData() {
      try {
        const response = await fetch("/flux/data");
        const result = await response.json();
        if (result.success) {
          setData(result.fluxDetails);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Demandes</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
