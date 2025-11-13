import "./globals.css";

export const metadata = {
  title: "Scierie System",
  description: "Gestion de scierie professionnelle",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased bg-gray-100">{children}</body>
    </html>
  );
}
