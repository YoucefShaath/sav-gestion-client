"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icons";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ToastProvider";

// No need for API_BASE for Next.js API routes

const REQUEST_TYPES = [
  {
    id: "achat",
    label: "Demande d'achat",
    description: "Achat de matériel informatique, consommables ou équipements",
    icon: "shopping",
    color: "purple",
  },
  {
    id: "prestation",
    label: "Demande de prestation",
    description: "Intervention technique, maintenance, installation ou conseil",
    icon: "wrench",
    color: "blue",
  },
];

export default function EntreprisePage() {
  const [step, setStep] = useState(1); // 1=type, 2=info, 3=details, 4=confirm, 5=success
  const [type, setType] = useState("");
  const [form, setForm] = useState({
    company_name: "",
    contact_phone: "",
    contact_email: "",
    description: "",
    urgency: "normal",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field])
      setErrors((p) => {
        const n = { ...p };
        delete n[field];
        return n;
      });
  }

  function validate(s) {
    const errs = {};
    if (s === 1 && !type) errs.type = "Veuillez choisir un type de demande";
    if (s === 2) {
      if (!form.company_name.trim())
        errs.company_name = "Le nom de l'entreprise est obligatoire";
      if (!form.contact_phone.trim())
        errs.contact_phone = "Le téléphone est obligatoire";
      else if (
        !/^[\d\s\-\+\.]{10,15}$/.test(form.contact_phone.replace(/\s/g, ""))
      )
        errs.contact_phone = "Numéro invalide";
      if (!form.contact_email.trim())
        errs.contact_email = "L'email est obligatoire";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email))
        errs.contact_email = "Email invalide";
    }
    if (s === 3 && !form.description.trim())
      errs.description = "La description est obligatoire";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validate(step)) setStep((s) => s + 1);
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 1));
  }

  const [savedId, setSavedId] = useState(null);
  const showToast = useToast();

  async function handleSubmit() {
    if (!validate(3)) {
      setStep(3);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/demande`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      setSavedId(data.id || null);
      setStep(5);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  const typeInfo = REQUEST_TYPES.find((t) => t.id === type);

  if (step === 5) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Demande envoyée !
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Votre {typeInfo?.label?.toLowerCase()} a été transmise à notre
            équipe. Nous vous contacterons dans les plus brefs délais à
            l&apos;adresse <strong>{form.contact_email}</strong>.
          </p>
          {savedId && (
            <div className="mb-4 text-sm text-gray-600">
              Référence de la demande: <strong>#{savedId}</strong>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(String(savedId));
                    showToast({ type: "success", message: "Référence copiée" });
                  } catch (e) {
                    showToast({
                      type: "error",
                      message: "Impossible de copier",
                    });
                  }
                }}
                className="ml-3 px-2 py-1 text-xs bg-gray-100 rounded"
              >
                Copier
              </button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm text-center"
            >
              Retour à l&apos;accueil
            </Link>
            <button
              onClick={() => {
                setStep(1);
                setType("");
                setForm({
                  company_name: "",
                  contact_phone: "",
                  contact_email: "",
                  description: "",
                  urgency: "normal",
                });
              }}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
            >
              Nouvelle demande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0f172a] text-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Informatica Logo"
              className="w-8 h-8 rounded-lg object-cover bg-white"
            />
            <div>
              <h1 className="text-sm font-bold leading-tight">Informatica</h1>
              <p className="text-[10px] text-purple-300">Espace entreprise</p>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm text-blue-200 hover:text-white transition-colors"
          >
            ← Accueil
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Espace Entreprise
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Demande d&apos;achat ou de prestation technique
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center mb-8">
          {["Type", "Entreprise", "Détails", "Confirmation"].map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${step > i + 1 ? "bg-blue-600 border-blue-600 text-white" : step === i + 1 ? "bg-blue-50 border-blue-600 text-blue-600" : "bg-gray-100 border-gray-300 text-gray-400"}`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-medium hidden sm:block ${step >= i + 1 ? "text-blue-600" : "text-gray-400"}`}
                >
                  {s}
                </span>
              </div>
              {i < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${step > i + 1 ? "bg-blue-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          {/* Step 1: Type */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Type de demande
              </h2>
              {errors.type && (
                <p className="text-sm text-red-600 mb-2">{errors.type}</p>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {REQUEST_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setType(t.id);
                      setErrors({});
                    }}
                    className={`p-5 rounded-xl border-2 text-left transition-all
                      ${type === t.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <span className="text-3xl block mb-3 text-slate-600">
                      <Icon name={t.icon} className="w-7 h-7" />
                    </span>
                    <h3
                      className={`font-bold mb-1 ${type === t.id ? "text-blue-700" : "text-gray-900"}`}
                    >
                      {t.label}
                    </h3>
                    <p className="text-xs text-gray-500">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Company info */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informations de l&apos;entreprise
              </h2>
              <Field label="Nom de l'entreprise *" error={errors.company_name}>
                <input
                  value={form.company_name}
                  onChange={(e) => updateField("company_name", e.target.value)}
                  placeholder="Ex: SARL Informatica"
                  className={ic(errors.company_name)}
                />
              </Field>
              <Field label="Téléphone *" error={errors.contact_phone}>
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => updateField("contact_phone", e.target.value)}
                  placeholder="Ex: 0555 12 34 56"
                  className={ic(errors.contact_phone)}
                />
              </Field>
              <Field label="Email *" error={errors.contact_email}>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => updateField("contact_email", e.target.value)}
                  placeholder="Ex: contact@entreprise.com"
                  className={ic(errors.contact_email)}
                />
              </Field>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {type === "achat"
                  ? "Détails de la demande d'achat"
                  : "Détails de la prestation"}
              </h2>
              <Field label="Description détaillée *" error={errors.description}>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={6}
                  placeholder={
                    type === "achat"
                      ? "Décrivez le matériel souhaité (type, quantité, spécifications, budget...)..."
                      : "Décrivez l'intervention souhaitée (type, lieu, date, nombre de postes...)..."
                  }
                  className={ic(errors.description)}
                />
              </Field>
              <Field label="Urgence">
                <div className="flex gap-2 flex-wrap">
                  {[
                    ["normal", "Normale"],
                    ["moyenne", "Moyenne"],
                    ["urgente", "Urgente"],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateField("urgency", v)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                        ${form.urgency === v ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Vérification
              </h2>
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <CR
                  label="Type"
                  value={`${typeInfo?.icon} ${typeInfo?.label}`}
                />
                <hr className="border-gray-200" />
                <CR label="Entreprise" value={form.company_name} />
                <CR label="Téléphone" value={form.contact_phone} />
                <CR label="Email" value={form.contact_email} />
                <hr className="border-gray-200" />
                <CR label="Description" value={form.description} />
                <CR
                  label="Urgence"
                  value={
                    {
                      normal: "Normale",
                      moyenne: "Moyenne",
                      urgente: "Urgente",
                    }[form.urgency]
                  }
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
            {step > 1 ? (
              <button
                onClick={prev}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                ← Précédent
              </button>
            ) : (
              <div />
            )}
            {step < 4 ? (
              <button
                onClick={next}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi...
                  </>
                ) : (
                  "✓ Envoyer la demande"
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer (shared) */}
      <Footer />
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function CR({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="text-sm font-medium text-gray-500 sm:w-28 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-900 flex-1 whitespace-pre-wrap">
        {value}
      </span>
    </div>
  );
}

function ic(hasError) {
  return `w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors outline-none ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  }`;
}
