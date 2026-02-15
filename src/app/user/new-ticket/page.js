"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTicket } from "@/lib/api";
import {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  validatePhone,
} from "@/lib/utils";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import DeviceStep, {
  ProblemStep,
  resolveCategory,
  resolveBrand,
} from "@/components/DeviceStep";

const STEPS = [
  { id: 1, title: "Client", description: "Informations du client" },
  { id: 2, title: "Matériel", description: "Détails du matériel" },
  { id: 3, title: "Problème", description: "Description de la panne" },
  { id: 4, title: "Confirmation", description: "Vérification et création" },
];

const INITIAL_FORM = {
  client_name: "",
  client_phone: "",
  client_email: "",
  hardware_category: "",
  brand: "",
  model: "",
  reference: "",
  serial_number: "",
  problem_description: "",
  priority: "Normal",
  location: "Reception",
};

export default function UserNewTicketPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);
  const [customCategory, setCustomCategory] = useState("");
  const [customBrand, setCustomBrand] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
  }

  function validateStep(stepNum) {
    const errs = {};
    if (stepNum === 1) {
      if (!form.client_name.trim()) errs.client_name = "Le nom est obligatoire";
      if (!form.client_phone.trim())
        errs.client_phone = "Le téléphone est obligatoire";
      else if (!validatePhone(form.client_phone))
        errs.client_phone = "Numéro invalide (10-15 chiffres)";
      if (
        form.client_email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)
      )
        errs.client_email = "Email invalide";
    }
    if (stepNum === 2) {
      if (!form.hardware_category)
        errs.hardware_category = "La catégorie est obligatoire";
      if (form.hardware_category === "__other__" && !customCategory.trim())
        errs.hardware_category = "Veuillez entrer la catégorie";
      if (!form.brand) errs.brand = "La marque est obligatoire";
      if (form.brand === "__other__" && !customBrand.trim())
        errs.brand = "Veuillez entrer la marque";
    }
    if (stepNum === 3 && !form.problem_description.trim())
      errs.problem_description = "La description est obligatoire";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 4));
  }
  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    if (!validateStep(3)) {
      setStep(3);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        hardware_category: resolveCategory(form, customCategory),
        brand: resolveBrand(form, customBrand),
      };
      const result = await createTicket(payload);
      setCreated(result);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  const resolvedCat = resolveCategory(form, customCategory);
  const resolvedBrand = resolveBrand(form, customBrand);

  if (created) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ticket créé avec succès !</h2>
          <p className="text-gray-500 mb-6">
            Le ticket{" "}
            <span className="font-mono font-semibold text-blue-600">{created.ticket_id}</span>{" "}
            a été enregistré.
          </p>
          <QRCodeDisplay ticketId={created.ticket_id} size={160} />
          <p className="text-xs text-gray-400 mt-4 mb-6">
            Scannez ce QR code pour suivre l&apos;état de la réparation
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push(`/track/${created.ticket_id}`)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              Suivre le ticket
            </button>
            <button
              onClick={() => {
                setCreated(null);
                setForm(INITIAL_FORM);
                setStep(1);
                setCustomCategory("");
                setCustomBrand("");
              }}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
            >
              Nouveau ticket
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nouveau ticket</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enregistrer une nouvelle réception de matériel
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                ${
                  step > s.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : step === s.id
                      ? "bg-blue-50 border-blue-600 text-blue-600"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {step > s.id ? "✓" : s.id}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-medium hidden sm:block ${step >= s.id ? "text-blue-600" : "text-gray-400"}`}
              >
                {s.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? "bg-blue-500" : "bg-gray-200"}`} />
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

        {/* Step 1: Client */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations du client
            </h2>
            <Field label="Nom complet *" error={errors.client_name}>
              <input
                type="text"
                value={form.client_name}
                onChange={(e) => updateField("client_name", e.target.value)}
                placeholder="Ex: Mohamed Benali"
                className={ic(errors.client_name)}
              />
            </Field>
            <Field label="Téléphone *" error={errors.client_phone}>
              <input
                type="tel"
                value={form.client_phone}
                onChange={(e) => updateField("client_phone", e.target.value)}
                placeholder="Ex: 0555 12 34 56"
                className={ic(errors.client_phone)}
              />
            </Field>
            <Field label="Email" error={errors.client_email}>
              <input
                type="email"
                value={form.client_email}
                onChange={(e) => updateField("client_email", e.target.value)}
                placeholder="Ex: client@email.com (optionnel)"
                className={ic(errors.client_email)}
              />
            </Field>
          </div>
        )}

        {/* Step 2: Device info */}
        {step === 2 && (
          <DeviceStep
            form={form}
            updateField={updateField}
            errors={errors}
            ic={ic}
            customCategory={customCategory}
            setCustomCategory={setCustomCategory}
            customBrand={customBrand}
            setCustomBrand={setCustomBrand}
          />
        )}

        {/* Step 3: Problem */}
        {step === 3 && (
          <ProblemStep
            form={form}
            updateField={updateField}
            errors={errors}
            ic={ic}
          />
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vérification
            </h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
              <CR label="Client" value={form.client_name} />
              <CR label="Téléphone" value={form.client_phone} />
              {form.client_email && <CR label="Email" value={form.client_email} />}
              <hr className="border-gray-200" />
              <CR
                label="Catégorie"
                value={`${CATEGORY_ICONS[resolvedCat] || "🔧"} ${CATEGORY_LABELS[resolvedCat] || resolvedCat}`}
              />
              <CR label="Marque" value={resolvedBrand || "—"} />
              {form.reference && <CR label="Référence" value={form.reference} />}
              {form.model && <CR label="Modèle" value={form.model} />}
              {form.serial_number && (
                <CR label="N° de série" value={form.serial_number} />
              )}
              <hr className="border-gray-200" />
              <CR label="Problème" value={form.problem_description} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              ← Précédent
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button
              onClick={nextStep}
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
                  Création...
                </>
              ) : (
                "✓ Créer le ticket"
              )}
            </button>
          )}
        </div>
      </div>
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
      <span className="text-sm text-gray-900 flex-1">{value}</span>
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
