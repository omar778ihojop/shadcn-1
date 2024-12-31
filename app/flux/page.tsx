"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table"; // Ajustez le chemin si nécessaire
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button"; 

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
  const [username, setUsername] = useState<string | null>(null);
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
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/user");
        if (!res.ok) {
          throw new Error("Non authentifié");
        }
        const data = await res.json();
        setUsername(data.username);

        // Ajouter automatiquement une ligne dans le tableau
        const now = new Date().toLocaleString();
        setFluxData((prev) => [
          ...prev,
          {
            etablissement: "Institut International de Radiochirurgie de Paris Hartmann– 2IRPH",
            demandeur: data.username,
            dateMaj: now,
            objet: "",
          },
        ]);
      } catch (error) {
        console.error("Erreur :", error);
        // Rediriger vers la page de connexion si non authentifié
        window.location.href = "/login";
      }
    }

    fetchUser();
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
            <th className="border border-gray-300 px-4 py-2 w-1/4">
        Nom de l’établissement
        <select className="ml-2 border p-1 rounded w-full">
          <option value="">(Sélectionner tout)</option>
          <option value="Institut International de Radiochirurgie de Paris Hartmann– 2IRPH - Institut de radiothérapie Hartmann">Institut International de Radiochirurgie de Paris Hartmann– 2IRPH - Institut de radiothérapie Hartmann</option>
          <option value="Cimed">Cimed</option>
          <option value="Clinique Ambroise Paré (Toulouse)">Clinique Ambroise Paré (Toulouse)</option>
          <option value="Clinique de l'Archette">Clinique de l'Archette</option>
          <option value="GCS Clinique Jeanne d'Arc">GCS Clinique Jeanne d'Arc</option>
          <option value="Clinique médicale et cardiologique d'Aressy">Clinique médicale et cardiologique d'Aressy</option>
          <option value="Clinique Saint-Augustin (Bordeaux)">Clinique Saint-Augustin (Bordeaux)</option>
          <option value="Clinique Saint Augustin">Clinique Saint Augustin</option>
          <option value="CENTRE MEDICO CHIRURGICAL TRONQUIERES">CENTRE MEDICO CHIRURGICAL TRONQUIERES</option>
          <option value="CMC Tronquières">CMC Tronquières</option>
          <option value="Clinique Pasteur (Bergerac)">Clinique Pasteur (Bergerac)</option>
          <option value="GCS BIM - TEP & IRM Beaujon - MN cardio Bichat">GCS BIM - TEP & IRM Beaujon - MN cardio Bichat</option>
          <option value="Centre de réadaptation Guillaume de Varye (Le Baludy)">Centre de réadaptation Guillaume de Varye (Le Baludy)</option>
          <option value="Clinique Bonnefon">Clinique Bonnefon</option>
          <option value="Clinique Bouchard">Clinique Bouchard</option>
          <option value="Clinique Bretéché">Clinique Bretéché</option>
          <option value="CENTRE AQUITAIN POUR LE DEVELOPPEMENT DE LA DIALYSE A DOMICILE (CA3D)">CENTRE AQUITAIN POUR LE DEVELOPPEMENT DE LA DIALYSE A DOMICILE (CA3D)</option>
          <option value="CALIBREST – Centre Finistérien de Radiothérapie et d’Oncologie">CALIBREST – Centre Finistérien de Radiothérapie et d’Oncologie</option>
          <option value="CALIMETZ - Institut Privé de Radiothérapie de Metz">CALIMETZ - Institut Privé de Radiothérapie de Metz</option>
          <option value="Imagerie Médicale Conflent Canigou">Imagerie Médicale Conflent Canigou</option>
          <option value="Clinique Belledonne Alpes (St Martin d'HERES)">Clinique Belledonne Alpes (St Martin d'HERES)</option>
          <option value="Clinique Claude Bernard (Albi)">Clinique Claude Bernard (Albi)</option>
          <option value="Clinique Bon Secours (Le Puy En Velay)">Clinique Bon Secours (Le Puy En Velay)</option>
          <option value="Clinique du Cambrésis">Clinique du Cambrésis</option>
          <option value="Centre de Dialyse de l'Estrée">Centre de Dialyse de l'Estrée</option>
          <option value="Clinique Cap d'Or">Clinique Cap d'Or</option>
          <option value="Centre Médico-Chirurgical Les Cèdres">Centre Médico-Chirurgical Les Cèdres</option>
          <option value="Clinique du Vallespir">Clinique du Vallespir</option>
          <option value="Clinique Nouvelle du Forez (Montbrison)">Clinique Nouvelle du Forez (Montbrison)</option>
          <option value="Hôpital Privé La Chataigneraie">Hôpital Privé La Chataigneraie</option>
          <option value="Clinique Saint-François">Clinique Saint-François</option>
          <option value="CIMROR (CENTRE D'IMAGERIE ME)">CIMROR (CENTRE D'IMAGERIE ME)</option>
          <option value="Clinique du Jura (Lons-Le-Saunier)">Clinique du Jura (Lons-Le-Saunier)</option>
          <option value="Centre Clinical">Centre Clinical</option>
          <option value="CALIREIMS – Centre ICONE">CALIREIMS – Centre ICONE</option>
          <option value="Clinique Calabet">Clinique Calabet</option>
          <option value="CALIVAL – Centre de cancérologie les Dentellières">CALIVAL – Centre de cancérologie les Dentellières</option>
          <option value="Clinique Du Parc (Lyon)">Clinique Du Parc (Lyon)</option>
          <option value="Clinique Saint Martin (Vesoul)">Clinique Saint Martin (Vesoul)</option>
          <option value="Centre Médico-Chirurgical du Mans">Centre Médico-Chirurgical du Mans</option>
          <option value="Centre Médical International – Centre de Vaccination International - Paris République">Centre Médical International – Centre de Vaccination International - Paris République</option>
          <option value="Centre Médical et de Vaccination Lyon – Clinique du Parc">Centre Médical et de Vaccination Lyon – Clinique du Parc</option>
          <option value="Centre Médical et de Vaccination Marseille Bouchard">Centre Médical et de Vaccination Marseille Bouchard</option>
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
        {/* Conteneur pour les boutons */}
  <div className="flex justify-between items-center mt-4">
    {/* Bouton Ajouter une ligne */}
    <Button variant="default" size="lg" type="submit" className="bg-blue-500">
      Ajouter une ligne
    </Button>

    {/* Bouton Envoyer la demande */}
    <Button
      variant="default"
      size="lg"
      className="bg-green-500 ml-auto"
      onClick={() => alert("Demande envoyée avec succès !")}
    >
      Envoyer la demande
    </Button>
  </div>
</form>
    </div>
  );
}





