"use client";
import { useState } from "react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isRegister ? "/api/auth/register" : "/api/auth/login";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }

    alert(isRegister ? "Compte créé avec succès !" : "Connexion réussie !");
    if (!isRegister) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          {isRegister ? "Créer un compte" : "Connexion"}
        </h1>

        {isRegister && (
          <>
            <label className="block mb-2 font-medium">Nom complet</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="Entrez votre nom"
              required
            />

            <label className="block mb-2 font-medium">Rôle</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            >
              <option value="EMPLOYEE">Employé</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </>
        )}

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="exemple@mail.com"
          required
        />

        <label className="block mb-2 font-medium">Mot de passe</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="••••••••"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
        >
          {isRegister ? "Créer le compte" : "Se connecter"}
        </button>

        <p className="text-center mt-4 text-sm">
          {isRegister ? (
            <>
              Déjà un compte ?{" "}
              <span
                onClick={() => setIsRegister(false)}
                className="text-blue-600 cursor-pointer"
              >
                Connectez-vous
              </span>
            </>
          ) : (
            <>
              Pas encore de compte ?{" "}
              <span
                onClick={() => setIsRegister(true)}
                className="text-blue-600 cursor-pointer"
              >
                Créez-en un
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
