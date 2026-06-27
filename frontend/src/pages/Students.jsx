import React, { useState } from "react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading, SectionLabel, PrimaryBtn } from "@/components/Primitives";
import Seo from "@/components/Seo";
import { api, formatApiError } from "@/lib/api";
import { FAQ_STUDENTS, PROGRAMS, PLACEMENT_STEPS } from "@/data/content";
import { BookOpen, Briefcase, Target, Mic, FileText, Users } from "lucide-react";

const SERVICES = [
  { icon: <BookOpen />, title: "Career Training", desc: "Practical, industry-focused learning across tech and non-tech tracks." },
  { icon: <Briefcase />, title: "Internship Support", desc: "Apply your skills inside real teams from our 50+ partner network." },
  { icon: <Target />, title: "Placement Assistance", desc: "Interview opportunities, drives and active referrals till you're placed." },
  { icon: <Mic />, title: "Mock Interviews", desc: "Technical + HR rounds with senior hiring managers." },
  { icon: <FileText />, title: "Resume Building", desc: "Recruiter-tested resume formats that survive the 7-second scan." },
  { icon: <Users />, title: "Referral Opportunities", desc: "Direct hiring referrals into product and services companies." },
];

export default function Students() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", program: PROGRAMS[0].title, message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/leads/enroll", form);
      toast.success("Enquiry received — our team will reach out shortly.");
      setForm({ name: "", email: "", phone: "", program: PROGRAMS[0].title, message: "" });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="For Students — Training, Internships & Placements" description="Job-ready training, internship support, mock interviews, resume building, and active placement referrals — from one platform." />
      <section className="bg-[#F4F4F4] border-b border-[#06252C]/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionLabel>For Students</SectionLabel>
            <h1 className="mt-5 font-display text-5xl lg:text-6xl font-black text-[#06252C] leading-[1.02]">
              Learn skills.<br />Build confidence.<br /><span className="text-[#F26C21]">Get hired.</span>
            </h1>
            <p className="mt-5 text-lg text-[#163A44]/75 max-w-lg">
              You don't lack the degree. You lack the playbook. We hand it to you — and walk you through every page.
            </p>
          </div>
          <img src="https://images.pexels.com/photos/9159042/pexels-photo-9159042.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Students" className="rounded-sm aspect-[4/3] object-cover" />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading eyebrow="Services" title="Everything you need between graduation and your first offer." />
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div key={s.title} className="border border-[#06252C]/10 p-7 hover:border-[#F26C21] hover:-translate-y-1 transition rounded-sm" data-testid={`student-service-${s.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="grid h-11 w-11 place-items-center bg-[#06252C] text-white rounded-sm">{s.icon}</div>
                <p className="mt-5 font-display text-lg font-bold text-[#06252C]">{s.title}</p>
                <p className="mt-2 text-sm text-[#163A44]/75">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#06252C] text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading eyebrow="Student Journey" title={<span className="text-white">From enrolment to your first offer.</span>} />
          <div className="mt-12 grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {PLACEMENT_STEPS.map((s) => (
              <div key={s.n} className="border-l-2 border-[#F26C21] pl-4">
                <p className="text-xs text-[#F26C21] font-bold">STEP {s.n}</p>
                <p className="mt-2 font-display font-bold text-base">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 grid lg:grid-cols-2 gap-12">
          <div>
            <SectionHeading eyebrow="Apply Now" title="Tell us about yourself." sub="We'll get back within 24 hours with the next cohort dates." />
            <form onSubmit={submit} className="mt-8 space-y-4" data-testid="student-enroll-form">
              <Input label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required tid="enroll-name" />
              <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required tid="enroll-email" />
              <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required tid="enroll-phone" />
              <div>
                <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#06252C]">Program</label>
                <select
                  data-testid="enroll-program"
                  className="mt-1 w-full border border-[#06252C]/20 px-3 py-3 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]"
                  value={form.program}
                  onChange={(e) => setForm({ ...form, program: e.target.value })}
                >
                  {PROGRAMS.map((p) => <option key={p.id}>{p.title}</option>)}
                </select>
              </div>
              <Input label="Message (optional)" value={form.message} onChange={(v) => setForm({ ...form, message: v })} tid="enroll-message" textarea />
              <PrimaryBtn disabled={busy} type="submit" data-testid="enroll-submit">
                {busy ? "Sending..." : "Submit Enquiry"}
              </PrimaryBtn>
            </form>
          </div>

          <div>
            <SectionHeading eyebrow="FAQ" title="Quick answers." />
            <div className="mt-8">
              <Accordion type="single" collapsible>
                {FAQ_STUDENTS.map((f, i) => (
                  <AccordionItem value={`f-${i}`} key={i} className="border-b border-[#06252C]/10">
                    <AccordionTrigger data-testid={`faq-${i}`} className="font-display text-left text-base font-bold text-[#06252C] hover:text-[#F26C21]">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-[#163A44]/80">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function Input({ label, value, onChange, type = "text", required, textarea, tid }) {
  const Cmp = textarea ? "textarea" : "input";
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#06252C]">{label}</label>
      <Cmp
        data-testid={tid}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 4 : undefined}
        className="mt-1 w-full border border-[#06252C]/20 px-3 py-3 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]"
      />
    </div>
  );
}
