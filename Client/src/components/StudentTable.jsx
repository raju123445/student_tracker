import Table from './Table';

export default function StudentTable({ students = [], onRowClick }) {
  const columns = [
    { header: 'USN', accessor: 'usn' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Mobile', accessor: 'mobileNumber' },
    { header: 'Course', accessor: 'course' },
    { header: 'Sem', accessor: 'sem' },
  ];

  return (
    <Table
      columns={columns}
      data={students}
      renderRow={(row) => (
        <>
          <td className="px-4 py-3 text-sm text-blue-600 cursor-pointer" onClick={() => onRowClick?.(row)}>{row.usn}</td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.name}</td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.email}</td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.mobileNumber}</td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.course}</td>
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.sem}</td>
        </>
      )}
    />
  );
}
