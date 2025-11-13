"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Package,
  Factory,
  DollarSign,
  FileText,
  BarChart2,
  Settings,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // liste de routes/labels/icônes centralisée
  const navItems: { href: string; label: string; icon: React.ReactNode }[] = [
    { href: "/", label: "Accueil", icon: <Home size={16} /> },
    { href: "/sales", label: "sales", icon: <ShoppingCart size={16} /> },
    { href: "/stock", label: "Stock", icon: <Package size={16} /> },
    { href: "/production", label: "Production", icon: <Factory size={16} /> },
    { href: "/expenses", label: "Dépenses", icon: <DollarSign size={16} /> },
    { href: "/charges", label: "Charges", icon: <Settings size={16} /> },
    { href: "/invoices", label: "Factures", icon: <FileText size={16} /> },
    { href: "/reports", label: "Rapports", icon: <BarChart2 size={16} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-blue-800 text-white flex items-center justify-between px-4 py-3 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* bouton hamburger mobile */}
          <button
            className="lg:hidden p-2 rounded hover:bg-blue-700 transition"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Ouvrir le menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* logo / titre */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪵</span>
            <h1 className="text-lg sm:text-xl font-bold">ScieriePro</h1>
          </div>
        </div>

        {/* menu horizontal (grand écran) */}
        <nav className="hidden lg:flex lg:items-center lg:space-x-6">
          {navItems.slice(0, 3).map((it) => (
            <NavAnchor key={it.href} href={it.href} label={it.label} pathname={pathname} />
          ))}
        </nav>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR (desktop) */}
        <aside className="hidden lg:flex flex-col w-64 bg-blue-900 text-gray-100 py-6 shadow-lg">
          <div className="px-4 mb-4">
            <div className="text-2xl font-bold">🪵 Scierie</div>
            <div className="text-xs text-blue-200 mt-1">Gestion & Production</div>
          </div>

          <nav className="flex-1 px-2">
            {navItems.map((it) => (
              <MenuLink
                key={it.href}
                href={it.href}
                icon={it.icon}
                text={it.label}
                active={pathname === it.href}
              />
            ))}
          </nav>

          <div className="px-4 py-4 text-xs text-blue-200 border-t border-blue-800">
            © {new Date().getFullYear()} ScieriePro
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 flex flex-col">
          {/* MOBILE SLIDE-IN MENU (overlay) */}
          {menuOpen && (
            <div
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden
            >
              <div className="absolute inset-0 bg-black/40" />
              <aside
                className="absolute left-0 top-0 w-64 h-full bg-blue-900 text-gray-100 p-4 shadow-lg transform animate-slideIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4">
                  <div className="text-2xl font-bold">🪵 Scierie</div>
                  <div className="text-xs text-blue-200 mt-1">Menu</div>
                </div>

                <nav className="flex flex-col gap-2">
                  {navItems.map((it) => (
                    <a
                      key={it.href}
                      href={it.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                        pathname === it.href ? "bg-blue-700 font-semibold" : "hover:bg-blue-800/80"
                      }`}
                    >
                      {it.icon}
                      <span>{it.label}</span>
                    </a>
                  ))}
                </nav>

                <div className="mt-auto text-sm text-blue-200 pt-6">© {new Date().getFullYear()}</div>
              </aside>
            </div>
          )}

          {/* page content area */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">{children}</div>

          {/* FOOTER (inside content column so it stays under content) */}
          <footer className="bg-white shadow-inner text-center py-3 text-gray-600 text-sm">
            © {new Date().getFullYear()} ScieriePro — Tous droits réservés.
          </footer>
        </main>
      </div>
    </div>
  );
}

/* Petit composant pour lien de menu dans la sidebar (desktop) */
function MenuLink({ href, icon, text, active }: { href: string; icon: React.ReactNode; text: string; active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${active ? "bg-blue-700 font-semibold" : "hover:bg-blue-800/80"}`}>
      <span className="text-blue-100">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}

/* NavAnchor (pour menu horizontal) */
function NavAnchor({ href, label, pathname }: { href: string; label: string; pathname: string | null }) {
  const active = pathname === href;
  return (
    <Link href={href} className={`text-sm ${active ? "text-yellow-300 font-semibold" : "text-white/90 hover:text-white"}`}>
      {label}
    </Link>
  );
}
