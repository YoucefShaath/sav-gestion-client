module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/sav-gestion-client/src/lib/api.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "archiveTicket",
    ()=>archiveTicket,
    "createTicket",
    ()=>createTicket,
    "deleteTicket",
    ()=>deleteTicket,
    "getArchives",
    ()=>getArchives,
    "getModelSuggestions",
    ()=>getModelSuggestions,
    "getPublicStatus",
    ()=>getPublicStatus,
    "getStats",
    ()=>getStats,
    "getTicket",
    ()=>getTicket,
    "getTickets",
    ()=>getTickets,
    "updateTicket",
    ()=>updateTicket,
    "updateTicketStatus",
    ()=>updateTicketStatus
]);
/**
 * API Client for SAV Backend
 * All calls to the PHP API go through here.
 */ // No need for API_BASE for Next.js API routes
async function request(endpoint, options = {}) {
    // Remove .php and use /api/ route
    let url = endpoint;
    if (url.endsWith(".php")) url = url.replace(".php", "");
    if (!url.startsWith("/api/")) url = "/api/" + url;
    const config = {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    };
    const res = await fetch(url, config);
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (e) {
        data = {};
    }
    if (!res.ok) {
        const error = new Error(data.error || data.errors?.join(", ") || "Erreur API");
        error.status = res.status;
        error.data = data;
        throw error;
    }
    return data;
}
async function getTickets(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`tickets${query ? `?${query}` : ""}`);
}
async function getTicket(id) {
    return request(`tickets?id=${encodeURIComponent(id)}`);
}
async function createTicket(data) {
    return request("tickets", {
        method: "POST",
        body: JSON.stringify(data)
    });
}
async function updateTicket(id, data) {
    return request(`tickets?id=${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });
}
async function updateTicketStatus(id, data) {
    return request(`tickets?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}
async function deleteTicket(id) {
    return request(`tickets?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
}
async function getArchives(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`archives${query ? `?${query}` : ""}`);
}
async function archiveTicket(id) {
    return request(`archives?id=${encodeURIComponent(id)}`, {
        method: "POST"
    });
}
async function getStats() {
    return request("stats");
}
async function getPublicStatus(id) {
    return request(`status?id=${encodeURIComponent(id)}`);
}
async function getModelSuggestions(query, category = "") {
    const params = new URLSearchParams({
        q: query
    });
    if (category) params.set("category", category);
    return request(`suggestions?${params.toString()}`);
}
}),
"[project]/sav-gestion-client/src/lib/auth.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUser",
    ()=>getUser,
    "isAuthenticated",
    ()=>isAuthenticated,
    "loginTechnician",
    ()=>loginTechnician,
    "logout",
    ()=>logout,
    "lookupTicketById",
    ()=>lookupTicketById,
    "lookupTicketsByPhone",
    ()=>lookupTicketsByPhone
]);
/**
 * Auth API + helpers
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/lib/api.js [app-ssr] (ecmascript)");
;
async function loginTechnician(username, password) {
    const res = await fetch(`/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Erreur de connexion");
    }
    // Store session
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return data;
}
function logout() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function isAuthenticated() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
function getUser() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
async function lookupTicketsByPhone(phone) {
    const res = await fetch(`/api/tickets?search=${encodeURIComponent(phone)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur");
    return data.data || data;
}
async function lookupTicketById(ticketId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPublicStatus"])(ticketId);
}
}),
"[project]/sav-gestion-client/src/components/AuthProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/src/lib/auth.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [checked, setChecked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setUser((0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAuthenticated"])() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUser"])() : null);
        setChecked(true);
    }, []);
    function login(userData) {
        setUser(userData);
    }
    function logout() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logout"])();
        setUser(null);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            checked,
            login,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/sav-gestion-client/src/components/AuthProvider.js",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
}),
"[project]/sav-gestion-client/src/components/ToastProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useConfirm",
    ()=>useConfirm,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sav-gestion-client/node_modules/react-icons/fi/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function ToastProvider({ children }) {
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [confirmState, setConfirmState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(({ type = "info", title, message, duration = 4000 })=>{
        const id = Date.now() + Math.random();
        setToasts((s)=>[
                ...s,
                {
                    id,
                    type,
                    title,
                    message
                }
            ]);
        setTimeout(()=>setToasts((s)=>s.filter((t)=>t.id !== id)), duration);
    }, []);
    const confirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(({ title = "Confirmer", message = "", confirmText = "Confirmer", cancelText = "Annuler", danger = false } = {})=>{
        return new Promise((resolve)=>{
            setConfirmState({
                title,
                message,
                confirmText,
                cancelText,
                danger,
                resolve
            });
        });
    }, []);
    const handleConfirm = (value)=>{
        if (confirmState?.resolve) confirmState.resolve(value);
        setConfirmState(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: {
            showToast,
            confirm
        },
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full",
                children: toasts.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `w-full flex items-start gap-3 p-3 rounded-lg shadow-lg border ${t.type === "success" ? "bg-emerald-50 border-emerald-100" : t.type === "error" ? "bg-red-50 border-red-100" : "bg-sky-50 border-sky-100"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-0.5 text-xl text-current",
                                children: t.type === "success" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FiCheckCircle"], {
                                    className: "text-emerald-600"
                                }, void 0, false, {
                                    fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                    lineNumber: 76,
                                    columnNumber: 17
                                }, this) : t.type === "error" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FiXCircle"], {
                                    className: "text-red-600"
                                }, void 0, false, {
                                    fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                    lineNumber: 78,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FiInfo"], {
                                    className: "text-sky-600"
                                }, void 0, false, {
                                    fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                    lineNumber: 80,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 text-sm",
                                children: [
                                    t.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-semibold text-gray-800",
                                        children: t.title
                                    }, void 0, false, {
                                        fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                        lineNumber: 85,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-gray-700 mt-0.5 whitespace-pre-wrap",
                                        children: t.message
                                    }, void 0, false, {
                                        fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                        lineNumber: 87,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setToasts((s)=>s.filter((x)=>x.id !== t.id)),
                                className: "text-gray-400 hover:text-gray-600",
                                "aria-label": "Close notification",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FiX"], {}, void 0, false, {
                                    fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                    lineNumber: 96,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        ]
                    }, t.id, true, {
                        fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            confirmState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/40",
                        onClick: ()=>handleConfirm(false)
                    }, void 0, false, {
                        fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow-xl p-6 z-10 max-w-lg w-full mx-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-900",
                                children: confirmState.title
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 mt-2",
                                children: confirmState.message
                            }, void 0, false, {
                                fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                lineNumber: 113,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex justify-end gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleConfirm(false),
                                        className: "px-4 py-2 rounded-lg bg-gray-100 text-sm text-gray-700",
                                        children: confirmState.cancelText
                                    }, void 0, false, {
                                        fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                        lineNumber: 115,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleConfirm(true),
                                        className: `px-4 py-2 rounded-lg text-sm font-medium ${confirmState.danger ? "bg-red-600 text-white" : "bg-blue-600 text-white"}`,
                                        children: confirmState.confirmText
                                    }, void 0, false, {
                                        fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
                lineNumber: 104,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/sav-gestion-client/src/components/ToastProvider.js",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
function useToast() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx.showToast;
}
function useConfirm() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sav$2d$gestion$2d$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!ctx) throw new Error("useConfirm must be used within ToastProvider");
    return ctx.confirm;
}
const __TURBOPACK__default__export__ = ToastProvider;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a7cd964b._.js.map