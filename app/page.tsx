"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Key } from "lucide-react"; // Icônes professionnelles

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur de connexion");
      setLoading(false);
      return;
    }

    // On stocke le token dans les cookies
    document.cookie = `token=${data.token}; path=/; max-age=604800`;

    // Redirection selon le rôle
    if (data.user.role === "ADMIN") router.push("/dashboard/admin");
    else if (data.user.role === "MANAGER") router.push("/dashboard/manager");
    else router.push("/dashboard/employee");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        {/* Icône principale du service */}
        <div className="flex justify-center mb-4">
          <Key className="text-blue-600 w-12 h-12" />
        </div>

        {/* Titres professionnels */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-blue-700">
          Bienvenue sur ScieriePro
        </h1>
        <h2 className="text-md sm:text-lg text-gray-700 mb-6">
          🔐 Veuillez vous connecter pour accéder à votre tableau de bord sécurisé
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Ce portail est strictement réservé aux utilisateurs autorisés. Merci de saisir vos informations de connexion.
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold rounded-lg py-2 hover:bg-blue-700 transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-4">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-blue-600 font-semibold hover:underline">
            Créer un compte
          </a>
        </p>

        {/* Icônes secondaires pour le service */}
        <div className="flex justify-center gap-4 mt-6">
          <User className="w-6 h-6 text-gray-400" />
          <Lock className="w-6 h-6 text-gray-400" />
          <Key className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
