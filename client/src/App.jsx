import AuthPage from "./Auth/AuthPage";
import HomePage from "./components/Homepage"
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useEffect } from "react";
import projectService from './services/project'
import Risks from "./components/Risks";
import Assumptions from "./components/Assumptions"
import Issues from "./components/Issues"
import Dependencies from "./components/Dependencies"
import Tab from "./components/Tab";

function App() {
  const token = localStorage.getItem('token');
  if (token) {
    projectService.setToken(token);
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />}></Route>
          <Route path="/" element={<HomePage />}></Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects/:projectId/risks" element={<Risks />} />
            <Route path="/projects/:projectId/assumptions" element={<Assumptions />} />
            <Route path="/projects/:projectId/issues" element={<Issues />} />
            <Route path="/dependencies" element={<Dependencies />} />
          </Route>
        </Routes>
      </Router>

    </>
  )
}

export default App
