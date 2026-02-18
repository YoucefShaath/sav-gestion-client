"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  CATEGORY_GROUPS,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  BRANDS,
  COMPUTER_CATEGORIES,
  COMPUTER_PROBLEMS,
} from "@/lib/utils";
import { getModelSuggestions } from "@/lib/api";
import Icon from "@/components/Icons";

/**
 * DeviceStep — Step 2 of ticket creation.
 * Category picker (grouped, with "Other"), brand selector (with "Other"),
 * model with autocomplete, serial number with barcode scanner support.
 */
export default function DeviceStep({
  form,
  updateField,
  errors,
  ic,
  customCategory,
  setCustomCategory,
  customBrand,
  setCustomBrand,
}) {
  const [modelQuery, setModelQuery] = useState(form.model || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scanFocused, setScanFocused] = useState(false);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  const isOtherCategory = form.hardware_category === "__other__";
  const isOtherBrand = form.brand === "__other__";

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Model autocomplete
  const fetchSuggestions = useCallback(
    async (q) => {
      if (q.length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        const cat =
          form.hardware_category === "__other__"
            ? customCategory
            : form.hardware_category;
        const results = await getModelSuggestions(q, cat);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    },
    [form.hardware_category, customCategory],
  );

  function handleModelChange(value) {
    setModelQuery(value);
    updateField("model", value);
    // Debounce autocomplete
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 250);
  }

  function pickSuggestion(s) {
    if (s.brand) updateField("brand", s.brand);
    if (s.model) {
      updateField("model", s.model);
      setModelQuery(s.model);
    }
    setShowSuggestions(false);
  }

  // Get the display label for the category
  function getCategoryDisplay() {
    if (isOtherCategory) return customCategory || "Autre (personnalisé)";
    return CATEGORY_LABELS[form.hardware_category] || form.hardware_category;
  }

  function getBrandDisplay() {
    if (isOtherBrand) return customBrand || "";
    return form.brand;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Informations du matériel
      </h2>

      {/* ── Category Picker ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catégorie *
        </label>
        {errors.hardware_category && (
          <p className="mb-2 text-sm text-red-600">
            {errors.hardware_category}
          </p>
        )}

        <div className="space-y-4">
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.group}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>{group.icon}</span> {group.group}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {group.items.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      updateField("hardware_category", cat);
                      setCustomCategory("");
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition-all text-xs sm:text-sm font-medium leading-tight flex flex-col items-center gap-2 h-24 overflow-hidden
                      ${
                        form.hardware_category === cat
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                  >
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-white/50 text-slate-600 shadow-sm">
                      <Icon name={CATEGORY_ICONS[cat]} className="w-6 h-6" />
                    </span>
                    <span className="mt-2 text-sm text-center leading-tight break-words whitespace-normal">
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Other category button + input */}
          <div>
            <button
              type="button"
              onClick={() => updateField("hardware_category", "__other__")}
              className={`w-full p-2.5 rounded-xl border-2 text-center transition-transform transform hover:-translate-y-0.5 duration-150 text-sm font-medium
                ${
                  isOtherCategory
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-dashed border-gray-300 hover:border-gray-400 text-gray-500"
                }`}
            >
              <span className="inline-flex items-center gap-2 justify-center">
                <Icon name="pencil" className="w-4 h-4" />
                Autre catégorie...
              </span>
            </button>
            {isOtherCategory && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Entrez la catégorie..."
                className={`mt-2 ${ic()}`}
                autoFocus
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Brand Picker ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Marque *
        </label>
        {errors.brand && (
          <p className="mb-2 text-sm text-red-600">{errors.brand}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => {
                updateField("brand", b);
                setCustomBrand("");
              }}
              className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all
                ${
                  form.brand === b
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
            >
              {b}
            </button>
          ))}
          <button
            type="button"
            onClick={() => updateField("brand", "__other__")}
            className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all
              ${
                isOtherBrand
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-dashed border-gray-300 hover:border-gray-400 text-gray-500"
              }`}
          >
            ✏️ Autre
          </button>
        </div>
        {isOtherBrand && (
          <input
            type="text"
            value={customBrand}
            onChange={(e) => setCustomBrand(e.target.value)}
            placeholder="Entrez la marque..."
            className={`mt-2 ${ic()}`}
            autoFocus
          />
        )}
      </div>

      {/* ── Reference ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Référence
        </label>
        <input
          type="text"
          value={form.reference || ""}
          onChange={(e) => updateField("reference", e.target.value)}
          placeholder="Ex: CF258A, TN-2420..."
          className={ic()}
        />
      </div>

      {/* ── Model with autocomplete ── */}
      <div className="relative" ref={suggestionsRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Modèle
        </label>
        <input
          type="text"
          value={modelQuery}
          onChange={(e) => handleModelChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Ex: XPS 15, LaserJet Pro M404..."
          className={ic()}
          autoComplete="off"
        />
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-48 overflow-y-auto transition-opacity duration-150">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pickSuggestion(s)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 transform hover:translate-x-0.5"
              >
                <span className="text-gray-400">
                  <Icon name="search" className="w-4 h-4" />
                </span>
                <span className="font-medium text-gray-800">
                  {s.brand} {s.model}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Serial Number with barcode scan indicator ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
          Numéro de série
          <span className="text-xs text-gray-400 font-normal flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
            Compatible douchette
          </span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={form.serial_number}
            onChange={(e) => updateField("serial_number", e.target.value)}
            onFocus={() => setScanFocused(true)}
            onBlur={() => setScanFocused(false)}
            placeholder="Scanner ou taper le numéro de série..."
            className={`${ic()} ${scanFocused ? "!border-emerald-500 !ring-2 !ring-emerald-100" : ""}`}
            autoComplete="off"
          />
          {scanFocused && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium">Prêt à scanner</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Get the actual category value to send to the API.
 * Resolves `__other__` to the custom text.
 */
export function resolveCategory(form, customCategory) {
  if (form.hardware_category === "__other__") return customCategory || "Other";
  return form.hardware_category;
}

/**
 * Get the actual brand value to send to the API.
 */
export function resolveBrand(form, customBrand) {
  if (form.brand === "__other__") return customBrand || "";
  return form.brand;
}

/**
 * ProblemStep — Step 3. For computer categories, show predefined problems.
 */
export function ProblemStep({ form, updateField, errors, ic }) {
  const isComputer = COMPUTER_CATEGORIES.includes(form.hardware_category);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [customProblem, setCustomProblem] = useState("");
  const [showOther, setShowOther] = useState(false);

  // Sync selected problems to problem_description
  useEffect(() => {
    if (isComputer) {
      const parts = [...selectedProblems];
      if (customProblem.trim()) parts.push(customProblem.trim());
      updateField("problem_description", parts.join(", "));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProblems, customProblem, isComputer]);

  function toggleProblem(p) {
    setSelectedProblems((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Description du problème
      </h2>

      {isComputer ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de panne *{" "}
              <span className="text-xs text-gray-400 font-normal">
                (sélection multiple)
              </span>
            </label>
            {errors.problem_description && (
              <p className="mb-2 text-sm text-red-600">
                {errors.problem_description}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMPUTER_PROBLEMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleProblem(p)}
                  className={`p-3 rounded-xl border-2 text-left transition-all text-sm font-medium flex items-center gap-2
                    ${
                      selectedProblems.includes(p)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                >
                  <span
                    className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-xs border-2 transition-colors
                      ${
                        selectedProblems.includes(p)
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300"
                      }`}
                  >
                    {selectedProblems.includes(p) && "✓"}
                  </span>
                  {p}
                </button>
              ))}

              {/* Other problem */}
              <button
                type="button"
                onClick={() => setShowOther(!showOther)}
                className={`p-3 rounded-xl border-2 text-left transition-all text-sm font-medium flex items-center gap-2
                  ${
                    showOther
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-dashed border-gray-300 hover:border-gray-400 text-gray-500"
                  }`}
              >
                <span
                  className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-xs border-2 transition-colors
                    ${showOther ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"}`}
                >
                  {showOther && "✓"}
                </span>
                ✏️ Autre problème...
              </button>
            </div>
            {showOther && (
              <textarea
                value={customProblem}
                onChange={(e) => setCustomProblem(e.target.value)}
                rows={3}
                placeholder="Décrivez le problème..."
                className={`mt-3 ${ic()}`}
                autoFocus
              />
            )}
          </div>
        </>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description de la panne *
          </label>
          {errors.problem_description && (
            <p className="mb-2 text-sm text-red-600">
              {errors.problem_description}
            </p>
          )}
          <textarea
            value={form.problem_description}
            onChange={(e) => updateField("problem_description", e.target.value)}
            rows={5}
            placeholder="Décrivez le problème en détail..."
            className={ic(errors.problem_description)}
          />
        </div>
      )}
    </div>
  );
}
