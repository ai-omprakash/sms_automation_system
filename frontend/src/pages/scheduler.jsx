import { useEffect, useState } from "react";
import api from "../api/axios";
import { Clock, Plus, Trash2, Loader2, Calendar } from "lucide-react";

export default function Scheduler() {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ name: "", message: "", to_number: "", run_at: "" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchSchedules = () => api.get("/schedules/").then(r => setSchedules(r.data)).catch(() => {});
  useEffect(() => { fetchSchedules(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/schedules/", { ...form, is_recurring: false, is_active: true });
      setForm({ name: "", message: "", to_number: "", run_at: "" });
      setShowForm(false);
      fetchSchedules();
    } catch (err) { alert(err.response?.data?.detail || "Failed"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this schedule?")) return;
    await api.delete(`/schedules/${id}`);
    fetchSchedules();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Schedule Message
        </button>
      </div>

      {showForm && (
        <div className="card border-indigo-100">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" /> New Scheduled Message
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Schedule Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="e.g. Birthday Promo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <input required value={form.to_number} onChange={e => setForm({ ...form, to_number: e.target.value })}
                className="input-field" placeholder="+977XXXXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Schedule Date & Time</label>
              <input type="datetime-local" required value={form.run_at}
                onChange={e => setForm({ ...form, run_at: e.target.value })}
                className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
              <textarea rows={3} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className="input-field resize-none" placeholder="Your scheduled message..." />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Clock size={15} /> Schedule</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="font-bold text-slate-800 mb-5">
          Scheduled Messages <span className="text-slate-400 font-normal text-sm">({schedules.length})</span>
        </h3>
        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
            <Calendar size={40} className="mb-3" />
            <p className="text-sm font-medium">No scheduled messages</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map(s => (
              <div key={s.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition group">
                <div className="min-w-0 mr-4">
                  <p className="font-semibold text-slate-800 text-sm">{s.name || "Unnamed"}</p>
                  <p className="text-sm text-slate-500 mt-1 truncate">{s.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-slate-400 font-mono">{s.to_number}</span>
                    {s.run_at && (
                      <span className="text-xs text-indigo-500 flex items-center gap-1">
                        <Clock size={11} /> {new Date(s.run_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(s.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
