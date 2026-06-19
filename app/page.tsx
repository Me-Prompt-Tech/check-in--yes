import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="./img/logo.jpg"
            alt="Company Logo"
            className="h-50 w-auto"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome Back
          </h1>

          <p className="text-slate-500 mt-2">
            Sign in to Attendance System
          </p>
        </div>

        {/* Username */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter your username"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <div className="mt-2 text-right">
            <a
              href="#"
              className="text-xs text-slate-500 hover:text-indigo-600 transition"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Remember */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" />
            Remember me
          </label>


        </div>

        {/* Login Button */}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg">
          Sign In
        </button>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-400">
          © 2026 Company Name
        </div>

      </div>

    </div>
  );
}