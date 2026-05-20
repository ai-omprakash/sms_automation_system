import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(form.username, form.password);
    setLoading(false);
    if (result.success) navigate("/");
    else setError(result.message);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <MessageSquare size={22} />
          </div>
          <span className="text-xl font-bold">SMS Pro</span>
        </div>
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Enterprise SMS<br />
            <span className="text-indigo-400">Automation</span><br />
            Platform
          </h1>
          <p className="text-slate-300 text-lg mb-10">Send bulk SMS, manage campaigns, track analytics — all in one place.</p>
          <div className="grid grid-cols-2 gap-4">
            {[["10M+","Messages Sent"],["99.9%","Uptime SLA"],["150+","Countries"],["24/7","Support"]].map(([v,l]) => (
              <div key={l} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <p className="text-2xl font-bold text-indigo-300">{v}</p>
                <p className="text-sm text-slate-300 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-500 text-sm">© 2025 SMS Pro. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800">SMS Pro</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm mb-6">Sign in to your account to continue</p>

            {/* Default credentials hint */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-indigo-600 mb-1">🔐 Default Admin Credentials</p>
              <div className="flex gap-4 text-xs text-indigo-700 font-mono">
                <span>Username: <strong>omprakash</strong></span>
                <span>Password: <strong>Om@1234</strong></span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 whitespace-pre-line">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Username or Email</label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="input-field"
                  placeholder="Enter username or email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="input-field pr-10"
                    placeholder="Enter password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
