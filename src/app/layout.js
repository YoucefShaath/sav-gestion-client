import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "SAV Manager — Gestion Après-Vente",
  description: "Système de gestion des réparations et du service après-vente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
