"use client";

import React from "react";


export default function LoginPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Connexion</h1>
      <form>
        <div className="mb-2">
          <label htmlFor="username" className="block font-medium">
            Nom d’utilisateur :
          </label>
          <input
            id="username"
            name="username"
            className="border p-1 w-full"
            type="text"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="password" className="block font-medium">
            Mot de passe :
          </label>
          <input
            id="password"
            name="password"
            className="border p-1 w-full"
            type="password"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Se connecter
        </button>
      </form>
    </div>
  );
}





