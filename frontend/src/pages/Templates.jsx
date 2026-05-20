import { useEffect, useState } from "react";
import api from "../api/axios";
import { FileText, Plus, Trash2, Loader2, Copy, CheckCheck } from "lucide-react";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ name: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(null);

  const fetchTemplates = () => api.get("/templates/").then(r => setTemplates(r.data)).catch(() => {});
  useEffect(() => { fetchTemplates(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/templates/", form);
      setForm({ name: "", body: "" });
      setShowForm(false);
      fetchTemplates();
    } catch (err) { alert(err.response?.data?.detail || "Failed"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this template?")) return;
    await api.delete(`/templates/${id}`);
    fetchTemplates();
  };

  const handleCopy = (body, id) => {
    navigator.clipboard.writeText(body);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Template
        </button>
      </div>

      {showForm && (
        <div className="card border-indigo-100">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><FileText size={18} className="text-indigo-500" /> Create Template</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Template Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="e.g. Welcome Message" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message Body</label>
              <textarea rows={4} required value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
                className="input-field resize-none" placeholder="Hi {{name}}, your message here..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : "Save Template"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="font-bold text-slate-800 mb-5">Saved Templates <span className="text-slate-400 font-normal text-sm">({templates.length})</span></h3>
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
            <FileText size={40} className="mb-3" /><p className="text-sm font-medium">No templates yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(t => (
              <div key={t.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-indigo-200 transition group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText size={14} className="text-indigo-600" />
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleCopy(t.body, t.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-indigo-500 transition">
                      {copied === t.id ? <CheckCheck size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                    <button onClick={() => handleDelete(t.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-red-500 transition">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{t.body}</p>
                <p className="text-xs text-slate-400 mt-3">{new Date(t.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
