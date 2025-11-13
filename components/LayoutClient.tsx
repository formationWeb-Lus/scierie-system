"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Bouton menu mobile */}
      <button
        onClick={() => setMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow p-2 rounded-lg text-gray-700"
      >
        <Menu size={24} />
      </button>

      {/* Overlay sombre */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Barre latérale */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md flex flex-col transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="text-2xl font-bold text-blue-700">🪵 Scierie</div>
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink href="/">🏠 Accueil</NavLink>
          <NavLink href="/charges">💰 Charges</NavLink>
          <NavLink href="/expenses">💸 Dépenses</NavLink>
          <NavLink href="/invoices">🧾 Factures</NavLink>
          <NavLink href="/productions">🪚 Productions</NavLink>
          <NavLink href="/reports">📊 Rapports</NavLink>
          <NavLink href="/sales">🛒 Ventes</NavLink>
          <NavLink href="/stock">📦 Stock</NavLink>
          <NavLink href="/settings">⚙️ Paramètres</NavLink>
          <NavLink href="/users">👤 Utilisateurs</NavLink>
        </nav>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Tableau de bord
          </h1>
          <div className="text-gray-600 hidden sm:block">Bonjour 👋</div>
        </header>

        <main className="p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block py-2 px-3 rounded-lg hover:bg-blue-100 text-gray-700 font-medium transition"
    >
      {children}
    </Link>
  );
}
