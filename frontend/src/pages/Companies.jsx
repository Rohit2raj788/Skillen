import React, { useState } from "react";
import { toast } from "sonner";
import { SectionHeading, SectionLabel, PrimaryBtn } from "@/components/Primitives";
import { Input } from "@/pages/Students";
import { api, formatApiError } from "@/lib/api";
import { Building, Users, Briefcase, Target, Layers, Workflow } from "lucide-react";

const SERVICES = [
  { icon: <Building />, title: "Fresher Hiring", desc: "Pre-screened entry-level talent across 8 domains." },
  { icon: <Users />, title: "Internship Hiring", desc: "Convert interns into FT hires through structured drives." },
  { icon: <Briefcase />, title: "Campus Recruitment", desc: "End-to-end campus drives at our 20+ partner colleges." },
  { icon: <Target />, title: "Bulk Hiring Support", desc: "Scale up to 100+ hires per cycle with a single SPOC." },
  { icon: <Layers />, title: "Talent Outsourcing", desc: "Trained candidates billed on a per-resource model." },
  { icon: <Workflow />, title: "Custom Hiring Drives", desc: "Role-specific bootcamps + drives mapped to your JD." },
];

export default function Companies() {
  const [form, setForm] = useState({ company_name: "", contact_person: "", email: "", phone: "", hiring_requirement: "", number_of_positions: 5 });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/leads/hiring", { ...form, number_of_positions: Number(form.number_of_positions) });
      toast.success("Hiring request received — our team will reach out within 24 hours.");
      setForm({ company_name: "", contact_person: "", email: "", phone: "", hiring_requirement: "", number_of_positions: 5 });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="bg-[#06252C] text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionLabel>For Companies</SectionLabel>
            <h1 className="mt-5 font-display text-5xl lg:text-6xl font-black leading-[1.02]">
              Hire <span className="text-[#F26C21]">industry-ready</span> talent. Faster.
            </h1>
            <p className="mt-5 text-lg text-white/75 max-w-lg">
              We pre-screen, train, and behaviour-test candidates. You do the final round. Time-to-hire drops by up to 60%.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
              <Stat n="500+" l="Candidates" />
              <Stat n="8" l="Domains" />
              <Stat n="60%" l="Faster Hiring" />
            </div>
          </div>
          <img src="https://images.pexels.com/photos/8463151/pexels-photo-8463151.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Office" className="rounded-sm aspect-[4/3] object-cover" />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading eyebrow="Services" title="What we do for your hiring team." />
          <div className="mt-12 grid md:grid-cols-3 gap-px bg-[#06252C]/10">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white p-7 hover:bg-[#F4F4F4] transition" data-testid={`company-service-${s.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="grid h-11 w-11 place-items-center bg-[#F26C21] text-white rounded-sm">{s.icon}</div>
                <p className="mt-5 font-display text-lg font-bold text-[#06252C]">{s.title}</p>
                <p className="mt-2 text-sm text-[#163A44]/75">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F4F4F4]">
        <div className="mx-auto max-w-3xl px-5 lg:px-10">
          <SectionHeading eyebrow="Hiring Request" title="Tell us what you need." sub="A SkillEn talent partner will reach out within 24 hours." />
          <form onSubmit={submit} className="mt-10 space-y-4 bg-white p-8 rounded-sm border border-[#06252C]/10" data-testid="hiring-form">
            <Input label="Company name" value={form.company_name} onChange={(v) => setForm({ ...form, company_name: v })} required tid="h-company" />
            <Input label="Contact person" value={form.contact_person} onChange={(v) => setForm({ ...form, contact_person: v })} required tid="h-contact" />
            <Input label="Work email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required tid="h-email" />
            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} tid="h-phone" />
            <Input label="Hiring requirement" value={form.hiring_requirement} onChange={(v) => setForm({ ...form, hiring_requirement: v })} required textarea tid="h-req" />
            <Input label="Number of positions" type="number" value={form.number_of_positions} onChange={(v) => setForm({ ...form, number_of_positions: v })} required tid="h-positions" />
            <PrimaryBtn type="submit" disabled={busy} data-testid="hiring-submit">{busy ? "Sending..." : "Submit Request"}</PrimaryBtn>
          </form>
        </div>
      </section>
    </>
  );
}

function Stat({ n, l }) {
  return (
    <div>
      <p className="font-display text-3xl font-black text-[#F26C21]">{n}</p>
      <p className="text-xs text-white/70 mt-1">{l}</p>
    </div>
  );
}
