import { STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";

export default function StatusBadge({ status, size = "sm" }) {
  const colors = STATUS_COLORS[status] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };
  const label = STATUS_LABELS[status] || status;

  const sizeClasses =
    size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${colors.bg} ${colors.text} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
}
