import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import './App.css';
import DashboardLayout from './pages/DashboardLayout';
import Media from './components/screens/Media/Media';
import Gallery from './components/screens/Gallery/Gallery';
import Press from './components/screens/Press/Press';
import Login from './components/auth/Login';
import DashboardHome from './pages/DashboardHome';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('authToken') !== null
  );

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ?
              <Login setIsAuthenticated={setIsAuthenticated} /> :
              <Navigate to="/" replace />}
          />

          <Route
            path="/"
            element={isAuthenticated ?
              <DashboardLayout setIsAuthenticated={setIsAuthenticated} /> :
              <Navigate to="/login" replace />}
          >
            <Route index element={<DashboardHome />} />
            <Route path="media" element={<Media />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="press" element={<Press />} />
            {/* Add other protected routes here */}
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;