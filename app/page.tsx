"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-blue-700">
          🪵 Scierie
        </h1>
        <h2 className="text-lg sm:text-xl text-gray-700 mb-6">
          🔐 Connexion au système de scierie
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

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
      </div>
    </div>
  );
}
