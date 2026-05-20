import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, Search } from "lucide-react";

const titles = {
  "/":          { title: "Dashboard",  sub: "Welcome back! Here's your overview." },
  "/send":      { title: "Send SMS",   sub: "Send a single or bulk SMS message." },
  "/campaigns": { title: "Campaigns",  sub: "Create and manage SMS campaigns." },
  "/contacts":  { title: "Contacts",   sub: "Manage your contact list." },
  "/templates": { title: "Templates",  sub: "Reusable SMS message templates." },
  "/schedules": { title: "Scheduler",  sub: "Schedule messages for later delivery." },
  "/analytics": { title: "Analytics",  sub: "Track your SMS performance." },
  "/api-keys":  { title: "API Keys",   sub: "Manage your API access keys." },
  "/settings":  { title: "Settings",   sub: "Configure your account and providers." },
};

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const page = titles[pathname] || { title: "SMS Pro", sub: "" };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{page.title}</h1>
            <p className="text-sm text-slate-400">{page.sub}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
              <Search size={16} />
            </button>
            <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-700">{user?.username}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
