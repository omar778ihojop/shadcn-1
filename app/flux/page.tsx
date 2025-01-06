"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table"; // Ajustez le chemin si nécessaire
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button"; 

const etablissementOptions = Array.from(
  new Set([
  "2IR", "AGE", "AMB", "ARC", "ARL", "ASY", "AUG", "AUG", "AUR", "AUR", "BGC",
  "BIM", "BLY", "BON", "BOU", "BOU", "BRE", "CAD", "CAL", "CAM", "CAN", "CBD",
  "CBE", "CBO", "CBS", "CDE", "CDO", "CED", "CER", "CFO", "CHA", "CHX", "CIM",
  "CJU", "CLI", "CLR", "CLT", "CLV", "CLY", "CMA", "CMC", "CMI", "CML", "CMM",
  "CMT", "CNT", "COF", "COM", "CPA", "CPB", "CRA", "CRE", "CSA", "CSF", "CSO",
  "CSP", "CTM", "CVI", "DAP", "DES", "DUN", "ESQ", "EST", "FDG", "FIF", "FIF",
  "FIR", "FLA", "FLE", "FLE", "FLO", "FON", "FRA", "FVT", "GDV", "GIS", "GLA",
  "GRA", "HAD", "HAR", "HCC", "HEM", "HPA", "HPL", "HPN", "HSA", "IAD", "IAP",
  "IAV", "ICG", "ICO", "ICO-1", "ILF", "IMG", "INK", "IOS", "ISO", "ITM", "JVL",
  "KER", "KEV", "LAN", "LAU", "MAJ", "MAU", "MAU-1", "MAU-2", "MAU-3", "MAU-4",
  "MDR", "MLC", "MLC", "MON", "Monis", "MOR", "MRE", "MTG", "NAR", "NCD", "NDE",
  "NDT", "NEM", "NEM-1", "NEM-2", "NEM-3", "NLF", "OCC", "OCE", "ORA", "ORC",
  "ORE", "ORP", "Orthéo", "PAO", "PAR", "PCA", "PDP", "PER", "PFC", "PGS", "PND",
  "POD", "POD", "PON", "PPA", "PPI", "PSR", "PVS", "PYR", "RDG", "RHM", "RHO",
  "RHO", "RIM", "RLS", "ROZ", "SAD", "SAO", "SAP", "SCH", "SEN", "SID", "SJU",
  "SLF", "SMI", "SOM", "SPI", "SQT", "SRO", "SSA", "STC", "STI", "STL", "STM",
  "STS", "SUD", "SUP", "TEP", "TER", "THX", "TLN", "TLN", "TPN", "UBN", "VAU",
  "VDL", "VHU", "YSS",
])
);

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
      </>
    ),
  },
  {
    accessorKey: "nomDNSSource",
    header: () => (
      <>
        Nom DNS Source
      </>
    ),
  },
  {
    accessorKey: "adresseIPSource",
    header: () => (
      <>
        Adresse IP Source
      </>
    ),
  },
  { accessorKey: "maskSource", header: "Mask Source" },
  { accessorKey: "adresseIPNASource", header: "Adresse IP NAT Source" },
  { accessorKey: "nomDNSDestination", header: "Nom DNS Destination" },
  { accessorKey: "adresseIPDestination", header: "Adresse IP Destination" },
  { accessorKey: "maskDestination", header: "Mask Destination" },
  { accessorKey: "adresseIPNADestination", header: "Adresse IP NAT Destination" },
  {
    accessorKey: "protocole",
    header: () => (
      <>
        Protocole
      </>
    ),
  },
  { accessorKey: "nomService", header: "Nom Service" },
  { accessorKey: "portService", header: "N° Port" },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "dateImplementation",
    header: "Date d'implémentation",
    cell: ({ row }) => (
      <input
        type="text"
        className="border p-2 w-full"
        value={row.original.dateImplementation || ""}
        onChange={(e) => {
          const newValue = e.target.value;
          row.original.dateImplementation = newValue;
        }}
        placeholder="Saisir une date"
      />
    ),
  },
];

export default function FluxPage() {
  const [fluxData, setFluxData] = useState<FluxDataItem[]>([]);
  const [fluxDetails, setFluxDetails] = useState<FluxDetailItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [showDateColumn, setShowDateColumn] = useState(false); // Contrôle de l'affichage de la colonne
  
  // Détermine si l'utilisateur est un validateur
  const isValidator = username === "validateur-test";
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/user");
        if (!res.ok) throw new Error("Non authentifié");
        const data = await res.json();
        setUsername(data.username);

        const now = new Date().toLocaleString();

        setFluxData((prev) => [
          {
            etablissement: "2IR", // Choisissez une valeur par défaut
            demandeur: username || "",
            dateMaj: now,
            objet: "",
          },
        ]);
      } catch (error) {
        console.error("Erreur :", error);
        window.location.href = "/login";
      }
    }
    fetchUser();
  }, []);

  // Définition de la fonction handleFormSubmit
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Récupérer les données du formulaire
    const formData = new FormData(e.currentTarget);
    const newData: Partial<FluxDetailItem> = Object.fromEntries(formData) as Partial<FluxDetailItem>;

    // Validation des champs obligatoires
    if (!newData.etat || !newData.nomDNSSource || !newData.adresseIPSource) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Ajouter les nouvelles données localement
    setFluxDetails((prevDetails) => [
      ...prevDetails,
      { ...newData, numero: prevDetails.length + 1 } as FluxDetailItem,
    ]);

    alert("Nouvelle ligne ajoutée avec succès !");
    e.currentTarget.reset();
  };

  return (
    <div className="p-8">
      {/* Tableau principal */}
      <div className="grid grid-cols-2 gap-4 mb-8">
      <table className="border-collapse border border-gray-300 w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nom de l’établissement</th>
              <th className="border border-gray-300 px-4 py-2">Nom du demandeur</th>
              <th className="border border-gray-300 px-4 py-2">Date de la dernière MAJ</th>
              <th className="border border-gray-300 px-4 py-2">Objet de la demande</th>
            </tr>
          </thead>
          <tbody>
            {fluxData.map((item, idx) => (
              <tr key={idx} className="even:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
  <select
    value={item.etablissement || ""}
    onChange={(e) => {
      const selectedValue = e.target.value;
      setFluxData((prev) =>
        prev.map((data, idx) =>
          idx === idx ? { ...data, etablissement: selectedValue } : data
        )
      );
    }}
    className="border p-2 w-full"
  >
    <option value="">Sélectionner un établissement</option>
    {etablissementOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
</td>
                {/* Colonne pour Nom du demandeur */}
      <td className="border border-gray-300 px-4 py-2">
        <input
          type="text"
          value={item.demandeur}
          onChange={(e) => {
            const newValue = e.target.value;
            setFluxData((prev) =>
              prev.map((data, index) =>
                index === idx ? { ...data, demandeur: newValue } : data
              )
            );
          }}
          placeholder="Saisissez un nom"
          className="border p-2 w-full"
        />
      </td>
                <td className="border border-gray-300 px-4 py-2">{item.dateMaj}</td>
                <td className="border border-gray-300 px-4 py-2">
        <input
          type="text"
          value={item.objet}
          onChange={(e) => {
            const newValue = e.target.value;
            setFluxData((prev) =>
              prev.map((data, index) =>
                index === idx ? { ...data, objet: newValue } : data
              )
            );
          }}
          placeholder="Saisissez l'objet de la demande"
          className="border p-2 w-full"
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
                <input type="text" placeholder="Nom du valideur" className="border p-2 w-full" />
              </td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Approbation</th>
              <td className="border border-gray-300 px-4 py-2">
                <select className="border p-2 w-full">
                  <option value="OUI">OUI</option>
                  <option value="NON">NON</option>
                </select>
              </td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Commentaires</th>
              <td className="border border-gray-300 px-4 py-2">
                <textarea className="border p-2 w-full" rows={3} placeholder="Ajouter des commentaires"></textarea>
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
  {/* Liste déroulante pour État */}
  <td>
    <select name="etat" className="border p-2 w-full">
      <option value="">(Sélectionner tout)</option>
      <option value="AJOUT">AJOUT</option>
      <option value="SUPPRESSION">SUPPRESSION</option>
      <option value="MODIFICATION">MODIFICATION</option>
      <option value="VIDES">(Vides)</option>
    </select>
  </td>

  {/* Liste déroulante pour Nom DNS Source */}
  <td>
    <select name="nomDNSSource" className="border p-2 w-full">
      <option value="">(Sélectionner tout)</option>
      <option value="GRP-OCE_VPNSSL-MFA-Users">GRP-OCE_VPNSSL-MFA-Users</option>
      <option value="ST YVES Oncologie">ST YVES Oncologie</option>
      <option value="VLAN Bloc">VLAN Bloc</option>
      <option value="VLAN Clinique">VLAN Clinique</option>
      <option value="VIDES">(Vides)</option>
    </select>
  </td>

  {/* Liste déroulante pour Adresse IP Source */}

  <td>
    <input type="text" name="adresseIPSource" placeholder="Adresse IP Source" className="border p-2 w-full" />
  </td>

  {/* Champ texte pour Mask Source */}
  <td>
    <input type="text" name="maskSource" placeholder="Mask Source" className="border p-2 w-full" />
  </td>

  {/* Champ texte pour Adresse IP NAT Source */}
  <td>
    <input type="text" name="adresseIPNASource" placeholder="Adresse IP NAT Source" className="border p-2 w-full" />
  </td>

  {/* Champ texte pour Nom DNS Destination */}
  <td>
    <input type="text" name="nomDNSDestination" placeholder="Nom DNS Destination" className="border p-2 w-full" />
  </td>

  {/* Champ texte pour Adresse IP Destination */}
  <td>
    <input type="text" name="adresseIPDestination" placeholder="Adresse IP Destination" className="border p-2 w-full" />
  </td>

  {/* Champ texte pour Mask Destination */}
  <td>
    <input type="text" name="maskDestination" placeholder="Mask Destination" className="border p-2 w-full" />
  </td>

  {/* Champ texte pour Adresse IP NAT Destination */}
  <td>
    <input type="text" name="adresseIPNADestination" placeholder="Adresse IP NAT Destination" className="border p-2 w-full" />
  </td>

  {/* Liste déroulante pour Protocole */}
  <td>
    <select name="protocole" className="border p-2 w-full">
      <option value="">(Sélectionner tout)</option>
      <option value="TCP">TCP</option>
      <option value="UDP">UDP</option>
      <option value="ICMP">ICMP</option>
      <option value="VIDES">(Vides)</option>
    </select>
  </td>

  {/* Champ texte pour Nom Service */}
  <td>
    <input type="text" name="nomService" placeholder="Nom Service" className="border p-2 w-full" />
  </td>

  {/* Champ texte pour N° Port */}
  <td>
    <input type="text" name="portService" placeholder="N° Port" className="border p-2 w-full" />
  </td>

  {/* Champ texte pour Description */}
  <td>
    <input type="text" name="description" placeholder="Description" className="border p-2 w-full" />
  </td>

  {/* Champ texte pour Date d'implémentation */}
  <td>
    <input
      type="text"
      name="dateImplementation"
      placeholder="Saisir une date"
      className="border p-2 w-full"
    />
  </td>
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





