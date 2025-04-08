import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/ui/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [particles, setParticles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

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

          if (newX < 0) newX = 0;
          if (newX > 100) newX = 100;
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

  const validateForm = () => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    } else {
      if (!formData.name) {
        setError('Please enter your name');
        return false;
      }
      if (!formData.email) {
        setError('Please enter your email');
        return false;
      }
      if (!formData.password) {
        setError('Please enter a password');
        return false;
      }
      if (!formData.confirmPassword) {
        setError('Please confirm your password');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    if (isLogin) {
      // Store both name and email in localStorage
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);

      // Show success notification immediately
      toast.success('Login Successful!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
      });

      // Redirect to the landing page
      navigate('/landing');
    } else {
      // Only check server for signup
      try {
        const endpoint = '/api/signup';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Account created successfully! You can now log in.');
          setIsLogin(true);
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
        } else {
          setError(data.message || 'Signup failed');
        }
      } catch (err) {
        setError('Failed to connect to the server');
      }
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
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
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-black text-white relative overflow-hidden">
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

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
              <div className="mb-4">
                <label className="block mb-2 text-sm text-white" htmlFor="name" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  autoComplete="off"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm text-white" htmlFor="email" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  autoComplete="off"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm text-white" htmlFor="password" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white pr-12"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400"
                    onClick={togglePasswordVisibility}
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
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white pr-12"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400"
                      onClick={toggleConfirmPasswordVisibility}
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