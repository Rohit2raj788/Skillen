import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Users, FileText, Inbox, BarChart3, Trash2, Plus, X, Briefcase } from "lucide-react";
import { Logo } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { api, formatApiError } from "@/lib/api";

const LEAD_TYPE_LABELS = {
  contact: "Contact",
  hiring: "Hiring Request",
  college: "College Inquiry",
  mock_booking: "Mock Booking",
  student_enroll: "Student Enroll",
  job_apply: "Job Application",
};

const TYPE_COLORS = {
  contact: "bg-blue-100 text-blue-800",
  hiring: "bg-purple-100 text-purple-800",
  college: "bg-green-100 text-green-800",
  mock_booking: "bg-orange-100 text-orange-800",
  student_enroll: "bg-pink-100 text-pink-800",
  job_apply: "bg-teal-100 text-teal-800",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [leadType, setLeadType] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [showBlog, setShowBlog] = useState(null);
  const [showJob, setShowJob] = useState(null);

  const doLogout = () => { logout(); navigate("/admin/login"); };

  const loadStats = async () => {
    try { const { data } = await api.get("/admin/stats"); setStats(data); } catch (e) { toast.error(formatApiError(e)); }
  };
  const loadLeads = async () => {
    try { const { data } = await api.get("/admin/leads", { params: leadType !== "all" ? { lead_type: leadType } : {} }); setLeads(data); }
    catch (e) { toast.error(formatApiError(e)); }
  };
  const loadBlogs = async () => {
    try { const { data } = await api.get("/admin/blogs"); setBlogs(data); } catch (e) { toast.error(formatApiError(e)); }
  };
  const loadJobs = async () => {
    try { const { data } = await api.get("/admin/jobs"); setJobs(data); } catch (e) { toast.error(formatApiError(e)); }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { if (tab === "leads") loadLeads(); }, [tab, leadType]);
  useEffect(() => { if (tab === "blogs") loadBlogs(); }, [tab]);
  useEffect(() => { if (tab === "jobs") loadJobs(); }, [tab]);

  const updateStatus = async (id, status) => {
    try { await api.patch(`/admin/leads/${id}`, { status }); toast.success("Updated"); loadLeads(); loadStats(); }
    catch (e) { toast.error(formatApiError(e)); }
  };
  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try { await api.delete(`/admin/leads/${id}`); toast.success("Deleted"); loadLeads(); loadStats(); }
    catch (e) { toast.error(formatApiError(e)); }
  };
  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try { await api.delete(`/admin/blogs/${id}`); toast.success("Deleted"); loadBlogs(); loadStats(); }
    catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <header className="bg-white border-b border-[#06252C]/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden md:inline text-xs uppercase tracking-[0.25em] text-[#F26C21] font-bold">Admin Console</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#06252C]/70 hidden md:inline">{user?.email}</span>
            <Link to="/" className="text-sm text-[#06252C]/70 hover:text-[#F26C21]">View Site</Link>
            <button onClick={doLogout} data-testid="admin-logout" className="inline-flex items-center gap-2 bg-[#06252C] text-white px-4 py-2 text-sm font-semibold rounded-sm hover:bg-[#F26C21] transition">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <TabBtn active={tab === "overview"} onClick={() => setTab("overview")} icon={<BarChart3 size={14} />} label="Overview" tid="tab-overview" />
          <TabBtn active={tab === "leads"} onClick={() => setTab("leads")} icon={<Inbox size={14} />} label="Leads" tid="tab-leads" />
          <TabBtn active={tab === "blogs"} onClick={() => setTab("blogs")} icon={<FileText size={14} />} label="Blog" tid="tab-blogs" />
          <TabBtn active={tab === "jobs"} onClick={() => setTab("jobs")} icon={<Briefcase size={14} />} label="Jobs" tid="tab-jobs" />
        </div>

        {tab === "overview" && (
          <div data-testid="overview-panel">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Leads" value={stats?.total_leads ?? "—"} />
              <StatCard label="New Leads" value={stats?.new_leads ?? "—"} accent />
              <StatCard label="Blog Posts" value={stats?.total_blogs ?? "—"} />
              <StatCard label="Lead Types" value={stats ? Object.keys(stats.by_type).length : "—"} />
            </div>
            <div className="mt-6 bg-white rounded-sm border border-[#06252C]/10 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[#F26C21] font-bold">Breakdown by type</p>
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {stats && Object.entries(stats.by_type).map(([k, v]) => (
                  <div key={k} className="bg-[#F4F4F4] p-4 rounded-sm">
                    <p className="text-xs text-[#06252C]/60">{LEAD_TYPE_LABELS[k] || k}</p>
                    <p className="font-display text-2xl font-bold text-[#06252C]">{v}</p>
                  </div>
                ))}
                {stats && Object.keys(stats.by_type).length === 0 && <p className="text-sm text-[#06252C]/60">No leads yet.</p>}
              </div>
            </div>
          </div>
        )}

        {tab === "leads" && (
          <div data-testid="leads-panel">
            <div className="flex flex-wrap gap-2 mb-4">
              {["all", "contact", "hiring", "college", "mock_booking", "student_enroll", "job_apply"].map((t) => (
                <button key={t} onClick={() => setLeadType(t)} data-testid={`filter-${t}`}
                  className={`text-xs uppercase tracking-[0.2em] font-bold px-3 py-2 rounded-sm border ${leadType === t ? "bg-[#06252C] text-white border-[#06252C]" : "bg-white border-[#06252C]/20 text-[#06252C] hover:border-[#F26C21]"}`}>
                  {t === "all" ? "All" : LEAD_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-sm border border-[#06252C]/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#06252C] text-white text-xs uppercase tracking-[0.15em]">
                  <tr>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Name / Org</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-[#06252C]/60">No leads yet.</td></tr>
                  )}
                  {leads.map((l) => (
                    <React.Fragment key={l.id}>
                      <tr className="border-t border-[#06252C]/10 hover:bg-[#F4F4F4] cursor-pointer" onClick={() => setExpanded(expanded === l.id ? null : l.id)} data-testid={`lead-row-${l.id}`}>
                        <td className="px-4 py-3"><span className={`text-[10px] uppercase tracking-[0.15em] font-bold px-2 py-1 rounded-sm ${TYPE_COLORS[l.lead_type]}`}>{LEAD_TYPE_LABELS[l.lead_type]}</span></td>
                        <td className="px-4 py-3 font-medium">{l.name || l.company_name || l.college_name || l.contact_person || "—"}</td>
                        <td className="px-4 py-3 hidden md:table-cell text-[#163A44]/80">{l.email}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-[#163A44]/70 text-xs">{new Date(l.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <select value={l.status} onClick={(e) => e.stopPropagation()} onChange={(e) => updateStatus(l.id, e.target.value)} data-testid={`status-${l.id}`} className="text-xs border border-[#06252C]/20 rounded-sm px-2 py-1">
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={(e) => { e.stopPropagation(); deleteLead(l.id); }} data-testid={`delete-${l.id}`} className="text-red-600 hover:text-red-800"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                      {expanded === l.id && (
                        <tr className="bg-[#F4F4F4]">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                              {Object.entries(l).map(([k, v]) => (
                                <div key={k}><span className="font-bold uppercase text-[#06252C]/60">{k}:</span> <span className="text-[#06252C]">{String(v)}</span></div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "blogs" && (
          <div data-testid="blogs-panel">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-[#06252C]/70">{blogs.length} post(s)</p>
              <button onClick={() => setShowBlog({})} data-testid="new-blog-btn" className="inline-flex items-center gap-2 bg-[#F26C21] text-white px-4 py-2 text-sm font-semibold rounded-sm hover:bg-[#FF6600]">
                <Plus size={14} /> New Post
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {blogs.map((b) => (
                <div key={b.id} className="bg-white p-5 rounded-sm border border-[#06252C]/10" data-testid={`admin-blog-${b.slug}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#F26C21]">{b.category}</p>
                      <p className="font-display text-lg font-bold text-[#06252C] mt-1">{b.title}</p>
                      <p className="text-xs text-[#06252C]/60 mt-1">/{b.slug} · {b.published ? "Published" : "Draft"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowBlog(b)} className="text-xs text-[#06252C] underline hover:text-[#F26C21]">Edit</button>
                      <button onClick={() => deleteBlog(b.id)} className="text-red-600 hover:text-red-800"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "jobs" && (
          <div data-testid="jobs-panel">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-[#06252C]/70">{jobs.length} posting(s)</p>
              <button onClick={() => setShowJob({})} data-testid="new-job-btn" className="inline-flex items-center gap-2 bg-[#F26C21] text-white px-4 py-2 text-sm font-semibold rounded-sm hover:bg-[#FF6600]">
                <Plus size={14} /> New Posting
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map((j) => (
                <div key={j.id} className="bg-white p-5 rounded-sm border border-[#06252C]/10" data-testid={`admin-job-${j.id}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#F26C21]">{j.type} · {j.location}</p>
                      <p className="font-display text-lg font-bold text-[#06252C] mt-1">{j.title}</p>
                      <p className="text-xs text-[#06252C]/60 mt-1">{j.company} · {j.published ? "Published" : "Draft"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowJob(j)} className="text-xs text-[#06252C] underline hover:text-[#F26C21]">Edit</button>
                      <button onClick={() => deleteJob(j.id)} className="text-red-600 hover:text-red-800"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && <p className="text-sm text-[#06252C]/60">No postings yet — click "New Posting" to add one.</p>}
            </div>
          </div>
        )}
      </div>

      {showBlog && <BlogModal blog={showBlog} onClose={() => setShowBlog(null)} onSaved={() => { setShowBlog(null); loadBlogs(); loadStats(); }} />}
      {showJob && <JobModal job={showJob} onClose={() => setShowJob(null)} onSaved={() => { setShowJob(null); loadJobs(); loadStats(); }} />}
    </div>
  );
}

function TabBtn({ active, onClick, icon, label, tid }) {
  return (
    <button onClick={onClick} data-testid={tid} className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-sm transition ${active ? "bg-[#06252C] text-white" : "bg-white border border-[#06252C]/20 text-[#06252C] hover:border-[#F26C21]"}`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`p-6 rounded-sm border border-[#06252C]/10 ${accent ? "bg-[#06252C] text-white" : "bg-white"}`}>
      <p className={`text-xs uppercase tracking-[0.25em] font-bold ${accent ? "text-[#F26C21]" : "text-[#06252C]/60"}`}>{label}</p>
      <p className="font-display text-4xl font-black mt-2">{value}</p>
    </div>
  );
}

function BlogModal({ blog, onClose, onSaved }) {
  const isEdit = !!blog.id;
  const [form, setForm] = useState({
    title: blog.title || "",
    slug: blog.slug || "",
    category: blog.category || "Interview Preparation",
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    cover_image: blog.cover_image || "",
    author: blog.author || "SkillEn Team",
    published: blog.published ?? true,
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isEdit) await api.patch(`/admin/blogs/${blog.id}`, form);
      else await api.post("/admin/blogs", form);
      toast.success(isEdit ? "Updated" : "Created");
      onSaved();
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-auto p-6 space-y-4" data-testid="blog-modal">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold">{isEdit ? "Edit Post" : "New Post"}</h2>
          <button type="button" onClick={onClose}><X /></button>
        </div>
        <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v, slug: !isEdit ? v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : form.slug })} required tid="bm-title" />
        <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required tid="bm-slug" />
        <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} required tid="bm-category" />
        <Field label="Cover image URL" value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} tid="bm-cover" />
        <Field label="Author" value={form.author} onChange={(v) => setForm({ ...form, author: v })} tid="bm-author" />
        <Field label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} required textarea tid="bm-excerpt" />
        <Field label="Content (markdown-ish: use ## for headings, blank line between paragraphs)" value={form.content} onChange={(v) => setForm({ ...form, content: v })} required textarea rows={10} tid="bm-content" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
        <button type="submit" disabled={busy} data-testid="bm-save" className="w-full bg-[#F26C21] text-white py-3 text-sm font-semibold rounded-sm hover:bg-[#FF6600] disabled:opacity-50">
          {busy ? "Saving..." : (isEdit ? "Update Post" : "Create Post")}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, textarea, rows = 3, tid }) {
  const Cmp = textarea ? "textarea" : "input";
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#06252C]">{label}</label>
      <Cmp data-testid={tid} type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} rows={textarea ? rows : undefined}
        className="mt-1 w-full border border-[#06252C]/20 px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]" />
    </div>
  );
}

function JobModal({ job, onClose, onSaved }) {
  const isEdit = !!job.id;
  const [form, setForm] = useState({
    title: job.title || "",
    company: job.company || "",
    location: job.location || "",
    type: job.type || "Job",
    description: job.description || "",
    apply_deadline: job.apply_deadline || "",
    salary: job.salary || "",
    skills: (job.skills || []).join(", "),
    published: job.published ?? true,
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) };
      if (isEdit) await api.patch(`/admin/jobs/${job.id}`, payload);
      else await api.post("/admin/jobs", payload);
      toast.success(isEdit ? "Updated" : "Created");
      onSaved();
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-auto p-6 space-y-4" data-testid="job-modal">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold">{isEdit ? "Edit Posting" : "New Posting"}</h2>
          <button type="button" onClick={onClose}><X /></button>
        </div>
        <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required tid="jm-title" />
        <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} required tid="jm-company" />
        <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} required tid="jm-location" />
        <div>
          <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#06252C]">Type</label>
          <select data-testid="jm-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="mt-1 w-full border border-[#06252C]/20 px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]">
            <option>Job</option>
            <option>Internship</option>
          </select>
        </div>
        <Field label="Salary / Stipend (optional)" value={form.salary} onChange={(v) => setForm({ ...form, salary: v })} tid="jm-salary" />
        <Field label="Apply deadline (YYYY-MM-DD, optional)" value={form.apply_deadline} onChange={(v) => setForm({ ...form, apply_deadline: v })} tid="jm-deadline" />
        <Field label="Skills (comma-separated)" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} tid="jm-skills" />
        <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required textarea rows={6} tid="jm-desc" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
        <button type="submit" disabled={busy} data-testid="jm-save" className="w-full bg-[#F26C21] text-white py-3 text-sm font-semibold rounded-sm hover:bg-[#FF6600] disabled:opacity-50">
          {busy ? "Saving..." : (isEdit ? "Update Posting" : "Create Posting")}
        </button>
      </form>
    </div>
  );
}
