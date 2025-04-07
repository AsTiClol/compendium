import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/ui/Loader'; // Import the Loader component

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [particles, setParticles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();

  // Generate background particles
  useEffect(() => {
    let intervalId;

    const generateParticles = () => {
      const newParticles = [];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 2,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }

      setParticles(newParticles);
    };

    generateParticles();

    intervalId = setInterval(() => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + (Math.random() * 0.2 - 0.1);
          let newOpacity = particle.opacity + (Math.random() * 0.05 - 0.025);

          // Keep x within 0-100 range
          if (newX < 0) newX = 0;
          if (newX > 100) newX = 100;

          // Keep opacity within 0-1 range
          if (newOpacity < 0) newOpacity = 0;
          if (newOpacity > 1) newOpacity = 1;

          return {
            ...particle,
            y: (particle.y + particle.speed) % 100,
            x: newX,
            opacity: newOpacity,
          };
        })
      );
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Start loading here for both login and signup

    if (isLogin) {
        // Check if email and password are provided for login
        if (!email || !password) {
            setError('Please enter both email and password');
            setLoading(false); // Stop loading
            return;
        }
        console.log("Sign In button clicked with credentials, navigating to /home");
        // Simulate API call for login if needed, then navigate
        setTimeout(() => {
          navigate('/landing'); // Navigate to LandingPage after 2-3 seconds
          setLoading(false); // Stop loading after navigation (or API call)
        }, 2000); // Adjust the delay as needed (2000ms = 2 seconds)
        return; // Stop further execution for the Sign In case
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!name) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const endpoint = '/api/signup'; // Replace with your actual API endpoints
    const userData = { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! You can now log in.');
        setIsLogin(true); // Switch to login mode after signup success
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Signup failed'); // Display server error message
        console.error('Signup error:', data); // Log error for debugging
      }
    } catch (err) {
      setError('Failed to connect to the server.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false); // End loading regardless of success or failure
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  // SVG Components for icons
  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
  );

  const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.664-1.485 2.022-2.575-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.417-1.47-2.576 0-4.654 2.078-4.654 4.654 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.879-.764-.025-1.482-.234-2.112-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.511 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.201-.005-.402-.014-.602.916-.66 1.705-1.478 2.323-2.41z" />
    </svg>
  );

  const EyeIcon = ({ visible }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {visible ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 1 12c0-5.46 4.54-10 10-10a9.95 9.95 0 0 1 5.94 1.79m3.63 3.63A12.63 12.63 0 0 0 22 12c0 5.46-4.54 10-10 10a12.55 12.55 0 0 0-7.7-2.26" />
          <circle cx="12" cy="12" r="3" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </>
      )}
    </svg>
  );

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-black text-white relative overflow-hidden">
      {/* Show loader if loading */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden bg-black">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  filter: 'blur(1px)',
                  backgroundColor: '#8685ef',
                }}
              />
            ))}
          </div>

          {/* Glass card effect */}
          <div className={`relative z-10 w-full p-8 ${isLogin ? 'bg-black bg-opacity-90' : 'bg-black bg-opacity-90'} backdrop-blur-md rounded-2xl shadow-2xl border border-gray-800 max-w-md mx-auto`}>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold" style={{ color: '#8685ef', fontFamily: 'IBM Plex Mono, monospace' }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="mt-2 text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {isLogin ? 'Sign in to continue' : 'Get started by creating your account'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-black bg-opacity-80 border border-red-500 rounded-lg text-red-400" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-black bg-opacity-80 border border-green-500 rounded-lg text-green-400" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              {!isLogin && (
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-white" htmlFor="name" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-2 text-sm text-white" htmlFor="email" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 transition-all text-white"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm text-white" htmlFor="password" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-white" htmlFor="confirmPassword" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-400"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <EyeIcon visible={showConfirmPassword} />
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="mb-6 text-right">
                  <a
                    href="#"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    onClick={(e) => { e.preventDefault(); }}
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 text-white disabled:opacity-50 ${isLogin ? 'bg-purple-500 hover:bg-purple-600 shadow-purple-md' : 'bg-purple-500 hover:bg-purple-600 shadow-purple-md'}`}
                style={{
                  boxShadow: isLogin ? '0 4px 20px rgba(134, 133, 239, 0.3)' : '0 4px 20px rgba(134, 133, 239, 0.3)',
                  fontFamily: 'IBM Plex Mono, monospace'
                }}
                disabled={loading}
              >
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 font-medium transition-colors"
                  style={{ color: '#8685ef', fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="mb-4 text-center text-sm text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>Or continue with</p>
                <div className="flex justify-center space-x-4">
                  <button
                    className="flex items-center justify-center px-4 py-2 rounded-lg bg-black border border-gray-800 hover:border-purple-500 transition-colors text-white"
                    onClick={(e) => { e.preventDefault(); }}
                  >
                    <GoogleIcon />
                    <span className="ml-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>Google</span>
                  </button>
                  <button
                    className="flex items-center justify-center px-4 py-2 rounded-lg bg-black border border-gray-800 hover:border-purple-500 transition-colors text-white"
                    onClick={(e) => { e.preventDefault(); }}
                  >
                    <TwitterIcon />
                    <span className="ml-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>Twitter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LoginSignupPage;