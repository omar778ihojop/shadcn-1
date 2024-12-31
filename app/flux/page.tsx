"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table"; // Ajustez le chemin si nécessaire
import { ColumnDef } from "@tanstack/react-table";

type FluxDataItem = {
  etablissement: string;
  demandeur: string;
  dateMaj: string;
  objet: string;
};

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


const fluxDetailsColumns: ColumnDef<FluxDetailItem>[] = [
  {
    accessorKey: "numero",
    header: "N° Flux",
  },
  {
    accessorKey: "etat",
    header: () => (
      <>
        État
        <select className="ml-2 border p-1 rounded">
          <option value="">(Sélectionner tout)</option>
          <option value="AJOUT">AJOUT</option>
          <option value="SUPPRESSION">SUPPRESSION</option>
          <option value="MODIFICATION">MODIFICATION</option>
          <option value="VIDES">(Vides)</option>
        </select>
      </>
    ),
  },
  {
    accessorKey: "nomDNSSource",
    header: () => (
      <>
        Nom DNS Source
        <select className="ml-2 border p-1 rounded">
          <option value="">(Sélectionner tout)</option>
          <option value="GRP-OCE_VPNSSL-MFA-Users">GRP-OCE_VPNSSL-MFA-Users</option>
          <option value="ST YVES Oncologie">ST YVES Oncologie</option>
          <option value="VLAN Bloc">VLAN Bloc</option>
          <option value="VLAN Clinique">VLAN Clinique</option>
          <option value="VIDES">(Vides)</option>
        </select>
      </>
    ),
  },
  {
    accessorKey: "adresseIPSource",
    header: () => (
      <>
        Adresse IP Source
        <select className="ml-2 border p-1 rounded">
          <option value="">(Sélectionner tout)</option>
          <option value="10.145.28.0">10.145.28.0</option>
          <option value="10.145.29.0">10.145.29.0</option>
          <option value="10.145.30.0">10.145.30.0</option>
          <option value="VIDES">(Vides)</option>
        </select>
      </>
    ),
  },
  {
    accessorKey: "protocole",
    header: () => (
      <>
        Protocole
        <select className="ml-2 border p-1 rounded">
          <option value="">(Sélectionner tout)</option>
          <option value="TCP">TCP</option>
          <option value="UDP">UDP</option>
          <option value="ICMP">ICMP</option>
          <option value="VIDES">(Vides)</option>
        </select>
      </>
    ),
  },
  { accessorKey: "nomService", header: "Nom Service" },
  { accessorKey: "portService", header: "N° Port" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "dateImplementation", header: "Date d'implémentation" },
];


export default function FluxPage() {
  const [fluxData, setFluxData] = useState<FluxDataItem[]>([]);
  const [fluxDetails, setFluxDetails] = useState<FluxDetailItem[]>([]);
  const handleCellChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    key: keyof FluxDataItem
  ) => {
    const newValue = e.target.value;
  
    setFluxData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex][key] = newValue;
      return updatedData;
    });
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/flux/data");
        if (!res.ok) {
          throw new Error(`Erreur de récupération: ${res.status}`);
        }

        const data = await res.json();
        setFluxDetails(data.fluxDetails || []);
        setFluxData(data.fluxData || []);
      } catch (error) {
        console.error("Erreur lors du fetch des données :", error);
      }
    }

    fetchData();
  }, []);

  // Gérer la soumission du formulaire
  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Caster e.target comme formulaire HTML
    const form = e.target as HTMLFormElement;

    // Récupérer les données du formulaire
    const formData = new FormData(form);
    const newData: Partial<FluxDetailItem> = Object.fromEntries(formData) as Partial<FluxDetailItem>;

    // Validation des champs obligatoires
    if (!newData.etat || !newData.nomDNSSource || !newData.adresseIPSource) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    console.log("Payload envoyé :", JSON.stringify(newData, null, 2));

try {
  const res = await fetch("/flux/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        ...newData,
        action: "add-flux-detail", // Ajouter un champ action
      }),
    });

  const result = await res.json();
  console.log("Statut de la réponse :", res.status);
  console.log("Réponse du serveur :", result);

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Erreur lors de l'ajout de la ligne.");
  }

  // Ajouter la ligne localement si la requête est réussie
  setFluxDetails((prevDetails) => [
    ...prevDetails,
    { ...newData, numero: prevDetails.length + 1 } as FluxDetailItem,
  ]);

  alert("Ligne ajoutée avec succès !");
  form.reset();
} catch (error) {
  console.error("Erreur lors de l'envoi des données :", error);
  alert("Une erreur s'est produite lors de l'ajout de la ligne.");
}
}

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Tableau de Bord des Flux</h1>

      {/* Conteneur principal pour deux tableaux côte à côte */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Tableau principal */}
        <table className="border-collapse border border-gray-300 w-full">
          <thead className="bg-gray-200">
            <tr>
            <th className="border border-gray-300 px-4 py-2">
        Nom de l’établissement
        <select className="ml-2 border p-1 rounded">
          <option value="">(Sélectionner tout)</option>
          <option value="Etablissement A">Etablissement A</option>
          <option value="Etablissement B">Etablissement B</option>
          <option value="Etablissement C">Etablissement C</option>
        </select>
      </th>
              <th className="border border-gray-300 px-4 py-2">Nom du demandeur</th>
              <th className="border border-gray-300 px-4 py-2">Date de la dernière MAJ</th>
              <th className="border border-gray-300 px-4 py-2">Objet de la demande</th>
            </tr>
          </thead>
          <tbody>
  {fluxData.map((item: FluxDataItem, idx: number) => (
    <tr key={idx} className="even:bg-gray-100">
      <td className="border border-gray-300 px-4 py-2">{item.etablissement}</td>
      <td className="border border-gray-300 px-4 py-2">
          <input
            type="text"
            className="border p-1 w-full"
            defaultValue={item.demandeur}
            onChange={(e) => handleCellChange(e, idx, "demandeur")}
          />
        </td>
        <td className="border border-gray-300 px-4 py-2">
          <input
            type="text"
            className="border p-1 w-full"
            defaultValue={item.dateMaj}
            onChange={(e) => handleCellChange(e, idx, "dateMaj")}
          />
        </td>
        <td className="border border-gray-300 px-4 py-2">
          <input
            type="text"
            className="border p-1 w-full"
            defaultValue={item.objet}
            onChange={(e) => handleCellChange(e, idx, "objet")}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>

        {/* Tableau additionnel */}
        <table className="border-collapse border border-gray-300 w-full">
          <tbody>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nom du valideur</th>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  name="valideur"
                  placeholder="Nom du valideur"
                  className="border p-2 w-full"
                />
              </td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Approbation</th>
              <td className="border border-gray-300 px-4 py-2">
                <select name="approbation" className="border p-2 w-full">
                  <option value="NON/OUI">NON/OUI</option>
                  <option value="OUI">OUI</option>
                  <option value="NON">NON</option>
                </select>
              </td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Commentaires</th>
              <td className="border border-gray-300 px-4 py-2">
                <textarea
                  name="commentaires"
                  rows={3}
                  placeholder="Ajouter des commentaires"
                  className="border p-2 w-full"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tableau détaillé avec Data Table */}
      <div className="mb-8">
        <DataTable columns={fluxDetailsColumns} data={fluxDetails} />
      </div>

      {/* Formulaire pour ajouter une nouvelle ligne */}
      <form onSubmit={handleFormSubmit}>
        <table className="add-row-table">
          <tbody>
            <tr>
              <td><input type="text" name="etat" placeholder="Etat" className="border p-2 w-full" /></td>
              <td><input type="text" name="nomDNSSource" placeholder="Nom DNS Source" className="border p-2 w-full" /></td>
              <td><input type="text" name="adresseIPSource" placeholder="Adresse IP Source" className="border p-2 w-full" /></td>
              <td><input type="text" name="maskSource" placeholder="Mask Source" className="border p-2 w-full" /></td>
              <td><input type="text" name="adresseIPNASource" placeholder="Adresse IP NAT Source" className="border p-2 w-full" /></td>
              <td><input type="text" name="nomDNSDestination" placeholder="Nom DNS Destination" className="border p-2 w-full" /></td>
              <td><input type="text" name="adresseIPDestination" placeholder="Adresse IP Destination" className="border p-2 w-full" /></td>
              <td><input type="text" name="maskDestination" placeholder="Mask Destination" className="border p-2 w-full" /></td>
              <td><input type="text" name="adresseIPNADestination" placeholder="Adresse IP NAT Destination" className="border p-2 w-full" /></td>
              <td><input type="text" name="protocole" placeholder="Protocole" className="border p-2 w-full" /></td>
              <td><input type="text" name="nomService" placeholder="Nom Service" className="border p-2 w-full" /></td>
              <td><input type="text" name="portService" placeholder="N° Port" className="border p-2 w-full" /></td>
              <td><input type="text" name="description" placeholder="Description" className="border p-2 w-full" /></td>
              <td><input type="date" name="dateImplementation" className="border p-2 w-full" /></td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
          Ajouter une ligne
        </button>
      </form>
    </div>
  );
}





