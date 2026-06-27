import React, { useState } from "react";
import { toast } from "sonner";
import { SectionHeading, SectionLabel, PrimaryBtn } from "@/components/Primitives";
import Seo from "@/components/Seo";
import { Input } from "@/pages/Students";
import { api, formatApiError } from "@/lib/api";
import { GraduationCap, Code2, Mic, MessageSquare, Briefcase, Users2 } from "lucide-react";

const SERVICES = [
  { icon: <GraduationCap />, title: "Placement Training", desc: "Structured 4–8 week training before your placement season." },
  { icon: <Code2 />, title: "Technical Bootcamps", desc: "Tech, QA, Automation — taught by active engineers." },
  { icon: <Mic />, title: "Mock Interview Drives", desc: "Full-day drives with senior hiring managers on campus." },
  { icon: <MessageSquare />, title: "Soft Skills Workshops", desc: "Communication, GD, HR-prep — measurable improvement in 3 weeks." },
  { icon: <Briefcase />, title: "Internship Programs", desc: "Real internships at our 50+ partner companies." },
  { icon: <Users2 />, title: "Industry Expert Sessions", desc: "Quarterly fireside chats with industry leaders." },
];

export default function Colleges() {
  const [form, setForm] = useState({ college_name: "", contact_person: "", email: "", phone: "", interested_in: SERVICES[0].title, message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/leads/college", form);
      toast.success("Inquiry received — our partnerships team will reach out.");
      setForm({ college_name: "", contact_person: "", email: "", phone: "", interested_in: SERVICES[0].title, message: "" });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Career-Readiness Programs for Colleges" description="Placement training, bootcamps, mock interview drives, and industry expert sessions for 20+ partner colleges across India." />
      <section className="border-b border-[#06252C]/10 bg-[#F4F4F4]">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionLabel>For Colleges</SectionLabel>
            <h1 className="mt-5 font-display text-5xl lg:text-6xl font-black text-[#06252C] leading-[1.02]">
              Empowering colleges with <span className="text-[#F26C21]">career readiness</span> programs.
            </h1>
            <p className="mt-5 text-lg text-[#163A44]/75 max-w-lg">
              We partner with 20+ colleges across India to run placement training, bootcamps, and live hiring drives.
            </p>
          </div>
          <img src="https://images.pexels.com/photos/7972324/pexels-photo-7972324.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="College campus" className="rounded-sm aspect-[4/3] object-cover" />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading eyebrow="Services" title="A complete career-readiness stack for your campus." />
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div key={s.title} className="border border-[#06252C]/10 p-7 hover:border-[#F26C21] hover:-translate-y-1 transition rounded-sm" data-testid={`college-service-${s.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="grid h-11 w-11 place-items-center bg-[#06252C] text-white rounded-sm">{s.icon}</div>
                <p className="mt-5 font-display text-lg font-bold text-[#06252C]">{s.title}</p>
                <p className="mt-2 text-sm text-[#163A44]/75">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#06252C] text-white">
        <div className="mx-auto max-w-3xl px-5 lg:px-10">
          <SectionHeading eyebrow="Partnership Inquiry" title={<span className="text-white">Build a future-ready batch.</span>} sub={<span className="text-white/70">Tell us about your campus — we'll draft a custom partnership in 48 hours.</span>} />
          <form onSubmit={submit} className="mt-10 space-y-4 bg-white p-8 rounded-sm text-[#06252C]" data-testid="college-form">
            <Input label="College / University name" value={form.college_name} onChange={(v) => setForm({ ...form, college_name: v })} required tid="c-college" />
            <Input label="Contact person" value={form.contact_person} onChange={(v) => setForm({ ...form, contact_person: v })} required tid="c-contact" />
            <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required tid="c-email" />
            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} tid="c-phone" />
            <div>
              <label className="text-xs uppercase tracking-[0.2em] font-bold">Interested in</label>
              <select
                className="mt-1 w-full border border-[#06252C]/20 px-3 py-3 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]"
                value={form.interested_in}
                onChange={(e) => setForm({ ...form, interested_in: e.target.value })}
                data-testid="c-interest"
              >
                {SERVICES.map((s) => <option key={s.title}>{s.title}</option>)}
              </select>
            </div>
            <Input label="Message" value={form.message} onChange={(v) => setForm({ ...form, message: v })} textarea tid="c-message" />
            <PrimaryBtn type="submit" disabled={busy} data-testid="college-submit">{busy ? "Sending..." : "Submit Inquiry"}</PrimaryBtn>
          </form>
        </div>
      </section>
    </>
  );
}
