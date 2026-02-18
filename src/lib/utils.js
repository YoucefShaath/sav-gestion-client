/**
 * Shared constants and utility functions
 */

export const STATUSES = [
  "Received",
  "Diagnostic",
  "In Progress",
  "Completed",
  "Delivered",
];

export const STATUS_LABELS = {
  Received: "Reçu",
  Diagnostic: "Diagnostic",
  "In Progress": "En cours",
  Completed: "Terminé",
  Delivered: "Livré",
};

export const STATUS_COLORS = {
  Received: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  Diagnostic: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  "In Progress": {
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  Completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  Delivered: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

export const PRIORITIES = ["Low", "Normal", "High", "Urgent"];

export const PRIORITY_LABELS = {
  Low: "Basse",
  Normal: "Normale",
  High: "Haute",
  Urgent: "Urgente",
};

export const PRIORITY_COLORS = {
  Low: { bg: "bg-slate-100", text: "text-slate-600" },
  Normal: { bg: "bg-blue-50", text: "text-blue-600" },
  High: { bg: "bg-orange-100", text: "text-orange-700" },
  Urgent: { bg: "bg-red-100", text: "text-red-700" },
};

export const CATEGORIES = [
  "Laser Mono - Photocopieur",
  "Laser Mono - MFP",
  "Laser Couleur - Photocopieur",
  "Laser Couleur - MFP",
  "MFP Ink",
  "Matricielle",
  "Laptop",
  "All In One",
  "PC Bureaux",
  "Serveur",
  "Ecran",
  "Reseau",
  "Other",
];

/** Group categories by family for the picker UI */
export const CATEGORY_GROUPS = [
  {
    group: "Imprimante",
    icon: "🖨️",
    items: [
      "Laser Mono - Photocopieur",
      "Laser Mono - MFP",
      "Laser Couleur - Photocopieur",
      "Laser Couleur - MFP",
      "MFP Ink",
      "Matricielle",
    ],
  },
  {
    group: "Informatique",
    icon: "💻",
    items: ["Laptop", "All In One", "PC Bureaux", "Serveur", "Ecran", "Reseau"],
  },
];

export const CATEGORY_LABELS = {
  "Laser Mono - Photocopieur": "Laser Mono – Photocopieur",
  "Laser Mono - MFP": "Laser Mono – Imprimante MFP",
  "Laser Couleur - Photocopieur": "Laser Couleur – Photocopieur",
  "Laser Couleur - MFP": "Laser Couleur – Imprimante MFP",
  "MFP Ink": "MFP Ink Cartouche / Bouteille",
  Matricielle: "Matricielle",
  Laptop: "Laptop",
  "All In One": "All In One",
  "PC Bureaux": "PC Bureaux",
  Serveur: "Serveur",
  Ecran: "Écran",
  Reseau: "Réseau",
  Other: "Autre",
};

export const CATEGORY_ICONS = {
  "Laser Mono - Photocopieur": "printer",
  "Laser Mono - MFP": "printer",
  "Laser Couleur - Photocopieur": "printer",
  "Laser Couleur - MFP": "printer",
  "MFP Ink": "printer",
  Matricielle: "printer",
  Laptop: "laptop",
  "All In One": "laptop",
  "PC Bureaux": "laptop",
  Serveur: "server",
  Ecran: "laptop",
  Reseau: "server",
  Other: "wrench",
};

/** Categories that count as "computer" for the problem picker */
export const COMPUTER_CATEGORIES = [
  "Laptop",
  "All In One",
  "PC Bureaux",
  "Serveur",
];

export const COMPUTER_PROBLEMS = [
  "Disques durs (HDD / SSD)",
  "Barrettes mémoire (RAM)",
  "Cartes mères",
  "Alimentations",
  "Cartes graphiques",
  "Processeurs",
  "Ventilateurs / Systèmes de refroidissement",
];

export const BRANDS = [
  "HP",
  "Dell",
  "Lenovo",
  "Acer",
  "Toshiba",
  "Epson",
  "Canon",
  "Sharp",
  "Kyocera",
  "Lexmark",
  "Dahua",
  "Tenda",
  "TP-Link",
  "D-Link",
  "TopLink",
  "Enigma",
];

export const TRANSITIONS = {
  Received: ["Diagnostic"],
  Diagnostic: ["In Progress", "Received", "Completed"],
  "In Progress": ["Completed", "Diagnostic"],
  Completed: ["Delivered", "In Progress"],
  Delivered: [],
};

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getStatusStep(status) {
  return STATUSES.indexOf(status);
}

export function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-\.]/g, "");
  return /^(\+?\d{10,15})$/.test(cleaned);
}
