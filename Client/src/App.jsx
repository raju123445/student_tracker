import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import DashboardLayout from './components/DashboardLayout.jsx';
import CourseWiseStudentList from './pages/CourseWiseStudentList.jsx';
import Dashboard from './pages/DashboardPage.jsx';
import Login from './pages/login.jsx';
import StudentTrackingPage from './pages/StudentTrackingPage.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>} />
        <Route path="/tracking" element={
          <DashboardLayout classname="m-5">
            <StudentTrackingPage/>
          </DashboardLayout>
          } />
        <Route path="/course-students"  element={
          <DashboardLayout>
            <CourseWiseStudentList />
          </DashboardLayout>
        }/>
        <Route path="/students" element={<div>Student List Page</div>} />
        <Route path="/students/:id" element={<div>Student Detail Page</div>} />
        <Route path="/add-student" element={<div>Add Student Page</div>} />
      </Routes>
    </Router>
  )
}

export default App
