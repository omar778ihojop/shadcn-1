"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

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

export default function DemandesPage() {
  const [data, setData] = useState<FluxDetailItem[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [filters, setFilters] = useState({
    etablissement: "Tous",
    demandeur: "",
    application: "",
    etat: "Tous",
    protocole: "Tous",
    portService: "Tous",
  });

  useEffect(() => {
    async function fetchDemandes() {
      try {
        const response = await fetch("/api/save-demandes");
        console.log("Statut de la réponse :", response.status);

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des demandes : ${response.statusText}`
          );
        }

        const demandes = await response.json();
        console.log("Demandes récupérées :", demandes);

        setData(demandes);
      } catch (error) {
        console.error("Erreur dans fetchDemandes :", error);
      }
    }

    fetchDemandes();
  }, []);

  const columns = [
    {
      accessorKey: "etablissement",
      header: () => (
        <div className="flex flex-col">
          <span>Nom de l’établissement</span>
          <Select
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, etablissement: value }))
            }
            value={filters.etablissement}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous</SelectItem>
              {Array.from(
                new Set(data.map((item) => item.etablissement).filter(Boolean))
              ).map((etablissement) => (
                <SelectItem key={etablissement} value={etablissement}>
                  {etablissement}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      accessorKey: "etat",
      header: () => (
        <div className="flex flex-col">
          <span>État</span>
          <Select
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, etat: value }))
            }
            value={filters.etat}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous</SelectItem>
              {Array.from(
                new Set(data.map((item) => item.etat).filter(Boolean))
              ).map((etat) => (
                <SelectItem key={etat} value={etat}>
                  {etat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      accessorKey: "protocole",
      header: () => (
        <div className="flex flex-col">
          <span>Protocole</span>
          <Select
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, protocole: value }))
            }
            value={filters.protocole}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous</SelectItem>
              {Array.from(
                new Set(data.map((item) => item.protocole).filter(Boolean))
              ).map((protocole) => (
                <SelectItem key={protocole} value={protocole}>
                  {protocole}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      accessorKey: "portService",
      header: () => (
        <div className="flex flex-col">
          <span>N° Port</span>
          <Select
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, portService: value }))
            }
            value={filters.portService}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous</SelectItem>
              {Array.from(
                new Set(data.map((item) => item.portService).filter(Boolean))
              ).map((port) => (
                <SelectItem key={port} value={port}>
                  {port}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    { accessorKey: "demandeur", header: "Nom du demandeur" },
    { accessorKey: "dateMaj", header: "Date de la dernière MAJ" },
    { accessorKey: "application", header: "Application" },
    { accessorKey: "nomDNSSource", header: "Nom DNS Source" },
    { accessorKey: "adresseIPSource", header: "Adresse IP Source" },
    { accessorKey: "maskSource", header: "Mask Source" },
    { accessorKey: "adresseIPNASource", header: "Adresse IP NAT Source" },
    { accessorKey: "nomDNSDestination", header: "Nom DNS Destination" },
    { accessorKey: "adresseIPDestination", header: "Adresse IP Destination" },
    { accessorKey: "maskDestination", header: "Mask Destination" },
    { accessorKey: "adresseIPNADestination", header: "Adresse IP NAT Destination" },
    { accessorKey: "nomService", header: "Nom Service" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "dateImplementation", header: "Date d'implémentation" },
  ];

  const filteredData = data.filter((item) => {
    const matchesGlobalFilter =
      !globalFilter ||
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(globalFilter.toLowerCase());

    const matchesColumnFilters =
      (filters.etablissement === "Tous" ||
        item.etablissement === filters.etablissement) &&
      (filters.etat === "Tous" || item.etat === filters.etat) &&
      (filters.protocole === "Tous" || item.protocole === filters.protocole) &&
      (filters.portService === "Tous" || item.portService === filters.portService) &&
      (!filters.demandeur ||
        item.demandeur.toLowerCase().includes(filters.demandeur.toLowerCase())) &&
      (!filters.application ||
        item.application.toLowerCase().includes(filters.application.toLowerCase()));

    return matchesGlobalFilter && matchesColumnFilters;
  });

  return (
    <div className="p-8">
      <div className="mb-4">
        <Input
          placeholder="Rechercher dans les demandes..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full"
        />
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}




