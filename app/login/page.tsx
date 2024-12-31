"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button"; // Assurez-vous que le chemin correspond
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/flux"); // Rediriger vers /flux si authentifié
      } else {
        alert("Nom d'utilisateur ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <div className="p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d’utilisateur :</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    id="username"
                    className="border p-1 w-full rounded"
                    placeholder="Entrez votre nom d'utilisateur"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe :</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    id="password"
                    type="password"
                    className="border p-1 w-full rounded"
                    placeholder="Entrez votre mot de passe"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Utilisation du composant Button */}
          <Button type="submit" variant="default" size="lg">
            Se connecter
          </Button>
        </form>
      </Form>
    </div>
  );
}





