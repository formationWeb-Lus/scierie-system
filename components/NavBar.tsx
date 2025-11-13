export default function Navbar() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Scierie System</h1>
      <nav>
        <ul className="flex gap-4">
          <li><a href="/" className="hover:text-blue-600">Accueil</a></li>
          <li><a href="/charges" className="hover:text-blue-600">Charges</a></li>
          <li><a href="/productions" className="hover:text-blue-600">Productions</a></li>
          <li><a href="/sales" className="hover:text-blue-600">Ventes</a></li>
        </ul>
      </nav>
    </header>
  );
}
