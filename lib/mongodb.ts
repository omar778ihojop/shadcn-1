declare global {
    var _mongoClientPromise: Promise<MongoClient>;
  }

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Veuillez définir MONGODB_URI dans votre fichier .env.local");
}

if (process.env.NODE_ENV === "development") {
  // En développement, réutiliser la connexion existante pour éviter les fuites
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // En production, créer une nouvelle connexion
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
