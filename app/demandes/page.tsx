"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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

export default function DemandesPage() {
  const [data, setData] = useState<FluxDetailItem[]>([]);
  const [filters, setFilters] = useState({
    global: "",
    etablissement: "Tous",
    etat: "Tous",
    protocole: "Tous",
    portService: "Tous",
    demandeur: "",
    application: "",
  });

  useEffect(() => {
    async function fetchDemandes() {
      try {
        const response = await fetch("/api/save-demandes");
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des demandes : ${response.statusText}`);
        }
        const demandes = await response.json();
        console.log("Données récupérées :", demandes); // Vérification des données récupérées
        setData(demandes);
      } catch (error) {
        console.error("Erreur dans fetchDemandes :", error);
      }
    }
    fetchDemandes();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      global: "",
      etablissement: "Tous",
      etat: "Tous",
      protocole: "Tous",
      portService: "Tous",
      demandeur: "",
      application: "",
    });
  };

  const filteredData = data.filter((item) => {
    const matchesGlobalFilter =
      !filters.global ||
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(filters.global.toLowerCase());

    const matchesColumnFilters =
      (filters.etablissement === "Tous" || item.etablissement === filters.etablissement) &&
      (filters.etat === "Tous" || item.etat === filters.etat) &&
      (filters.protocole === "Tous" || item.protocole === filters.protocole) &&
      (filters.portService === "Tous" || item.portService === filters.portService) &&
      (!filters.demandeur ||
        item.demandeur?.toLowerCase().includes(filters.demandeur.toLowerCase())) &&
      (!filters.application ||
        item.application?.toLowerCase().includes(filters.application.toLowerCase()));

    return matchesGlobalFilter && matchesColumnFilters;
  });

  return (
    <div className="p-8">
      {/* Formulaire de filtrage */}
      <div className="mb-6 space-y-4">
        <Input
          placeholder="Recherche globale..."
          value={filters.global}
          onChange={(e) => handleFilterChange("global", e.target.value)}
          className="w-full"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            value={filters.etablissement}
            onValueChange={(value) => handleFilterChange("etablissement", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Etablissement" />
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

          <Select
            value={filters.etat}
            onValueChange={(value) => handleFilterChange("etat", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="État" />
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

          <Select
            value={filters.protocole}
            onValueChange={(value) => handleFilterChange("protocole", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Protocole" />
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

          <Select
            value={filters.portService}
            onValueChange={(value) => handleFilterChange("portService", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="N° Port" />
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

          <Input
            placeholder="Demandeur"
            value={filters.demandeur}
            onChange={(e) => handleFilterChange("demandeur", e.target.value)}
          />

          <Input
            placeholder="Application"
            value={filters.application}
            onChange={(e) => handleFilterChange("application", e.target.value)}
          />
        </div>

        <Button onClick={handleResetFilters} className="mt-4">
          Réinitialiser les filtres
        </Button>
      </div>

      {/* Tableau */}
      <DataTable
        columns={[
          { accessorKey: "numero", header: "Numéro" },
          { accessorKey: "etablissement", header: "Établissement" },
          { accessorKey: "etat", header: "État" },
          { accessorKey: "protocole", header: "Protocole" },
          { accessorKey: "portService", header: "Port Service" },
          { accessorKey: "demandeur", header: "Demandeur" },
          { accessorKey: "application", header: "Application" },
          { accessorKey: "dateMaj", header: "Dernière MAJ" },
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
        ]}
        data={filteredData}
      />
    </div>
  );
}


git clone https://github.com/briancodex/shadcn-1.git
cd shadcn-1

git remote add private https://github.com/GITHUBELSAN/Open-flux.git


git push Open-flux --all
git push Open-flux --tags