import { useAuth } from "../context/AuthContext";
import { Settings, User, Shield, Zap, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile */}
      <div className="card">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <User size={18} className="text-indigo-500" /> Account Profile
        </h3>
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-lg">{user?.full_name || user?.username}</p>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className="badge badge-purple mt-1 capitalize">{user?.role}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["Username", user?.username],
            ["Email", user?.email],
            ["Role", user?.role],
            ["Full Name", user?.full_name || "—"],
          ].map(([label, val]) => (
            <div key={label} className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm font-medium text-slate-700 capitalize">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Providers */}
      <div className="card">
        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Zap size={18} className="text-indigo-500" /> SMS Providers
        </h3>
        <p className="text-sm text-slate-400 mb-5">
          Configure credentials in <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-lg text-xs">backend/.env</code> file
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Twilio", site: "twilio.com", color: "from-red-500 to-pink-600", desc: "Global SMS & Voice" },
            { name: "Vonage", site: "vonage.com", color: "from-slate-700 to-slate-900", desc: "Enterprise Messaging" },
            { name: "Fast2SMS", site: "fast2sms.com", color: "from-blue-500 to-indigo-600", desc: "India SMS Gateway" },
          ].map(({ name, site, color, desc }) => (
            <a key={name} href={`https://${site}`} target="_blank" rel="noreferrer"
              className="group border border-slate-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition flex flex-col">
              <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl mb-3 flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{name[0]}</span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">{name}</p>
              <p className="text-xs text-slate-400 mt-1 flex-1">{desc}</p>
              <div className="flex items-center gap-1 text-xs text-indigo-500 mt-3 group-hover:gap-2 transition-all">
                <span>{site}</span><ExternalLink size={11} />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <Shield size={18} className="text-indigo-500" /> Security
        </h3>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-sm font-medium text-slate-700">Change Password</p>
          <p className="text-xs text-slate-400 mt-1">
            Update your password in the <code className="bg-white border border-slate-200 px-1 rounded text-xs">backend/.env</code> or via API.
          </p>
        </div>
      </div>
    </div>
  );
}
