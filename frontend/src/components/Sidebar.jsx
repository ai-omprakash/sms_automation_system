import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Send, Users, BarChart2,
  Key, Clock, FileText, Settings, LogOut,
  MessageSquare, ChevronRight, Zap
} from "lucide-react";

const links = [
  { to: "/",          label: "Dashboard",  icon: LayoutDashboard, end: true },
  { to: "/send",      label: "Send SMS",   icon: Send },
  { to: "/campaigns", label: "Campaigns",  icon: Zap },
  { to: "/contacts",  label: "Contacts",   icon: Users },
  { to: "/templates", label: "Templates",  icon: FileText },
  { to: "/schedules", label: "Scheduler",  icon: Clock },
  { to: "/analytics", label: "Analytics",  icon: BarChart2 },
  { to: "/api-keys",  label: "API Keys",   icon: Key },
  { to: "/settings",  label: "Settings",   icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 flex flex-col min-h-screen"
      style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)" }}>

      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <MessageSquare size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">SMS Pro</p>
            <p className="text-slate-400 text-xs">Automation Platform</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="mx-3 mt-4 mb-2 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.full_name || user?.username}</p>
            <p className="text-slate-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 space-y-0.5">
        <p className="text-slate-500 text-xs font-semibold px-3 py-2 uppercase tracking-wider">Main Menu</p>
        {links.slice(0, 5).map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "nav-active text-white"
                  : "text-slate-400 hover:bg-white/8 hover:text-white"
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="opacity-70" />}
              </>
            )}
          </NavLink>
        ))}

        <p className="text-slate-500 text-xs font-semibold px-3 py-2 uppercase tracking-wider mt-3">Tools</p>
        {links.slice(5).map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "nav-active text-white"
                  : "text-slate-400 hover:bg-white/8 hover:text-white"
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="opacity-70" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-white/10 pt-4">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 text-sm font-medium transition-all w-full">
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
