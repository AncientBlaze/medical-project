import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../utils/api";

const LeadsManager = () => {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);



  // 🔥 Fetch leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leads");
      setLeads(res.data.data);
      setFiltered(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // 🔍 Filtering logic
  useEffect(() => {
    let data = [...leads];

    if (search) {
      data = data.filter((lead) =>
        `${lead.name} ${lead.email} ${lead.phone}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      data = data.filter((l) => l.type === typeFilter);
    }

    if (statusFilter !== "all") {
      data = data.filter((l) => l.status === statusFilter);
    }

    setFiltered(data);
  }, [search, typeFilter, statusFilter, leads]);

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this lead?")) return;

    try {
      await api.delete(`leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 Update status
  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`leads/${id}`, { status });
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 rounded-2xl border shadow-sm
      bg-white dark:bg-slate-900/40
      border-slate-200 dark:border-slate-700/60">

      <h2 className="text-xl font-bold mb-6 text-[#2d409c] dark:text-white">
        Leads Manager
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search name, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl w-64 text-sm border transition-colors focus:outline-none focus:ring-2
            bg-white dark:bg-slate-900
            text-[#2d409c] dark:text-white
            placeholder-slate-400 dark:placeholder-slate-600
            border-slate-200 dark:border-slate-700/60
            focus:border-[#F9B406] dark:focus:border-teal-500
            focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 cursor-pointer
            bg-white dark:bg-slate-900
            text-[#2d409c] dark:text-white
            border-slate-200 dark:border-slate-700/60
            focus:border-[#F9B406] dark:focus:border-teal-500
            focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
        >
          <option value="all">All Types</option>
          <option value="abroad">Abroad</option>
          <option value="admission">Admission</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 cursor-pointer
            bg-white dark:bg-slate-900
            text-[#2d409c] dark:text-white
            border-slate-200 dark:border-slate-700/60
            focus:border-[#F9B406] dark:focus:border-teal-500
            focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-700/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200 dark:border-slate-700/60
              bg-slate-50 dark:bg-slate-800/40
              text-[#2d409c] dark:text-white">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Details</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-[#2d409c] dark:text-slate-600">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-[#2d409c] dark:text-slate-600">
                  No leads found
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr key={lead._id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">

                  <td className="px-4 py-3 font-semibold text-[#2d409c] dark:text-white whitespace-nowrap">
                    {lead.name}
                  </td>

                  <td className="px-4 py-3 text-[#2d409c] dark:text-[#2d409c]">
                    {lead.email || '—'}
                  </td>

                  <td className="px-4 py-3 text-[#2d409c] dark:text-[#2d409c] whitespace-nowrap">
                    {lead.phone}
                  </td>

                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border
                      ${lead.type === 'abroad'
                        ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20'
                        : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                      }`}>
                      {lead.type ?? 'general'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-[#2d409c] dark:text-[#2d409c] max-w-[200px] truncate">
                    {lead.type === 'abroad'
                      ? `${lead.university || '—'}, ${lead.country || ''}`
                      : `${lead.college || '—'}, ${lead.state || ''}`}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer focus:outline-none transition-colors
                        ${lead.status === 'new'       ? 'bg-[#F9B406]/10 dark:bg-teal-500/10 border-[#F9B406]/30 dark:border-teal-500/30 text-[#c8920a] dark:text-teal-400' :
                          lead.status === 'contacted'  ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400' :
                          lead.status === 'converted'  ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                          'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400'
                        }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="text-xs font-semibold text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsManager;