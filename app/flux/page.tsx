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
    {/* Remplacement des anciennes options par les nouvelles */}
    <option value="2IR">2IR</option>
    <option value="AGE">AGE</option>
    <option value="AMB">AMB</option>
    <option value="ARC">ARC</option>
    <option value="ARL">ARL</option>
    <option value="ASY">ASY</option>
    <option value="AUG">AUG</option>
    <option value="AUG">AUG</option>
    <option value="AUR">AUR</option>
    <option value="AUR">AUR</option>
    <option value="BGC">BGC</option>
    <option value="BIM">BIM</option>
    <option value="BLY">BLY</option>
    <option value="BON">BON</option>
    <option value="BOU">BOU</option>
    <option value="BOU">BOU</option>
    <option value="BRE">BRE</option>
    <option value="CAD">CAD</option>
    <option value="CAL">CAL</option>
    <option value="CAM">CAM</option>
    <option value="CAN">CAN</option>
    <option value="CBD">CBD</option>
    <option value="CBE">CBE</option>
    <option value="CBO">CBO</option>
    <option value="CBS">CBS</option>
    <option value="CDE">CDE</option>
    <option value="CDO">CDO</option>
    <option value="CED">CED</option>
    <option value="CER">CER</option>
    <option value="CFO">CFO</option>
    <option value="CHA">CHA</option>
    <option value="CHX">CHX</option>
    <option value="CIM">CIM</option>
    <option value="CJU">CJU</option>
    <option value="CLI">CLI</option>
    <option value="CLR">CLR</option>
    <option value="CLT">CLT</option>
    <option value="CLV">CLV</option>
    <option value="CLY">CLY</option>
    <option value="CMA">CMA</option>
    <option value="CMC">CMC</option>
    <option value="CMI">CMI</option>
    <option value="CML">CML</option>
    <option value="CMM">CMM</option>
    <option value="CMT">CMT</option>
    <option value="CNT">CNT</option>
    <option value="COF">COF</option>
    <option value="COM">COM</option>
    <option value="CPA">CPA</option>
    <option value="CPB">CPB</option>
    <option value="CRA">CRA</option>
    <option value="CRE">CRE</option>
    <option value="CSA">CSA</option>
    <option value="CSF">CSF</option>
    <option value="CSO">CSO</option>
    <option value="CSP">CSP</option>
    <option value="CTM">CTM</option>
    <option value="CVI">CVI</option>
    <option value="DAP">DAP</option>
    <option value="DES">DES</option>
    <option value="DUN">DUN</option>
    <option value="ESQ">ESQ</option>
    <option value="EST">EST</option>
    <option value="FDG">FDG</option>
    <option value="FIF">FIF</option>
    <option value="FIR">FIR</option>
    <option value="FLA">FLA</option>
    <option value="FLE">FLE</option>
    <option value="FLO">FLO</option>
    <option value="FON">FON</option>
    <option value="FRA">FRA</option>
    <option value="FVT">FVT</option>
    <option value="GDV">GDV</option>
    <option value="GIS">GIS</option>
    <option value="GLA">GLA</option>
    <option value="GRA">GRA</option>
    <option value="HAD">HAD</option>
    <option value="HAR">HAR</option>
    <option value="HCC">HCC</option>
    <option value="HEM">HEM</option>
    <option value="HPA">HPA</option>
    <option value="HPL">HPL</option>
    <option value="HPN">HPN</option>
    <option value="HSA">HSA</option>
    <option value="IAD">IAD</option>
    <option value="IAP">IAP</option>
    <option value="IAV">IAV</option>
    <option value="ICG">ICG</option>
    <option value="ICO">ICO</option>
    <option value="ICO-1">ICO-1</option>
    <option value="ILF">ILF</option>
    <option value="IMG">IMG</option>
    <option value="INK">INK</option>
    <option value="IOS">IOS</option>
    <option value="ISO">ISO</option>
    <option value="ITM">ITM</option>
    <option value="JVL">JVL</option>
    <option value="KER">KER</option>
    <option value="KEV">KEV</option>
    <option value="LAN">LAN</option>
    <option value="LAU">LAU</option>
    <option value="MAJ">MAJ</option>
    <option value="MAU">MAU</option>
    <option value="MAU-1">MAU-1</option>
    <option value="MAU-2">MAU-2</option>
    <option value="MAU-3">MAU-3</option>
    <option value="MAU-4">MAU-4</option>
    <option value="MDR">MDR</option>
    <option value="MLC">MLC</option>
    <option value="MON">MON</option>
    <option value="MRE">MRE</option>
    <option value="MTG">MTG</option>
    <option value="NAR">NAR</option>
    <option value="NCD">NCD</option>
    <option value="NDE">NDE</option>
    <option value="NEM">NEM</option>
    <option value="NEM-1">NEM-1</option>
    <option value="NEM-2">NEM-2</option>
    <option value="NEM-3">NEM-3</option>
    <option value="NLF">NLF</option>
    <option value="OCC">OCC</option>
    <option value="OCE">OCE</option>
    <option value="ORA">ORA</option>
    <option value="ORC">ORC</option>
    <option value="ORE">ORE</option>
    <option value="ORP">ORP</option>
    <option value="PAO">PAO</option>
    <option value="PAR">PAR</option>
    <option value="PCA">PCA</option>
    <option value="PDP">PDP</option>
    <option value="PER">PER</option>
    <option value="PFC">PFC</option>
    <option value="PGS">PGS</option>
    <option value="PND">PND</option>
    <option value="POD">POD</option>
    <option value="PON">PON</option>
    <option value="PPA">PPA</option>
    <option value="PPI">PPI</option>
    <option value="PSR">PSR</option>
    <option value="PVS">PVS</option>
    <option value="PYR">PYR</option>
    <option value="RDG">RDG</option>
    <option value="RHM">RHM</option>
    <option value="RIM">RIM</option>
    <option value="RLS">RLS</option>
    <option value="ROZ">ROZ</option>
    <option value="SAD">SAD</option>
    <option value="SCH">SCH</option>
    <option value="SEN">SEN</option>
    <option value="SID">SID</option>
    <option value="SMI">SMI</option>
    <option value="SOM">SOM</option>
    <option value="SPI">SPI</option>
    <option value="SQT">SQT</option>
    <option value="SRO">SRO</option>
    <option value="SSA">SSA</option>
    <option value="STC">STC</option>
    <option value="STI">STI</option>
    <option value="STL">STL</option>
    <option value="STS">STS</option>
    <option value="TEP">TEP</option>
    <option value="TER">TER</option>
    <option value="THX">THX</option>
    <option value="TPN">TPN</option>
    <option value="VDL">VDL</option>
    <option value="VHU">VHU</option>
    <option value="YSS">YSS</option>
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





