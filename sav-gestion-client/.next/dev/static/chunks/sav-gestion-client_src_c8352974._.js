(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/sav-gestion-client/src/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shared constants and utility functions
 */ __turbopack_context__.s([
    "BRANDS",
    ()=>BRANDS,
    "CATEGORIES",
    ()=>CATEGORIES,
    "CATEGORY_GROUPS",
    ()=>CATEGORY_GROUPS,
    "CATEGORY_ICONS",
    ()=>CATEGORY_ICONS,
    "CATEGORY_LABELS",
    ()=>CATEGORY_LABELS,
    "COMPUTER_CATEGORIES",
    ()=>COMPUTER_CATEGORIES,
    "COMPUTER_PROBLEMS",
    ()=>COMPUTER_PROBLEMS,
    "PRIORITIES",
    ()=>PRIORITIES,
    "PRIORITY_COLORS",
    ()=>PRIORITY_COLORS,
    "PRIORITY_LABELS",
    ()=>PRIORITY_LABELS,
    "STATUSES",
    ()=>STATUSES,
    "STATUS_COLORS",
    ()=>STATUS_COLORS,
    "STATUS_LABELS",
    ()=>STATUS_LABELS,
    "TRANSITIONS",
    ()=>TRANSITIONS,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDate",
    ()=>formatDate,
    "getStatusStep",
    ()=>getStatusStep,
    "validatePhone",
    ()=>validatePhone
]);
const STATUSES = [
    "Received",
    "Diagnostic",
    "In Progress",
    "Completed",
    "Delivered"
];
const STATUS_LABELS = {
    Received: "Reçu",
    Diagnostic: "Diagnostic",
    "In Progress": "En cours",
    Completed: "Terminé",
    Delivered: "Livré"
};
const STATUS_COLORS = {
    Received: {
        bg: "bg-red-100",
        text: "text-red-700",
        dot: "bg-red-500"
    },
    Diagnostic: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        dot: "bg-amber-500"
    },
    "In Progress": {
        bg: "bg-blue-100",
        text: "text-blue-700",
        dot: "bg-blue-500"
    },
    Completed: {
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500"
    },
    Delivered: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400"
    }
};
const PRIORITIES = [
    "Low",
    "Normal",
    "High",
    "Urgent"
];
const PRIORITY_LABELS = {
    Low: "Basse",
    Normal: "Normale",
    High: "Haute",
    Urgent: "Urgente"
};
const PRIORITY_COLORS = {
    Low: {
        bg: "bg-slate-100",
        text: "text-slate-600"
    },
    Normal: {
        bg: "bg-blue-50",
        text: "text-blue-600"
    },
    High: {
        bg: "bg-orange-100",
        text: "text-orange-700"
    },
    Urgent: {
        bg: "bg-red-100",
        text: "text-red-700"
    }
};
const CATEGORIES = [
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
    "Other"
];
const CATEGORY_GROUPS = [
    {
        group: "Imprimante",
        icon: "🖨️",
        items: [
            "Laser Mono - Photocopieur",
            "Laser Mono - MFP",
            "Laser Couleur - Photocopieur",
            "Laser Couleur - MFP",
            "MFP Ink",
            "Matricielle"
        ]
    },
    {
        group: "Informatique",
        icon: "💻",
        items: [
            "Laptop",
            "All In One",
            "PC Bureaux",
            "Serveur",
            "Ecran",
            "Reseau"
        ]
    }
];
const CATEGORY_LABELS = {
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
    Other: "Autre"
};
const CATEGORY_ICONS = {
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
    Other: "wrench"
};
const COMPUTER_CATEGORIES = [
    "Laptop",
    "All In One",
    "PC Bureaux",
    "Serveur"
];
const COMPUTER_PROBLEMS = [
    "Disques durs (HDD / SSD)",
    "Barrettes mémoire (RAM)",
    "Cartes mères",
    "Alimentations",
    "Cartes graphiques",
    "Processeurs",
    "Ventilateurs / Systèmes de refroidissement"
];
const BRANDS = [
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
    "Enigma"
];
const TRANSITIONS = {
    Received: [
        "Diagnostic"
    ],
    Diagnostic: [
        "In Progress",
        "Received",
        "Completed"
    ],
    "In Progress": [
        "Completed",
        "Diagnostic"
    ],
    Completed: [
        "Delivered",
        "In Progress"
    ],
    Delivered: []
};
function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return "—";
    return new Intl.NumberFormat("fr-DZ", {
        style: "currency",
        currency: "DZD",
        minimumFractionDigits: 0
    }).format(amount);
}
function getStatusStep(status) {
    return STATUSES.indexOf(status);
}
function validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-\.]/g, "");
    return /^(\+?\d{10,15})$/.test(cleaned);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sav-gestion-client/src/components/StatusBadge.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/lib/utils.js [app-client] (ecmascript)");
;
;
function StatusBadge({ status, size = "sm" }) {
    const colors = __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATUS_COLORS"][status] || {
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400"
    };
    const label = __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATUS_LABELS"][status] || status;
    const sizeClasses = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center gap-1.5 rounded-full font-semibold ${colors.bg} ${colors.text} ${sizeClasses} transition-colors duration-300`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `w-1.5 h-1.5 rounded-full ${colors.dot} transform transition-transform duration-300`
            }, void 0, false, {
                fileName: "[project]/sav-gestion-client/src/components/StatusBadge.js",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            label
        ]
    }, void 0, true, {
        fileName: "[project]/sav-gestion-client/src/components/StatusBadge.js",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = StatusBadge;
var _c;
__turbopack_context__.k.register(_c, "StatusBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sav-gestion-client/src/components/PriorityBadge.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PriorityBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/lib/utils.js [app-client] (ecmascript)");
;
;
function PriorityBadge({ priority }) {
    const colors = __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRIORITY_COLORS"][priority] || {
        bg: "bg-gray-100",
        text: "text-gray-600"
    };
    const label = __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRIORITY_LABELS"][priority] || priority;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`,
        children: label
    }, void 0, false, {
        fileName: "[project]/sav-gestion-client/src/components/PriorityBadge.js",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = PriorityBadge;
var _c;
__turbopack_context__.k.register(_c, "PriorityBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sav-gestion-client/src/components/LoadingSpinner.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoadingSpinner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function LoadingSpinner({ message = "Chargement..." }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center py-16 gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/sav-gestion-client/src/components/LoadingSpinner.js",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500",
                children: message
            }, void 0, false, {
                fileName: "[project]/sav-gestion-client/src/components/LoadingSpinner.js",
                lineNumber: 5,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/sav-gestion-client/src/components/LoadingSpinner.js",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = LoadingSpinner;
var _c;
__turbopack_context__.k.register(_c, "LoadingSpinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sav-gestion-client/src/components/Icons.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Icon",
    ()=>Icon,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/react-icons/fi/index.mjs [app-client] (ecmascript)");
;
;
;
;
const MAP = {
    laptop: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaLaptop"],
    printer: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiPrinter"],
    server: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiServer"],
    check: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiCheck"],
    search: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiSearch"],
    pencil: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiEdit3"],
    trash: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiTrash2"],
    invoice: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiFileText"],
    shopping: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiShoppingCart"],
    wrench: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiTool"],
    cpu: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiCpu"]
};
function Icon({ name, className = "w-4 h-4 text-current" }) {
    const Comp = MAP[name] || __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaLaptop"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: className
    }, void 0, false, {
        fileName: "[project]/sav-gestion-client/src/components/Icons.js",
        lineNumber: 32,
        columnNumber: 10
    }, this);
}
_c = Icon;
const __TURBOPACK__default__export__ = Icon;
var _c;
__turbopack_context__.k.register(_c, "Icon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/lib/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$AuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/components/AuthProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$StatusBadge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/components/StatusBadge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$PriorityBadge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/components/PriorityBadge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$LoadingSpinner$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/components/LoadingSpinner.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/components/Icons.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function DashboardPage() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$AuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            // Technicians cannot access dashboard
            if (user && user.role !== "admin") {
                router.replace("/tickets");
                return;
            }
            loadStats();
        }
    }["DashboardPage.useEffect"], [
        user
    ]);
    async function loadStats() {
        try {
            setLoading(true);
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStats"])();
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally{
            setLoading(false);
        }
    }
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$LoadingSpinner$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        message: "Chargement du tableau de bord..."
    }, void 0, false, {
        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
        lineNumber: 43,
        columnNumber: 12
    }, this);
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-16",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-500 mb-4",
                    children: [
                        "Erreur: ",
                        error
                    ]
                }, void 0, true, {
                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: loadStats,
                    className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
                    children: "Réessayer"
                }, void 0, false, {
                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
            lineNumber: 47,
            columnNumber: 7
        }, this);
    }
    const statusCards = [
        {
            key: "Received",
            label: "Reçus",
            color: "border-red-500",
            bg: "bg-red-50",
            icon: "📥"
        },
        {
            key: "Diagnostic",
            label: "Diagnostic",
            color: "border-amber-500",
            bg: "bg-amber-50",
            icon: "🔍"
        },
        {
            key: "In Progress",
            label: "En cours",
            color: "border-blue-500",
            bg: "bg-blue-50",
            icon: "🔧"
        },
        {
            key: "Completed",
            label: "Terminés",
            color: "border-green-500",
            bg: "bg-green-50",
            icon: "✅"
        },
        {
            key: "Delivered",
            label: "Livrés",
            color: "border-gray-400",
            bg: "bg-gray-50",
            icon: "📦"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gray-900",
                                children: "Tableau de bord"
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mt-1",
                                children: "Vue d'ensemble de l'activité SAV"
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/new-ticket",
                        className: "inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-4 h-4",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M12 4v16m8-8H4"
                                }, void 0, false, {
                                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            "Nouveau ticket"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "Total actifs",
                        value: stats.total_active,
                        icon: "📊",
                        color: "bg-blue-600"
                    }, void 0, false, {
                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "Aujourd'hui",
                        value: stats.today,
                        icon: "📅",
                        color: "bg-emerald-600"
                    }, void 0, false, {
                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "Urgents",
                        value: stats.by_priority?.Urgent || 0,
                        icon: "🚨",
                        color: "bg-red-600"
                    }, void 0, false, {
                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        title: "Archivés",
                        value: stats.total_archived,
                        icon: "🗄️",
                        color: "bg-gray-600"
                    }, void 0, false, {
                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3",
                children: statusCards.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/tickets?status=${encodeURIComponent(card.key)}`,
                        className: `${card.bg} rounded-xl p-4 border-l-4 ${card.color} hover:shadow-md transition-shadow`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xl",
                                        children: card.icon
                                    }, void 0, false, {
                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-medium text-gray-600 uppercase tracking-wide",
                                        children: card.label
                                    }, void 0, false, {
                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                        lineNumber: 163,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-bold text-gray-900",
                                children: stats.by_status?.[card.key] || 0
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this)
                        ]
                    }, card.key, true, {
                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between px-5 py-4 border-b border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-semibold text-gray-900",
                                        children: "Tickets récents"
                                    }, void 0, false, {
                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                        lineNumber: 177,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/tickets",
                                        className: "text-sm text-blue-600 hover:text-blue-700 font-medium",
                                        children: "Voir tout →"
                                    }, void 0, false, {
                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                        lineNumber: 178,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "divide-y divide-gray-50",
                                children: stats.recent?.length > 0 ? stats.recent.map((ticket)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/tickets/${ticket.ticket_id}`,
                                        className: "flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xl",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    name: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_ICONS"][ticket.hardware_category],
                                                    className: "w-6 h-6 text-slate-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                    lineNumber: 194,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                lineNumber: 193,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-semibold text-gray-900",
                                                                children: ticket.ticket_id
                                                            }, void 0, false, {
                                                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                                lineNumber: 201,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$StatusBadge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                status: ticket.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                                lineNumber: 204,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                        lineNumber: 200,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-500 truncate",
                                                        children: ticket.client_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                        lineNumber: 206,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                lineNumber: 199,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hidden sm:flex flex-col items-end gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$PriorityBadge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        priority: ticket.priority
                                                    }, void 0, false, {
                                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                        lineNumber: 211,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-400",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(ticket.created_at)
                                                    }, void 0, false, {
                                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                        lineNumber: 212,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                lineNumber: 210,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, ticket.ticket_id, true, {
                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                        lineNumber: 188,
                                        columnNumber: 17
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "px-5 py-8 text-center text-gray-400 text-sm",
                                    children: "Aucun ticket pour le moment"
                                }, void 0, false, {
                                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                    lineNumber: 219,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                lineNumber: 185,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-sm border border-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-5 py-4 border-b border-gray-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-semibold text-gray-900",
                                    children: "Par catégorie"
                                }, void 0, false, {
                                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                    lineNumber: 228,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                lineNumber: 227,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-5 space-y-3",
                                children: stats.by_category?.length > 0 ? stats.by_category.map((cat)=>{
                                    const pct = stats.total_active > 0 ? Math.round(cat.count / stats.total_active * 100) : 0;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-gray-700 flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    name: __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_ICONS"][cat.hardware_category],
                                                                    className: "w-5 h-5 text-slate-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                                    lineNumber: 242,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                                lineNumber: 241,
                                                                columnNumber: 25
                                                            }, this),
                                                            __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_LABELS"][cat.hardware_category] || cat.hardware_category
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                        lineNumber: 240,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-semibold text-gray-900",
                                                        children: cat.count
                                                    }, void 0, false, {
                                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                        lineNumber: 250,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                lineNumber: 239,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full bg-gray-100 rounded-full h-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-blue-500 h-2 rounded-full transition-all",
                                                    style: {
                                                        width: `${pct}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                    lineNumber: 255,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                                lineNumber: 254,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, cat.hardware_category, true, {
                                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                        lineNumber: 238,
                                        columnNumber: 19
                                    }, this);
                                }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-center text-gray-400 text-sm py-4",
                                    children: "Pas de données"
                                }, void 0, false, {
                                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                    lineNumber: 264,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                lineNumber: 174,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "SKs5nipr75KW7my/a3pVqku3DrY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$components$2f$AuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DashboardPage;
function SummaryCard({ title, value, icon, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-xl shadow-sm border border-gray-200 p-5",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-medium text-gray-500 uppercase tracking-wider",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                            lineNumber: 280,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-3xl font-bold text-gray-900 mt-1",
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                            lineNumber: 283,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                    lineNumber: 279,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white text-lg`,
                    children: icon
                }, void 0, false, {
                    fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
                    lineNumber: 285,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
            lineNumber: 278,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/sav-gestion-client/src/app/(admin)/dashboard/page.js",
        lineNumber: 277,
        columnNumber: 5
    }, this);
}
_c1 = SummaryCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "DashboardPage");
__turbopack_context__.k.register(_c1, "SummaryCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=sav-gestion-client_src_c8352974._.js.map