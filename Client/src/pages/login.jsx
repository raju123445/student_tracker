import { Eye, EyeOff, Lock, Mail, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isDark, setIsDark] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Prefer Vite-style env var for API base URL. Vite only exposes vars prefixed with VITE_.
  // If you set `FRONTEND_URL` in a .env file it will NOT be available in the browser.
  // Use a Client/.env (Vite) file with: VITE_API_URL=http://localhost:5000
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // use current state values directly
    console.log("Login attempt:", { email, password, rememberMe });
    // Helpful logs for debugging environment issues
    console.log("Using API base URL:", API_BASE);
    const loginUrl = (() => {
      try {
        // ensures correct concatenation even when API_BASE includes a trailing slash
        return new URL('/api/admin/login', API_BASE).toString();
      } catch (err) {
        console.warn('Could not build login URL with URL(), falling back to string concat', err?.message);
        return `${API_BASE.replace(/\/$/, '')}/api/admin/login`;
      }
    })();
    console.log("Full login URL:", loginUrl);
    if (!email || !password) {
      alert("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    // try block
    try{
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log("Response status:", response);

      if (response.ok) { // Check for status 200-299
        const data = await response.json();
        // Store token and admin info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin || {}));
        // Navigate to dashboard using react-router
        navigate('/dashboard');
        } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Login failed. Please try again.');
      }
    }
    catch(error){
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    } 
    finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 ${
          isDark
            ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
            : "bg-white text-gray-700 hover:bg-gray-100 shadow-lg"
        }`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Login Card */}
      <div
        className={`w-full max-w-md transition-all duration-300 ${
          isDark
            ? "bg-gray-800 shadow-2xl shadow-blue-500/10"
            : "bg-white shadow-2xl shadow-gray-300/50"
        } rounded-2xl p-8`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isDark ? "bg-blue-500/10" : "bg-blue-50"
            }`}
          >
            <Lock
              className={`w-8 h-8 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
          </div>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome Back
          </h1>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:bg-gray-700"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className={`w-full pl-11 pr-12 py-3 rounded-lg border transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:bg-gray-700"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  isDark
                    ? "text-gray-500 hover:text-gray-400"
                    : "text-gray-400 hover:text-gray-600"
                } transition-colors`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <span
                className={`ml-2 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Remember me
              </span>
            </label>
            <button
              type="button"
              className={`text-sm font-medium transition-colors ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Forgot password?
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              className={`p-3 rounded-lg text-sm ${
                isDark
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              isDark
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700 hover:shadow-blue-500/40 transform hover:scale-[1.02] active:scale-[0.98]"}`}
          >
            {isLoading ? (
              <span className="inline-flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div
            className={`absolute inset-0 flex items-center ${
              isDark ? "text-gray-600" : "text-gray-300"
            }`}
          >
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className={`px-4 ${
                isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
              }`}
            >
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
            }`}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <p
          className={`text-center mt-6 text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don't have an account?{" "}
          <button
            type="button"
            className={`font-semibold transition-colors ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
