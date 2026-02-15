"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRCodeDisplay({ ticketId, size = 128 }) {
  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/track/${ticketId}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
        <QRCodeSVG
          value={publicUrl}
          size={size}
          level="M"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#0f172a"
        />
      </div>
      <span className="text-xs text-gray-500 font-mono">{ticketId}</span>
    </div>
  );
}
