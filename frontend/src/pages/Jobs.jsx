import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, MapPin, Calendar, Briefcase, X } from "lucide-react";
import { SectionLabel, SectionHeading, PrimaryBtn } from "@/components/Primitives";
import Seo from "@/components/Seo";
import { Input } from "@/pages/Students";
import { api, formatApiError } from "@/lib/api";

export default function Jobs() {
  const location = useLocation();
  const isInternships = location.pathname.startsWith("/internships");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState(isInternships ? "Internship" : "all");
  const [applyTo, setApplyTo] = useState(null);

  useEffect(() => { setFilterType(isInternships ? "Internship" : "all"); }, [isInternships]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filterType !== "all") params.type = filterType;
    if (q) params.q = q;
    const t = setTimeout(() => {
      api.get("/jobs", { params })
        .then(({ data }) => setItems(data))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [q, filterType]);

  return (
    <>
      <Seo
        title={isInternships ? "Internship Openings" : "Live Jobs & Internships"}
        description="Browse and apply to live openings from SkillEn's 50+ hiring partner network. Real recruiters, fast responses."
      />
      <section className="border-b border-[#06252C]/10 bg-[#F4F4F4]">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
          <SectionLabel>{isInternships ? "Internships" : "Jobs & Internships"}</SectionLabel>
          <h1 className="mt-4 font-display text-5xl lg:text-6xl font-black text-[#06252C] max-w-3xl leading-[1.02]">
            {isInternships ? "Real internships. Real teams." : "Live openings from our partner network."}
          </h1>
          <p className="mt-5 text-lg text-[#163A44]/75 max-w-2xl">
            Apply directly — every application reaches a real recruiter, not a black hole.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              data-testid="jobs-search"
              placeholder="Search by title, company, location..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 border border-[#06252C]/20 px-4 py-3 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]"
            />
            <div className="flex gap-2">
              {["all", "Job", "Internship"].map((t) => (
                <button key={t} onClick={() => setFilterType(t)} data-testid={`filter-${t.toLowerCase()}`}
                  className={`text-xs uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-sm border ${filterType === t ? "bg-[#06252C] text-white border-[#06252C]" : "border-[#06252C]/20 text-[#06252C] hover:border-[#F26C21]"}`}>
                  {t === "all" ? "All" : t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-[#163A44]/60">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-[#163A44]/60">No openings match your filters right now.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {items.map((j) => (
                <article key={j.id} className="border border-[#06252C]/10 p-6 rounded-sm hover:border-[#F26C21] hover:-translate-y-1 transition" data-testid={`job-${j.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#F26C21]">{j.type}</p>
                      <h3 className="mt-2 font-display text-xl font-extrabold text-[#06252C] leading-tight">{j.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-[#163A44]">{j.company}</p>
                    </div>
                    {j.salary && <span className="text-xs font-bold text-[#06252C] bg-[#F4F4F4] px-2 py-1 rounded-sm whitespace-nowrap">{j.salary}</span>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#163A44]/70">
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {j.location}</span>
                    {j.apply_deadline && <span className="inline-flex items-center gap-1"><Calendar size={12} /> Apply by {j.apply_deadline}</span>}
                  </div>
                  <p className="mt-4 text-sm text-[#163A44]/80 line-clamp-3">{j.description}</p>
                  {j.skills && j.skills.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {j.skills.map((s) => <li key={s} className="text-[11px] px-2 py-1 bg-[#F4F4F4] text-[#06252C] rounded-sm">{s}</li>)}
                    </ul>
                  )}
                  <button onClick={() => setApplyTo(j)} data-testid={`apply-${j.id}`} className="mt-5 inline-flex items-center gap-2 bg-[#F26C21] text-white px-4 py-2 text-sm font-semibold rounded-sm hover:bg-[#FF6600]">
                    Apply Now <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {applyTo && <ApplyModal job={applyTo} onClose={() => setApplyTo(null)} />}
    </>
  );
}

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", resume_url: "", cover_note: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/jobs/apply", { job_id: job.id, ...form });
      toast.success("Application submitted! The recruiter will get in touch.");
      onClose();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-sm max-w-lg w-full max-h-[90vh] overflow-auto p-7 space-y-4" data-testid="apply-modal">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#F26C21]">Apply for</p>
            <h2 className="mt-1 font-display text-xl font-extrabold text-[#06252C]">{job.title}</h2>
            <p className="text-sm text-[#163A44]/70">{job.company} · {job.location}</p>
          </div>
          <button type="button" onClick={onClose}><X /></button>
        </div>
        <Input label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required tid="apply-name" />
        <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required tid="apply-email" />
        <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required tid="apply-phone" />
        <Input label="Resume URL (Google Drive / LinkedIn / GitHub)" value={form.resume_url} onChange={(v) => setForm({ ...form, resume_url: v })} tid="apply-resume" />
        <Input label="Why are you a fit? (optional)" value={form.cover_note} onChange={(v) => setForm({ ...form, cover_note: v })} textarea tid="apply-cover" />
        <PrimaryBtn type="submit" disabled={busy} data-testid="apply-submit">{busy ? "Submitting..." : "Submit Application"}</PrimaryBtn>
      </form>
    </div>
  );
}
