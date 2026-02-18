export const metadata = {
  title: "Suivi de réparation — Informatica",
  description: "Suivez l'état de votre réparation en temps réel",
};

/**
 * Separate layout for /track/* pages — no sidebar, public view.
 */
export default function TrackLayout({ children }) {
  return <div className="bg-gray-50 min-h-screen">{children}</div>;
}
