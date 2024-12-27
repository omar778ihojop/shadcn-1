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
        const res = await fetch("/flux");
        if (!res.ok) {
          throw new Error(`Erreur de récupération: ${res.status}`);
        }
        const data = await res.json();
        setFluxData(data.fluxData || []);
        setFluxDetails(data.fluxDetails || []);
      } catch (error) {
        console.error("Erreur lors du fetch des données :", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Tableau de Bord des Flux</h1>

      {/* Conteneur principal pour deux tableaux côte à côte */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Tableau principal */}
        <table className="border-collapse border border-gray-300 w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nom de l'établissement</th>
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
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">État</th>
            <th className="border border-gray-300 px-4 py-2">Nom DNS</th>
            <th className="border border-gray-300 px-4 py-2">Adresse IP</th>
            <th className="border border-gray-300 px-4 py-2">Mask</th>
            <th className="border border-gray-300 px-4 py-2">Adresse IP NAT</th>
            <th className="border border-gray-300 px-4 py-2">Nom DNS</th>
            <th className="border border-gray-300 px-4 py-2">Adresse IP</th>
            <th className="border border-gray-300 px-4 py-2">Mask</th>
            <th className="border border-gray-300 px-4 py-2">Adresse IP NA</th>
            <th className="border border-gray-300 px-4 py-2">Protocole</th>
            <th className="border border-gray-300 px-4 py-2">Nom</th>
            <th className="border border-gray-300 px-4 py-2">N° Port</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Date d’implémentation</th>
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
      <form action="/flux/add-flux-detail" method="POST" className="mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter une ligne
        </button>
      </form>
    </div>
  );
}
