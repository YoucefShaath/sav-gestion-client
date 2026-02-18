"use client";

import React, { createContext, useContext, useCallback, useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      const id = Date.now() + Math.random();
      setToasts((s) => [...s, { id, type, title, message }]);
      setTimeout(
        () => setToasts((s) => s.filter((t) => t.id !== id)),
        duration,
      );
    },
    [],
  );

  const confirm = useCallback(
    ({
      title = "Confirmer",
      message = "",
      confirmText = "Confirmer",
      cancelText = "Annuler",
      danger = false,
    } = {}) => {
      return new Promise((resolve) => {
        setConfirmState({
          title,
          message,
          confirmText,
          cancelText,
          danger,
          resolve,
        });
      });
    },
    [],
  );

  const handleConfirm = (value) => {
    if (confirmState?.resolve) confirmState.resolve(value);
    setConfirmState(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`w-full flex items-start gap-3 p-3 rounded-lg shadow-lg border ${
              t.type === "success"
                ? "bg-emerald-50 border-emerald-100"
                : t.type === "error"
                  ? "bg-red-50 border-red-100"
                  : "bg-sky-50 border-sky-100"
            }`}
          >
            <div className="mt-0.5 text-xl text-current">
              {t.type === "success" ? (
                <FiCheckCircle className="text-emerald-600" />
              ) : t.type === "error" ? (
                <FiXCircle className="text-red-600" />
              ) : (
                <FiInfo className="text-sky-600" />
              )}
            </div>
            <div className="flex-1 text-sm">
              {t.title && (
                <div className="font-semibold text-gray-800">{t.title}</div>
              )}
              <div className="text-gray-700 mt-0.5 whitespace-pre-wrap">
                {t.message}
              </div>
            </div>
            <button
              onClick={() => setToasts((s) => s.filter((x) => x.id !== t.id))}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close notification"
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirmState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => handleConfirm(false)}
          />
          <div className="bg-white rounded-lg shadow-xl p-6 z-10 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {confirmState.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{confirmState.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-sm text-gray-700"
              >
                {confirmState.cancelText}
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  confirmState.danger
                    ? "bg-red-600 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.showToast;
}

export function useConfirm() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useConfirm must be used within ToastProvider");
  return ctx.confirm;
}

export default ToastProvider;
