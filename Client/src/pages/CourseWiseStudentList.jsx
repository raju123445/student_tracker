// import { useState } from "react";
// import { fetchStudents } from "../api/api";

// const CourseWiseStudentList = () => {
//   const [course, setCourse] = useState("");
//   const [branch, setBranch] = useState("");
//   const [sem, setSem] = useState("");
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     setLoading(true);

//     try {
//       const params = {};
//       if (course) params.course = course;
//       if (branch) params.branch = branch;
//       if (sem) params.sem = sem;

//       const response = await fetchStudents(params);
//       setStudents(response.data.data);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="p-6 text-white">
//       {/* Filters */}
//       <h2 className="text-2xl font-bold mb-4">Course Wise Student List</h2>

//       <div className="flex gap-4 mb-6">
//         {/* Course */}
//         <select
//           className="bg-[#1e293b] text-white p-2 rounded-md w-40"
//           value={course}
//           onChange={(e) => setCourse(e.target.value)}
//         >
//           <option value="">Course</option>
//           <option value="B Tech">B.Tech</option>
//           <option value="B Tech">B.Tech</option>
//           <option value="B Tech">B.Tech</option>
//         </select>

//         {/* Branch */}
//         <select
//           className="bg-[#1e293b] text-white p-2 rounded-md w-40"
//           value={branch}
//           onChange={(e) => setBranch(e.target.value)}
//         >
//           <option value="">Branch</option>
//           <option value="CSE">CSE</option>
//           <option value="ISE">ISE</option>
//           <option value="ECE">ECE</option>
//         </select>

//         {/* SEM */}
//         <select
//           className="bg-[#1e293b] text-white p-2 rounded-md w-40"
//           value={sem}
//           onChange={(e) => setSem(e.target.value)}
//         >
//           <option value="">Sem</option>
//           {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>

//         {/* Search Button */}
//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 px-4 rounded-md"
//         >
//           Search
//         </button>
//       </div>

//       {/* Student List */}
//       <div className="bg-[#0f172a] p-4 rounded-md">
//         <h3 className="text-xl font-semibold mb-3">Student List</h3>

//         {loading ? (
//           <p>Loading...</p>
//         ) : students.length === 0 ? (
//           <p>No students found.</p>
//         ) : (
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-gray-700">
//                 <th className="p-2">Name</th>
//                 <th className="p-2">USN</th>
//                 <th className="p-2">Course</th>
//                 <th className="p-2">Branch</th>
//                 <th className="p-2">Sem</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((stu) => (
//                 <tr key={stu._id} className="border-b border-gray-700">
//                   <td className="p-2">{stu.name}</td>
//                   <td className="p-2">{stu.usn}</td>
//                   <td className="p-2">{stu.course}</td>
//                   <td className="p-2">{stu.branch}</td>
//                   <td className="p-2">{stu.sem}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseWiseStudentList;
import { useState } from "react";
import {
    fetchApplicationsByStudent,
    fetchStudents,
} from "../api/api";

const CourseWiseApplications = () => {
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [sem, setSem] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    try {
      // 1️⃣ Fetch students
      const params = {};
      if (course) params.course = course;
      if (branch) params.branch = branch;
      if (sem) params.sem = sem;

      const studentsRes = await fetchStudents(params);
      const students = studentsRes.data.data || [];

      // 2️⃣ Fetch applications for each student
      const finalData = [];

      for (let stu of students) {
        const appsRes = await fetchApplicationsByStudent(stu._id);
        const apps = appsRes.data.data || [];

        finalData.push({
          student: stu,
          applications: apps,
        });
      }

      setResults(finalData);
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 text-white">

      <h2 className="text-2xl font-bold mb-4">Course Wise Applications</h2>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">
        <select
          className="bg-[#1e293b] p-2 rounded-md text-white"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Course</option>
          <option value="B Tech">B.Tech</option>
          <option value="MCA">MCA</option>
          <option value="MBA">MBA</option>
          <option value="M Tech">M Tech</option>
        </select>

        <select
          className="bg-[#1e293b] p-2 rounded-md text-white"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">Branch</option>
          <option value="CSE">CSE</option>
          <option value="ISE">ISE</option>
          <option value="ECE">ECE</option>
        </select>

        <select
          className="bg-[#1e293b] p-2 rounded-md text-white"
          value={sem}
          onChange={(e) => setSem(e.target.value)}
        >
          <option value="">Sem</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}</option>)}
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 px-4 rounded-md"
        >
          Search
        </button>
      </div>

      {/* RESULTS TABLE */}
      <div className="bg-[#0f172a] p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4">Applications</h3>

        {loading ? (
          <p>Loading...</p>
        ) : results.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2">STUDENT USN</th>
                <th className="p-2">NAME</th>
                <th className="p-2">COMPANY</th>
                <th className="p-2">JOB ROLE</th>
                <th className="p-2">STATUS</th>
                <th className="p-2">ROUNDS</th>
                <th className="p-2">REMARKS</th>
                <th className="p-2">APPLIED AT</th>
              </tr>
            </thead>

            <tbody>
              {results.map(({ student, applications }) => {
                if (applications.length === 0) {
                  return (
                    <tr key={student._id} className="border-b border-gray-700">
                      <td className="p-2">{student.usn}</td>
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">—</td>
                      <td className="p-2">—</td>
                      <td className="p-2 text-yellow-300">Not Applied</td>
                      <td className="p-2">—</td>
                      <td className="p-2">—</td>
                      <td className="p-2">—</td>
                    </tr>
                  );
                }

                return applications.map((app) => (
                  <tr key={app._id} className="border-b border-gray-700">
                    <td className="p-2">{student.usn}</td>
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{app.companyId?.companyName || "—"}</td>
                    <td className="p-2">{app.companyID?.jobRole}</td>
                    <td className="p-2">{app.status}</td>
                    <td className="p-2">
                    {app.rounds?.length
                        ? app.rounds.map((r) => (
                            <span className="bg-gray-700 text-xs px-2 py-1 rounded mr-1">
                            {r.roundName}
                            </span>
                        ))
                        : "—"}
                    </td>
                    <td className="p-2">{app.remarks || "-"}</td>
                    <td className="p-2">{new Date(app.appliedAt).toDateString()}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CourseWiseApplications