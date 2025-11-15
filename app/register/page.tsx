"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Briefcase } from "lucide-react"; // Icônes professionnelles

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de l’inscription");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        {/* Icône principale */}
        <div className="flex justify-center mb-4">
          <Briefcase className="text-green-600 w-12 h-12" />
        </div>

        {/* Titres professionnels */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-green-700">
          Bienvenue sur ScieriePro
        </h1>
        <h2 className="text-md sm:text-lg text-gray-700 mb-6">
          🧍 Créez un compte sécurisé pour accéder à toutes les fonctionnalités
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Remplissez le formulaire ci-dessous avec vos informations professionnelles. Tous les champs sont obligatoires.
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nom complet"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
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
              className="border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
            />
          </div>

          <div className="relative">
            <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
            >
              <option value="EMPLOYEE">Employé</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white font-semibold rounded-lg py-2 hover:bg-green-700 transition"
          >
            {loading ? "Création..." : "Créer un compte"}
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-4">
          Déjà un compte ?{" "}
          <a href="/" className="text-green-600 font-semibold hover:underline">
            Se connecter
          </a>
        </p>

        {/* Icônes professionnelles secondaires */}
        <div className="flex justify-center gap-4 mt-6">
          <User className="w-6 h-6 text-gray-400" />
          <Mail className="w-6 h-6 text-gray-400" />
          <Lock className="w-6 h-6 text-gray-400" />
          <Briefcase className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
