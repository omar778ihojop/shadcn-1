import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token");

  if (!token) {
    // Rediriger vers la page de connexion si non authentifié
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Autoriser l'accès si authentifié
  return NextResponse.next();
}

export const config = {
  matcher: ["/flux"], // Protéger la route /flux
};
