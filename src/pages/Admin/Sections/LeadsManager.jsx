import { useEffect, useState } from "react";
import axios from "axios";

const LeadsManager = () => {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const API = "/api/leads"; // adjust if needed

  // 🔥 Fetch leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
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
      await axios.delete(`${API}/${id}`);
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 Update status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Leads Manager</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search name/email/phone..."
          className="border px-3 py-2 rounded-lg w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="abroad">Abroad</option>
          <option value="admission">Admission</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6">
                  No leads found
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr key={lead._id} className="border-t">
                  <td className="p-3">{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td className="capitalize">{lead.type}</td>

                  <td>
                    {lead.type === "abroad"
                      ? `${lead.university || "-"}, ${lead.country || ""}`
                      : `${lead.college || "-"}, ${lead.state || ""}`}
                  </td>

                  {/* Status */}
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td>
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="text-red-500 hover:underline"
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