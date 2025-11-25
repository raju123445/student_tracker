import { useState, useEffect } from 'react';
import { fetchStudentByUSN, fetchApplications } from '../api/api';
import USNSearch from '../components/USNSearch';
import Card from '../components/Card';
import ApplicationsTable from '../components/ApplicationsTable';

export default function StudentTrackingPage() {
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchStudent = async (usn) => {
    if (!usn) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch student by USN
      const studentRes = await fetchStudentByUSN(usn);
      setStudent(studentRes.data?.data);

      // Fetch applications for the student
      if (studentRes.data?.data?._id) {
        const applicationsRes = await fetchApplications({ studentId: studentRes.data.data._id });
        setApplications(applicationsRes.data?.data || []);
      }
    } catch (err) {
      setError(err.message || 'Error fetching student data');
      setStudent(null);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Student Tracking</h1>

      <USNSearch onSearch={searchStudent} />

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {student && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Student Profile" className="lg:col-span-1">
            <div className="text-sm space-y-2">
              <div><strong>USN:</strong> {student.usn}</div>
              <div><strong>Name:</strong> {student.name}</div>
              <div><strong>Email:</strong> {student.email}</div>
              <div><strong>Mobile:</strong> {student.mobileNumber}</div>
              <div><strong>Course:</strong> {student.course}</div>
              <div><strong>Sem:</strong> {student.sem}</div>
              <div><strong>Branch:</strong> {student.branch}</div>
            </div>
          </Card>

          <Card title="Applications" className="lg:col-span-2">
            {applications.length > 0 ? (
              <ApplicationsTable applications={applications} />
            ) : (
              <p className="text-gray-500 text-center py-4">No applications found for this student.</p>
            )}
          </Card>
        </div>
      )}

      {!student && !loading && !error && (
        <div className="text-center text-gray-500 py-8">
          <p>Enter a USN to track student application details.</p>
        </div>
      )}
    </div>
  );
}
