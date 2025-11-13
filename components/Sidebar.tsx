import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-lg font-bold mb-6">Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/" className="hover:text-blue-400">Accueil</Link>
        </li>
        <li>
          <Link href="/charges" className="hover:text-blue-400">Charges</Link>
        </li>
        <li>
          <Link href="/productions" className="hover:text-blue-400">Productions</Link>
        </li>
        <li>
          <Link href="/sales" className="hover:text-blue-400">Ventes</Link>
        </li>
        <li>
          <Link href="/expenses" className="hover:text-blue-400">Dépenses</Link>
        </li>
        <li>
          <Link href="/stock" className="hover:text-blue-400">Stock</Link>
        </li>
        <li>
          <Link href="/invoices" className="hover:text-blue-400">Factures</Link>
        </li>
      </ul>
    </aside>
  );
}
