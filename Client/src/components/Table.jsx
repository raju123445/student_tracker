export default function Table({ columns = [], data = [], rowKey = (r) => r._id, className = '', renderRow, emptyMessage = 'No data available' }) {
  if (!data || data.length === 0) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {columns.map((col) => (
              <th key={col.key || col.accessor} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {renderRow ? renderRow(row) : columns.map((col) => (
                <td key={col.key || col.accessor} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
