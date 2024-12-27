// app/flux/page.tsx

"use client";
import React, { useState, useEffect } from "react";

// (Facultatif) Définissez des types pour vos données si vous utilisez TypeScript
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
  // État pour le tableau principal
  const [fluxData, setFluxData] = useState<FluxDataItem[]>([]);
  // État pour le tableau détaillé
  const [fluxDetails, setFluxDetails] = useState<FluxDetailItem[]>([]);

  // Au montage du composant, on récupère les données via un fetch sur /flux (GET)
  useEffect(() => {
    async function fetchData() {
      try {
        // Appel d'API vers votre route /flux (route handler Next.js)
        const res = await fetch("/flux");
        if (!res.ok) {
          throw new Error(`Erreur de récupération: ${res.status}`);
        }
        // On s'attend à recevoir { fluxData: [...], fluxDetails: [...] }
        const data = await res.json();
        setFluxData(data.fluxData || []);
        setFluxDetails(data.fluxDetails || []);
      } catch (error) {
        console.error("Erreur lors du fetch /flux:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Tableau de Bord des Flux</h1>

      <div className="table-container" style={{ display: "flex", gap: 20 }}>
        {/* Tableau principal */}
        <table className="main-table" border={1}>
          <thead>
            <tr>
              <th>Nom de l'établissement</th>
              <th>Nom du demandeur</th>
              <th>Date de la dernière MAJ</th>
              <th>Objet de la demande</th>
            </tr>
          </thead>
          <tbody>
            {fluxData.map((item, idx) => (
              <tr key={idx}>
                <td>{item.etablissement}</td>
                <td>{item.demandeur}</td>
                <td>{item.dateMaj}</td>
                <td>{item.objet}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tableau additionnel (Valideur / Approbation / Commentaires) */}
        <table className="side-table" border={1}>
          <tbody>
            <tr>
              <th>Nom du valideur</th>
              <td>
                <input type="text" name="valideur" placeholder="Nom du valideur" />
              </td>
            </tr>
            <tr>
              <th>Approbation</th>
              <td>
                <select name="approbation">
                  <option value="">NON/OUI</option>
                  <option value="OUI">OUI</option>
                  <option value="NON">NON</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>Commentaires</th>
              <td>
                <textarea
                  name="commentaires"
                  rows={3}
                  placeholder="Ajouter des commentaires"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      {/* Tableau détaillé en dessous */}
      <table className="detailed-table" border={1}>
        <thead>
          <tr>
            <th rowSpan={2}>N° Flux</th>
            <th colSpan={5}>Source</th>
            <th colSpan={4}>Destination</th>
            <th colSpan={3}>Service</th>
            <th colSpan={2}>Détails</th>
          </tr>
          {/* Complétez ici votre en-tête si besoin */}
        </thead>
        <tbody>
          {fluxDetails.map((detail, idx) => (
            <tr key={idx}>
              <td>{detail.numero}</td>
              <td>{detail.etat}</td>
              <td>{detail.nomDNSSource}</td>
              <td>{detail.adresseIPSource}</td>
              <td>{detail.maskSource}</td>
              <td>{detail.adresseIPNASource}</td>
              <td>{detail.nomDNSDestination}</td>
              <td>{detail.adresseIPDestination}</td>
              <td>{detail.maskDestination}</td>
              <td>{detail.adresseIPNADestination}</td>
              <td>{detail.protocole}</td>
              <td>{detail.nomService}</td>
              <td>{detail.portService}</td>
              <td>{detail.description}</td>
              <td>{detail.dateImplementation}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulaire pour ajouter une nouvelle ligne */}
      <form action="/flux/add-flux-detail" method="POST">
        {/* Ajoutez ici les champs nécessaires */}
        <button type="submit">Ajouter une ligne</button>
      </form>
    </div>
  );
}
