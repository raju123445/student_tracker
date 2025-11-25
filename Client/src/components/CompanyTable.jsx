import Table from './Table';

export default function CompanyTable({ companies = [], onRowClick }) {
  const columns = [
    { header: 'Company', accessor: 'companyName' },
    { header: 'Role', accessor: 'jobRole' },
    { header: 'Type', accessor: 'jobType' },
    { header: 'CTC', accessor: 'ctc' },
    { header: 'Location', accessor: 'location' },
    { header: 'Recruitment Date', accessor: 'recruitmentDate' },
  ];

  return (
    <Table
      columns={columns}
      data={companies}
      renderRow={(row) => (
        <>
          <td className="px-4 py-3 text-sm text-blue-600 cursor-pointer" onClick={() => onRowClick?.(row)}>{row.companyName}</td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.jobRole}</td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.jobType}</td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.ctc}</td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.location}</td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.recruitmentDate ? new Date(row.recruitmentDate).toLocaleDateString() : '-'}</td>
        </>
      )}
    />
  );
}
