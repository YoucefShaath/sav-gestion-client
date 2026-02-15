export default function EmptyState({ icon = "📋", title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{message}</p>
      {action}
    </div>
  );
}
