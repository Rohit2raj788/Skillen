import React, { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { SectionHeading, SectionLabel, PrimaryBtn } from "@/components/Primitives";
import { Input } from "@/pages/Students";
import { api, formatApiError } from "@/lib/api";
import { MOCK_TRACKS } from "@/data/content";

const TIERS = [
  {
    id: "1-mock",
    name: "1 Mock Interview",
    price: "₹499",
    perks: ["1 full-length interview", "Detailed feedback report", "1 follow-up call", "Resume review (basic)"],
  },
  {
    id: "3-mock",
    name: "3 Mock Interviews",
    price: "₹999",
    perks: ["3 full-length interviews", "Iterative feedback after each", "1:1 mentor mapping", "Resume + LinkedIn review", "Referral consideration"],
    highlight: true,
  },
];

export default function MockInterviews() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", track: MOCK_TRACKS[0].name, package: "3-mock", preferred_date: "", notes: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/leads/mock-booking", form);
      toast.success("Booking request received! We'll confirm your slot within 24 hours.");
      setForm({ name: "", email: "", phone: "", track: MOCK_TRACKS[0].name, package: "3-mock", preferred_date: "", notes: "" });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="border-b border-[#06252C]/10 bg-[#F4F4F4]">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20">
          <SectionLabel>Mock Interviews</SectionLabel>
          <h1 className="mt-4 font-display text-5xl lg:text-6xl font-black text-[#06252C] max-w-3xl leading-[1.02]">
            Fail safely. Then walk into the real one ready.
          </h1>
          <p className="mt-5 text-lg text-[#163A44]/75 max-w-2xl">
            Live, recorded mock interviews with senior hiring managers from product companies. You get the same questions. We tell you exactly what to fix.
          </p>
        </div>
      </section>

      {/* Tracks */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading eyebrow="Tracks" title="Pick your interview type." />
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {MOCK_TRACKS.map((t) => (
              <div key={t.id} className="border border-[#06252C]/10 p-5 text-center hover:bg-[#06252C] hover:text-white transition rounded-sm" data-testid={`mock-track-${t.id}`}>
                <p className="font-display font-bold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-[#F4F4F4]">
        <div className="mx-auto max-w-5xl px-5 lg:px-10">
          <SectionHeading eyebrow="Pricing" title="Simple. Transparent. Pay only when you book." />
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative p-8 rounded-sm ${tier.highlight ? "p-[2px] se-trace" : "border border-[#06252C]/10 bg-white"}`}
                data-testid={`mock-tier-${tier.id}`}
              >
                <div className={`${tier.highlight ? "bg-[#06252C] text-white p-7 rounded-sm" : ""}`}>
                  {tier.highlight && <span className="absolute -top-3 right-5 bg-[#F26C21] text-white text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded-sm">Best Value</span>}
                  <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#F26C21]">{tier.name}</p>
                  <p className="mt-3 font-display text-5xl font-black">{tier.price}</p>
                  <ul className="mt-6 space-y-2">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-[#F26C21] mt-0.5 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => { setForm({ ...form, package: tier.id }); document.getElementById("book")?.scrollIntoView({ behavior: "smooth" }); }}
                    className={`mt-8 w-full py-3 text-sm font-semibold rounded-sm transition ${tier.highlight ? "bg-[#F26C21] text-white hover:bg-[#FF6600]" : "bg-[#06252C] text-white hover:bg-[#F26C21]"}`}
                    data-testid={`mock-book-${tier.id}`}
                  >
                    Book Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="book" className="py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-10">
          <SectionHeading eyebrow="Book Your Slot" title="A mentor will confirm your time within 24 hours." />
          <form onSubmit={submit} className="mt-10 space-y-4 border border-[#06252C]/10 p-8 rounded-sm" data-testid="mock-form">
            <Input label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required tid="m-name" />
            <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required tid="m-email" />
            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required tid="m-phone" />
            <div>
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#06252C]">Track</label>
              <select
                className="mt-1 w-full border border-[#06252C]/20 px-3 py-3 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]"
                value={form.track}
                onChange={(e) => setForm({ ...form, track: e.target.value })}
                data-testid="m-track"
              >
                {MOCK_TRACKS.map((t) => <option key={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#06252C]">Package</label>
              <select
                className="mt-1 w-full border border-[#06252C]/20 px-3 py-3 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]"
                value={form.package}
                onChange={(e) => setForm({ ...form, package: e.target.value })}
                data-testid="m-package"
              >
                <option value="1-mock">1 Mock — ₹499</option>
                <option value="3-mock">3 Mocks — ₹999</option>
              </select>
            </div>
            <Input label="Preferred date (optional)" type="date" value={form.preferred_date} onChange={(v) => setForm({ ...form, preferred_date: v })} tid="m-date" />
            <Input label="Notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} textarea tid="m-notes" />
            <PrimaryBtn type="submit" disabled={busy} data-testid="mock-submit">{busy ? "Submitting..." : "Confirm Booking"}</PrimaryBtn>
            <p className="text-xs text-[#163A44]/60">Payment is collected manually after our team confirms the slot.</p>
          </form>
        </div>
      </section>
    </>
  );
}
