import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './raw/Home'; // Path seems correct based on previous findings
import LoginSignupPage from './components/LoginSignupPage'; // Path seems correct
import LandingPage from './components/ui/LandingPage';

import './App.css';

function App() {
  // No authentication state needed for this simple routing setup

  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the login page */}
        <Route path="/login" element={<LoginSignupPage />} />

        {/* Route for the home page */}
        <Route path="/home" element={<Home />} />

        {/* Route for the LandingPage */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

         {/* Optional: Catch-all for unmatched routes */}
         <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
