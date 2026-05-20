import { useEffect, useState } from "react";
import api from "../api/axios";
import { Send, Loader2, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";

const statusIcon = { sent: <CheckCircle size={14} className="text-emerald-500" />, failed: <XCircle size={14} className="text-red-500" />, pending: <Clock size={14} className="text-amber-500" />, delivered: <CheckCircle size={14} className="text-blue-500" /> };
const statusBadge = { sent: "badge-green", failed: "badge-red", pending: "badge-yellow", delivered: "badge-blue" };

export default function SendSms() {
  const [form, setForm] = useState({ to: "", body: "", provider: "mock" });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const fetchLogs = () => api.get("/sms/logs").then(r => setLogs(r.data)).catch(() => {});
  useEffect(() => { fetchLogs(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSent(false);
    try {
      await api.post("/sms/send", form);
      setSent(true);
      setForm({ ...form, to: "", body: "" });
      fetchLogs();
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  const charCount = form.body.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Send form */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Send size={18} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Send SMS</h3>
            <p className="text-sm text-slate-400">Send a message to any number</p>
          </div>
        </div>

        {sent && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm font-medium">
            <CheckCircle size={16} /> Message sent successfully!
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
            <input type="text" required value={form.to}
              onChange={e => setForm({ ...form, to: e.target.value })}
              className="input-field" placeholder="+977XXXXXXXXXX" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700">Message</label>
              <span className={`text-xs ${charCount > 160 ? "text-red-500" : "text-slate-400"}`}>{charCount}/160</span>
            </div>
            <textarea rows={5} required value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
              className="input-field resize-none" placeholder="Type your message here..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Provider</label>
            <select value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })}
              className="input-field">
              <option value="mock">🧪 Mock (Testing)</option>
              <option value="twilio">Twilio</option>
              <option value="vonage">Vonage</option>
              <option value="fast2sms">Fast2SMS</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
          </button>
        </form>
      </div>

      {/* Logs */}
      <div className="card flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
            <MessageSquare size={18} className="text-slate-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Message Logs</h3>
            <p className="text-sm text-slate-400">{logs.length} messages total</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 max-h-[500px]">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300">
              <MessageSquare size={36} className="mb-3" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : logs.map(log => (
            <div key={log.id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition border border-slate-100">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-semibold text-slate-700">{log.to}</span>
                <span className={`badge ${statusBadge[log.status] || "badge-gray"} flex-shrink-0 flex items-center gap-1`}>
                  {statusIcon[log.status]} {log.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 truncate">{log.body}</p>
              <p className="text-xs text-slate-400 mt-2">{new Date(log.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
