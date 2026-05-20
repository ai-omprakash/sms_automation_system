import { useEffect, useState } from "react";
import api from "../api/axios";
import { Key, Plus, Trash2, Loader2, Copy, CheckCheck, Eye, EyeOff } from "lucide-react";

export default function APIKeys() {
  const [keys, setKeys] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = () => api.get("/keys/").then(r => setKeys(r.data)).catch(() => {});
  useEffect(() => { fetchKeys(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/keys/", { name });
      setNewKey(res.data.key);
      setName("");
      fetchKeys();
    } catch (err) { alert(err.response?.data?.detail || "Failed"); }
    finally { setLoading(false); }
  };

  const handleRevoke = async (id) => {
    if (!confirm("Revoke this key?")) return;
    await api.delete(`/keys/${id}`);
    fetchKeys();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* New key alert */}
      {newKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-sm font-bold text-amber-800 mb-2">⚠️ Save this key now — it won't be shown again!</p>
          <div className="flex items-center gap-3 bg-white rounded-xl border border-amber-200 px-4 py-3">
            <code className="text-sm font-mono text-slate-700 flex-1 truncate">{newKey}</code>
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition">
              {copied ? <><CheckCheck size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="text-xs text-amber-600 mt-3 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Create */}
      <div className="card">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><Key size={18} className="text-indigo-500" /> Generate API Key</h3>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input required value={name} onChange={e => setName(e.target.value)}
            className="input-field flex-1" placeholder="Key name (e.g. Production App)" />
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Generate
          </button>
        </form>
      </div>

      {/* List */}
      <div className="card">
        <h3 className="font-bold text-slate-800 mb-5">Your API Keys <span className="text-slate-400 font-normal text-sm">({keys.length})</span></h3>
        {keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
            <Key size={40} className="mb-3" /><p className="text-sm font-medium">No API keys yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map(k => (
              <div key={k.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="min-w-0 mr-4">
                  <p className="font-semibold text-slate-800 text-sm">{k.name}</p>
                  <code className="text-xs text-slate-400 font-mono">{k.key}</code>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`badge ${k.is_active ? "badge-green" : "badge-gray"}`}>{k.is_active ? "Active" : "Revoked"}</span>
                  <span className="text-xs text-slate-400">{k.usage} uses</span>
                  {k.is_active && (
                    <button onClick={() => handleRevoke(k.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
