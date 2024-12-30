"use client";
import React, { useState, useEffect } from "react";

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

export default function FluxPage() {
  const [fluxData, setFluxData] = useState<FluxDataItem[]>([]);
  const [fluxDetails, setFluxDetails] = useState<FluxDetailItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/flux/data");
        if (!res.ok) {
          throw new Error(`Erreur de récupération: ${res.status}`);
        }
    
        const data = await res.json();
        setFluxDetails(data.fluxDetails || []); // Charger les données dans le tableau
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
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Tableau principal */}
        <table className="border-collapse border border-gray-300 w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nom de l&apos;établissement</th>
              <th className="border border-gray-300 px-4 py-2">Nom du demandeur</th>
              <th className="border border-gray-300 px-4 py-2">Date de la dernière MAJ</th>
              <th className="border border-gray-300 px-4 py-2">Objet de la demande</th>
            </tr>
          </thead>
          <tbody>
            {fluxData.map((item, idx) => (
              <tr key={idx} className="even:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{item.etablissement}</td>
                <td className="border border-gray-300 px-4 py-2">{item.demandeur}</td>
                <td className="border border-gray-300 px-4 py-2">{item.dateMaj}</td>
                <td className="border border-gray-300 px-4 py-2">{item.objet}</td>
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

      {/* Tableau détaillé */}
      <table className="border-collapse border border-gray-300 w-full">
        <thead className="bg-gray-200">
          <tr>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">N° Flux</th>
            <th colSpan={5} className="border border-gray-300 px-4 py-2">Source</th>
            <th colSpan={4} className="border border-gray-300 px-4 py-2">Destination</th>
            <th colSpan={3} className="border border-gray-300 px-4 py-2">Service</th>
            <th colSpan={2} className="border border-gray-300 px-4 py-2">Détails</th>
          </tr>
          <tr>
                {/* <!-- Sous-colonnes pour Source avec listes déroulantes --> */}
                <th>
                    État
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="AJOUT">AJOUT</option>
                        <option value="SUPPRESSION">SUPPRESSION</option>
                        <option value="MODIFICATION">MODIFICATION</option>
                        <option value="Derouler liste">Dérouler liste</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                <th>
                    Nom DNS
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="GRP-OCE_VPNSSL-MFA-Users (10.110.30.0/24)GRP-OCE_VPNSSL-MFA-IT (10.110.250.0/24)GRP-OCE_VPNSSL-CABINET (10.110.32.0/24)GRP-OCE_VPNSSL-MFA-Cabinets (10.110.32.0/24)">GRP-OCE_VPNSSL-MFA-Users (10.110.30.0/24)GRP-OCE_VPNSSL-MFA-IT (10.110.250.0/24)GRP-OCE_VPNSSL-CABINET (10.110.32.0/24)GRP-OCE_VPNSSL-MFA-Cabinets (10.110.32.0/24)</option>
                        <option value="ST YVES Oncologie (À vérifier si naté)">ST YVES Oncologie (À vérifier si naté)</option>
                        <option value="VLAN Bloc">VLAN Bloc</option>
                        <option value="VLAN Clinique">VLAN Clinique</option>
                        <option value="VLAN Soins">VLAN Soins</option>
                        <option value="WLAN Administratif">WLAN Administratif</option>
                        <option value="WLAN clinique">WLAN clinique</option>
                        <option value="WLAN Old Lan">WLAN Old Lan</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                <th>
                    Adresse IP
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="10.145.28.0">10.145.28.0</option>
                        <option value="10.145.29.0">10.145.29.0</option>
                        <option value="10.145.30.0">10.145.30.0</option>
                        <option value="10.145.80.0">10.145.80.0</option>
                        <option value="10.145.83.0">10.145.83.0</option>
                        <option value="192.168.10">192.168.10</option>
                        <option value="192.168.56.0">192.168.56.0</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                <th>
                    Mask
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                <th>
                    Adresse IP NAT
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                {/* <!-- Sous-colonnes pour Destination --> */}
                <th>
                    Nom DNS
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="AZU-AP-V189">AZU-AP-V189</option>
                        <option value="portail.elsan.care">portail.elsan.care</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                <th>
                    Adresse IP
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="10.242.23.15">10.242.23.15</option>
                        <option value="10.242.42.70">10.242.42.70</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                <th>
                    Mask
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                <th>
                    Adresse IP NA
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                {/* <!-- Sous-colonnes pour Service --> */}
                <th>
                    Protocole
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="TCP">TCP</option>
                        <option value="UDP">UDP</option>
                        <option value="ICMP">ICMP</option>
                        <option value="TCP/UDP">TCP/UDP</option>
                        <option value="TCP/ICMP">TCP/ICMP</option>
                        <option value="UDP/ICMP">UDP/ICMP</option>
                        <option value="TCP/UDP/ICMP">TCP/UDP/ICMP</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                <th>
                    Nom
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="HTTPS">HTTPS</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                <th>
                    N° Port
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="443">443</option>
                        <option value="80">80</option>

                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                {/* <!-- Sous-colonnes pour Détails --> */}
                <th>
                    Description
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
                <th>
                    Date d’implémentation
                    <select>
                        <option value="">(Sélectionner tout)</option>
                        <option value="21/10/2024">21/10/2024</option>
                        <option value="Vides">(Vides)</option>
                    </select>
                </th>
            </tr>
        </thead>
        <tbody>
          {fluxDetails.map((detail, idx) => (
            <tr key={idx} className="even:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{detail.numero}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.etat}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.nomDNSSource}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.adresseIPSource}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.maskSource}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.adresseIPNASource}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.nomDNSDestination}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.adresseIPDestination}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.maskDestination}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.adresseIPNADestination}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.protocole}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.nomService}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.portService}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.description}</td>
              <td className="border border-gray-300 px-4 py-2">{detail.dateImplementation}</td>
            </tr>
          ))}
        </tbody>
      </table>

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





