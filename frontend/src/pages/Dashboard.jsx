import { useEffect, useState } from "react";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { MessageSquare, Send, XCircle, Users, TrendingUp, Clock, BarChart2, Zap } from "lucide-react";

const statusColors = { sent: "#6366f1", failed: "#ef4444", pending: "#f59e0b", delivered: "#22c55e" };

function StatCard({ title, value, icon: Icon, color, sub }) {
  const colors = {
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", border: "border-indigo-100" },
    green:  { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
    red:    { bg: "bg-red-50",     icon: "text-red-600",     border: "border-red-100" },
    yellow: { bg: "bg-amber-50",   icon: "text-amber-600",   border: "border-amber-100" },
    purple: { bg: "bg-violet-50",  icon: "text-violet-600",  border: "border-violet-100" },
    blue:   { bg: "bg-blue-50",    icon: "text-blue-600",    border: "border-blue-100" },
  };
  const c = colors[color] || colors.indigo;
  return (
    <div className={`stat-card bg-white rounded-2xl border ${c.border} p-5 shadow-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center`}>
          <Icon size={21} className={c.icon} />
        </div>
        <span className="text-xs text-emerald-500 font-semibold bg-emerald-50 px-2 py-1 rounded-full">+0%</span>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{title}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    api.get("/analytics/overview").then(r => setStats(r.data)).catch(() => {});
    api.get("/analytics/sms-by-status").then(r => setChartData(r.data)).catch(() => {});
    api.get("/campaigns/").then(r => setCampaigns(r.data.slice(0, 5))).catch(() => {});
  }, []);

  const campaignStatusColor = { draft: "badge-gray", running: "badge-blue", sent: "badge-green", failed: "badge-red" };

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard title="Total SMS Sent"  value={stats?.total_sms ?? 0}          icon={MessageSquare} color="indigo" />
        <StatCard title="Delivered"        value={stats?.sent ?? 0}               icon={Send}          color="green" />
        <StatCard title="Failed"           value={stats?.failed ?? 0}             icon={XCircle}       color="red" />
        <StatCard title="Pending"          value={stats?.pending ?? 0}            icon={Clock}         color="yellow" />
        <StatCard title="Campaigns"        value={stats?.campaigns ?? 0}          icon={Zap}           color="purple" />
        <StatCard title="Contacts"         value={stats?.contacts ?? 0}           icon={Users}         color="blue" />
        <StatCard title="Delivery Rate"    value={`${stats?.delivery_rate ?? 0}%`} icon={TrendingUp}   color="green" />
        <StatCard title="Analytics"        value="Live"                            icon={BarChart2}     color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">SMS by Status</h3>
              <p className="text-sm text-slate-400">Message delivery breakdown</p>
            </div>
          </div>
          {chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300">
              <BarChart2 size={40} className="mb-3" />
              <p className="text-sm">No data yet. Send some SMS!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={statusColors[entry.status] || "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent campaigns */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Recent Campaigns</h3>
              <p className="text-sm text-slate-400">Latest campaign activity</p>
            </div>
          </div>
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-300">
              <Zap size={36} className="mb-3" />
              <p className="text-sm">No campaigns yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                  <div className="min-w-0 mr-2">
                    <p className="text-sm font-semibold text-slate-700 truncate">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.total} recipients</p>
                  </div>
                  <span className={`badge ${campaignStatusColor[c.status] || "badge-gray"} flex-shrink-0`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
