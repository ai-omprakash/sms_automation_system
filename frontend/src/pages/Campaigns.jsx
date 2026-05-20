import { useEffect, useState } from "react";
import api from "../api/axios";
import { Zap, Loader2, Plus, Users, CheckCircle, XCircle, Clock } from "lucide-react";

const statusColor = { draft: "badge-gray", running: "badge-blue", sent: "badge-green", failed: "badge-red" };

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ name: "", message: "", numbers: "", provider: "mock" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchCampaigns = () => api.get("/campaigns/").then(r => setCampaigns(r.data)).catch(() => {});
  useEffect(() => { fetchCampaigns(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const numbers = form.numbers.split("\n").map(n => n.trim()).filter(Boolean);
      if (numbers.length === 0) { alert("Add at least one phone number"); setLoading(false); return; }
      const res = await api.post("/campaigns/", { name: form.name, message: form.message, numbers, provider: form.provider });
      await api.post(`/campaigns/${res.data.campaign_id}/launch`);
      setForm({ name: "", message: "", numbers: "", provider: "mock" });
      setShowForm(false);
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div />
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card border-indigo-100">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><Zap size={18} className="text-indigo-500" /> Create Campaign</h3>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Campaign Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" placeholder="e.g. June Promo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Provider</label>
                <select value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })}
                  className="input-field">
                  <option value="mock">🧪 Mock (Testing)</option>
                  <option value="twilio">Twilio</option>
                  <option value="vonage">Vonage</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea rows={3} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none" placeholder="Your campaign message..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Numbers <span className="text-slate-400 font-normal">(one per line)</span>
                </label>
                <textarea rows={5} required value={form.numbers} onChange={e => setForm({ ...form, numbers: e.target.value })}
                  className="input-field resize-none font-mono text-xs" placeholder={"+977XXXXXXXXXX\n+977XXXXXXXXXX"} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <><Loader2 size={15} className="animate-spin" /> Launching...</> : <><Zap size={15} /> Launch Campaign</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaign list */}
      <div className="card">
        <h3 className="font-bold text-slate-800 mb-5">All Campaigns <span className="text-slate-400 font-normal text-sm ml-1">({campaigns.length})</span></h3>
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
            <Zap size={40} className="mb-3" />
            <p className="text-sm font-medium">No campaigns yet</p>
            <p className="text-xs mt-1">Click "New Campaign" to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Campaign","Status","Recipients","Sent","Failed","Created"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} className="table-row">
                    <td className="py-3.5 pr-4">
                      <p className="font-semibold text-slate-800 text-sm">{c.name}</p>
                    </td>
                    <td className="py-3.5 pr-4"><span className={`badge ${statusColor[c.status] || "badge-gray"}`}>{c.status}</span></td>
                    <td className="py-3.5 pr-4 text-sm text-slate-600">{c.total}</td>
                    <td className="py-3.5 pr-4 text-sm text-emerald-600 font-medium">{c.sent}</td>
                    <td className="py-3.5 pr-4 text-sm text-red-500 font-medium">0</td>
                    <td className="py-3.5 text-xs text-slate-400">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
