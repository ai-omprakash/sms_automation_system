import { useEffect, useState } from "react";
import api from "../api/axios";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { TrendingUp, Send, XCircle, MessageSquare, BarChart2 } from "lucide-react";

const STATUS_COLORS = { sent: "#6366f1", failed: "#ef4444", pending: "#f59e0b", delivered: "#22c55e" };
const PIE_COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"];

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);

  useEffect(() => {
    api.get("/analytics/overview").then(r => setOverview(r.data)).catch(() => {});
    api.get("/analytics/sms-by-status").then(r => setStatusData(r.data)).catch(() => {});
    api.get("/analytics/campaign-stats").then(r => setCampaignData(r.data)).catch(() => {});
  }, []);

  const metrics = overview ? [
    { label: "Total SMS",      value: overview.total_sms,            icon: MessageSquare, color: "text-indigo-600",  bg: "bg-indigo-50" },
    { label: "Sent",           value: overview.sent,                  icon: Send,          color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Failed",         value: overview.failed,                icon: XCircle,       color: "text-red-600",     bg: "bg-red-50" },
    { label: "Delivery Rate",  value: `${overview.delivery_rate}%`,   icon: TrendingUp,    color: "text-violet-600",  bg: "bg-violet-50" },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={19} className={color} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie */}
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-1">Status Distribution</h3>
          <p className="text-sm text-slate-400 mb-6">Breakdown of all messages</p>
          {statusData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300">
              <BarChart2 size={36} className="mb-3" /><p className="text-sm">No data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="count" nameKey="status" cx="50%" cy="50%"
                  outerRadius={95} innerRadius={50} paddingAngle={3}
                  label={e => `${e.status} (${e.count})`} labelLine={{ stroke: "#cbd5e1" }}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.status] || PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Campaign bar */}
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-1">Campaign Performance</h3>
          <p className="text-sm text-slate-400 mb-6">Sent vs total per campaign</p>
          {campaignData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300">
              <BarChart2 size={36} className="mb-3" /><p className="text-sm">No campaigns yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={campaignData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }} />
                <Legend />
                <Bar dataKey="total" fill="#e0e7ff" radius={[6,6,0,0]} name="Total" />
                <Bar dataKey="sent"  fill="#6366f1" radius={[6,6,0,0]} name="Sent" />
                <Bar dataKey="failed" fill="#ef4444" radius={[6,6,0,0]} name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
