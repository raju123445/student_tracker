import Table from './Table';

const getStatusBadgeClass = (status) => {
  const classes = {
    'Applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Shortlisted': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Selected': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'In Process': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

export default function ApplicationsTable({ applications = [], onRowClick }) {
  const columns = [
    { header: 'Student USN', accessor: 'studentId.usn' },
    { header: 'Name', accessor: 'studentId.name' },
    { header: 'Company', accessor: 'companyId.companyName' },
    { header: 'Job Role', accessor: 'companyId.jobRole' },
    { header: 'Status', accessor: 'status' },
    { header: 'Rounds', accessor: 'rounds' },
    { header: 'Remarks', accessor: 'remarks' },
    { header: 'Applied At', accessor: 'appliedAt' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  return (
    <Table
      columns={columns}
      data={applications}
      emptyMessage="No applications found. Try adjusting your filters."
      renderRow={(row) => (
        <>
          <td className="px-4 py-3 text-sm">
            <span 
              className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium" 
              onClick={() => onRowClick?.(row)}
            >
              {row.studentId?.usn || '-'}
            </span>
          </td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 font-medium">
            {row.studentId?.name || '-'}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
            {row.companyId?.companyName || '-'}
          </td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
            {row.companyId?.jobRole || '-'}
          </td>
          <td className="px-4 py-3 text-sm">
            {row.status && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(row.status)}`}>
                {row.status}
              </span>
            )}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
            {row.rounds && row.rounds.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {row.rounds.map((round, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                    title={`${round.roundName}: ${round.result}`}
                  >
                    {round.roundName}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={row.remarks}>
            {row.remarks || '-'}
          </td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
            {formatDate(row.appliedAt)}
          </td>
        </>
      )}
    />
  );
}
