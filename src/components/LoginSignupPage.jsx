// src/components/LoginSignupPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/ui/Loader"; // Assuming Loader component works
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- SVG Icon Components ---
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-white"
  >
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
        {/* Eye Open Icon */}
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        {/* Eye Closed/Slash Icon */}
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);
// --- End SVG Icons ---

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [particles, setParticles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // --- Input Handler ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
    setSuccess(""); // Clear success on input change
  };

  // --- Password Visibility Toggles ---
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // --- Particle Effect ---
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
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
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
        }),
      );
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  // --- Form Validation ---
  const validateForm = () => {
    setError(""); // Clear previous errors
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError("Please enter both email and password.");
        return false;
      }
      // Basic length check for login
      if (formData.password.length < 6) {
        setError("Password seems too short.");
        return false;
      }
    } else {
      // Signup validation
      if (!formData.name.trim()) {
        setError("Please enter your name.");
        return false;
      }
      if (!formData.email) {
        setError("Please enter your email.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return false;
      }
      if (!formData.password) {
        setError("Please enter a password.");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return false;
      }
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        setError(
          "Password needs uppercase, lowercase, number, and special character.",
        );
        return false;
      }
      if (!formData.confirmPassword) {
        setError("Please confirm your password.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
    }
    return true; // Validation passed
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setSuccess("");

    if (!validateForm()) {
      // Stop if validation fails
      return;
    }

    setLoading(true); // Show loader

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isLogin) {
      // --- LOGIN LOGIC (Simulated) ---
      console.log("Attempting login for:", formData.email);
      toast.success("Login Successful!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false /* etc */,
      });
      localStorage.setItem("userEmail", formData.email);
      // Optional: Store name if available
      if (formData.name) {
        // Simple check if name field was somehow populated during login attempt (unlikely but safe)
        localStorage.setItem("userName", formData.name);
      }

      setTimeout(() => {
        setLoading(false);
        navigate("/landing"); // Navigate after toast
      }, 1500);
    } else {
      // --- SIGNUP LOGIC (Simulated) ---
      console.log("Attempting signup for:", formData.name, formData.email);
      setSuccess("Account created successfully! Please log in.");
      setIsLogin(true); // Switch to login mode
      // Store name from successful signup for potential use later
      localStorage.setItem("userName", formData.name); // Store name on signup success
      setFormData({ name: "", email: "", password: "", confirmPassword: "" }); // Clear form
      setLoading(false); // Hide loader
    }
  };

  // --- Toggle between Login and Signup Mode ---
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setShowPassword(false); // Reset visibility state
    setShowConfirmPassword(false);
  };

  // --- JSX Structure ---
  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-black text-white relative overflow-hidden px-4 sm:px-6 lg:px-8">
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

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Background Particles */}
          <div className="absolute inset-0 overflow-hidden bg-black z-0">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  filter: "blur(1px)",
                  backgroundColor: "#8685ef",
                }}
              />
            ))}
          </div>
          {/* Glass Card */}
          <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-black/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800">
            {/* Header */}
            <div className="mb-6 sm:mb-8 text-center">
              <h1
                className="text-2xl sm:text-3xl font-bold mb-1"
                style={{
                  color: "#8685ef",
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              >
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p
                className="mt-1 text-sm sm:text-base text-white"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                {isLogin
                  ? "Sign in to continue"
                  : "Get started by creating your account"}
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div
                className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm font-medium text-center"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className="mb-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-green-300 text-sm font-medium text-center"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* Name Input (Signup Only) */}
              {!isLogin && (
                <div>
                  <label
                    className="block mb-1.5 text-xs sm:text-sm text-gray-300"
                    htmlFor="name"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {" "}
                    Your Name{" "}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/70 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder:text-gray-500 text-sm sm:text-base"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    autoComplete="off"
                  />
                </div>
              )}

              {/* Email Input */}
              <div>
                <label
                  className="block mb-1.5 text-xs sm:text-sm text-gray-300"
                  htmlFor="email"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {" "}
                  Email Address{" "}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/70 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder:text-gray-500 text-sm sm:text-base"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  autoComplete="off"
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  className="block mb-1.5 text-xs sm:text-sm text-gray-300"
                  htmlFor="password"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {" "}
                  Password{" "}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    required
                    type={showPassword ? "text" : "password"} // Dynamic type
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/70 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder:text-gray-500 pr-10 sm:pr-12 text-sm sm:text-base"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    autoComplete="off"
                  />
                  <button
                    type="button" // IMPORTANT: type="button"
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-300 p-1 focus:outline-none focus:ring-1 focus:ring-purple-500/50 rounded-full z-20"
                    onClick={togglePasswordVisibility} // Assign correct handler
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              {/* Confirm Password Input (Signup Only) */}
              {!isLogin && (
                <div>
                  <label
                    className="block mb-1.5 text-xs sm:text-sm text-gray-300"
                    htmlFor="confirmPassword"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {" "}
                    Confirm Password{" "}
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      type={showConfirmPassword ? "text" : "password"} // Dynamic type
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/70 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder:text-gray-500 pr-10 sm:pr-12 text-sm sm:text-base"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      autoComplete="off"
                    />
                    <button
                      type="button" // IMPORTANT: type="button"
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-300 p-1 focus:outline-none focus:ring-1 focus:ring-purple-500/50 rounded-full z-20"
                      onClick={toggleConfirmPasswordVisibility} // Assign correct handler
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      <EyeIcon visible={showConfirmPassword} />
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Link (Login Only) */}
              {isLogin && (
                <div className="text-right pt-1">
                  {" "}
                  {/* Added slight padding top */}
                  <a
                    href="#"
                    className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Forgot Password clicked - not implemented.");
                    }}
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {" "}
                    Forgot Password?{" "}
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 text-white disabled:opacity-60 disabled:cursor-not-allowed ${isLogin ? "bg-purple-600 hover:bg-purple-700 active:bg-purple-800" : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"}`}
                style={{
                  boxShadow: "0 4px 14px rgba(134, 133, 239, 0.25)",
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              >
                {loading
                  ? "Processing..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            {/* Toggle Mode Link */}
            <div className="mt-6 text-center">
              <p
                className="text-xs sm:text-sm text-gray-400"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-1.5 font-medium transition-colors hover:text-purple-300 focus:outline-none focus:underline"
                  style={{
                    color: "#8685ef",
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>

            {/* Social Login Separator & Buttons (Login Only) */}
            {isLogin && (
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="relative mb-4">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-700/50"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span
                      className="bg-black/80 px-2 text-xs sm:text-sm text-gray-400"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  <button /* Google */
                    className="flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-800/60 border border-gray-700 hover:border-purple-500/70 transition-colors text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Google Sign-in clicked - not implemented.");
                    }}
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    <GoogleIcon />{" "}
                    <span className="ml-1.5 sm:ml-2">Google</span>
                  </button>
                  <button /* Twitter */
                    className="flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-800/60 border border-gray-700 hover:border-purple-500/70 transition-colors text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Twitter Sign-in clicked - not implemented.");
                    }}
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    <TwitterIcon />{" "}
                    <span className="ml-1.5 sm:ml-2">Twitter</span>
                  </button>
                </div>
              </div>
            )}
          </div>{" "}
          {/* End Card */}
        </>
      )}
    </div> // End Page Container
  );
};

export default LoginSignupPage;
