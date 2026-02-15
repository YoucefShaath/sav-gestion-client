import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/utils";

export default function PriorityBadge({ priority }) {
  const colors = PRIORITY_COLORS[priority] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
  };
  const label = PRIORITY_LABELS[priority] || priority;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {label}
    </span>
  );
}
