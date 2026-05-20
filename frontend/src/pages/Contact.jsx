import { useEffect, useState } from "react";
import api from "../api/axios";
import { Users, Plus, Trash2, Loader2, UserCircle } from "lucide-react";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchContacts = () => api.get("/contacts/").then(r => setContacts(r.data)).catch(() => {});
  useEffect(() => { fetchContacts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contacts/", form);
      setForm({ name: "", phone: "", email: "" });
      setShowForm(false);
      fetchContacts();
    } catch (err) { alert(err.response?.data?.detail || "Failed"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this contact?")) return;
    await api.delete(`/contacts/${id}`);
    fetchContacts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Contact
        </button>
      </div>

      {showForm && (
        <div className="card border-indigo-100">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><UserCircle size={18} className="text-indigo-500" /> New Contact</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
              <input type="text" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="input-field" placeholder="+977XXXXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="john@email.com" />
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Plus size={15} /> Save Contact</>}
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
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <Users size={18} className="text-slate-500" /> Contacts <span className="text-slate-400 font-normal text-sm">({contacts.length})</span>
        </h3>
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
            <Users size={40} className="mb-3" />
            <p className="text-sm font-medium">No contacts yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Name","Phone","Email","Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id} className="table-row">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-lg flex items-center justify-center text-indigo-600 text-xs font-bold">
                          {(c.name || c.phone)?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{c.name || "—"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-sm text-slate-600 font-mono">{c.phone}</td>
                    <td className="py-3.5 pr-4 text-sm text-slate-500">{c.email || "—"}</td>
                    <td className="py-3.5">
                      <button onClick={() => handleDelete(c.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                        <Trash2 size={15} />
                      </button>
                    </td>
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
