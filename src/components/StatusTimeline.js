import {
  STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  getStatusStep,
} from "@/lib/utils";

export default function StatusTimeline({ currentStatus }) {
  const currentStep = getStatusStep(currentStatus);

  return (
    <div className="flex items-center w-full">
      {STATUSES.map((status, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const colors = STATUS_COLORS[status];

        return (
          <div
            key={status}
            className="flex items-center flex-1 last:flex-initial"
          >
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                        ? `${colors.bg} ${colors.text} border-current`
                        : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium text-center leading-tight
                ${isCurrent ? colors.text : isCompleted ? "text-green-600" : "text-gray-400"}`}
              >
                {STATUS_LABELS[status]}
              </span>
            </div>

            {/* Connector line */}
            {index < STATUSES.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 ${isCompleted ? "bg-green-400" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
