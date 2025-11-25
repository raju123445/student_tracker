export default function Card({ title, children, className = '', icon }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
      )}
      <div className={title ? '' : ''}>{children}</div>
    </div>
  );
}
