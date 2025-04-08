import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignupPage from './components/LoginSignupPage';
import LandingPage from './components/ui/LandingPage';
import RawHomePage from './components/Home';

import './App.css';

function App() {
  // No authentication state needed for this simple routing setup

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Route for the login page */}
        <Route path="/login" element={<LoginSignupPage />} />

        {/* Route for the landing page */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Route for the raw home page (assuming this is the intended 'Home') */}
        <Route path="/raw/home" element={<RawHomePage />} />

        {/* Catch-all for unmatched routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
