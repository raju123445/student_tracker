import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard.jsx';
import Login from './pages/login.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/students" element={<div>Student List Page</div>} />
        <Route path="/students/:id" element={<div>Student Detail Page</div>} />
        <Route path="/add-student" element={<div>Add Student Page</div>} />
      </Routes>
    </Router>
  )
}

export default App
