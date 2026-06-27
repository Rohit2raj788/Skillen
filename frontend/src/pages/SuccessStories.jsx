import React from "react";
import { SectionHeading, SectionLabel } from "@/components/Primitives";
import { TESTIMONIALS, STATS } from "@/data/content";
import { Quote } from "lucide-react";

const STORIES = [
  { name: "Aishwarya R.", role: "QA Engineer", company: "Hexaware", before: "Final year, B.Tech CSE — no real projects", after: "₹5.2 LPA · 41 days post-program", img: "https://images.pexels.com/photos/31869537/pexels-photo-31869537.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Karthik S.", role: "BDA", company: "EdTech Startup", before: "BBA grad, 6 months of rejections", after: "₹4.8 LPA · placed in 40 days", img: "https://images.pexels.com/photos/26872232/pexels-photo-26872232.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Neha P.", role: "SDET Intern → FT", company: "Product Startup", before: "Self-taught, no internship", after: "Intern → Full-time conversion", img: "https://images.pexels.com/photos/9159042/pexels-photo-9159042.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

export default function SuccessStories() {
  return (
    <>
      <section className="border-b border-[#06252C]/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20">
          <SectionLabel>Success Stories</SectionLabel>
          <h1 className="mt-4 font-display text-5xl lg:text-6xl font-black text-[#06252C] max-w-3xl leading-[1.02]">
            500+ careers launched. <span className="text-[#F26C21]">Here are a few of them.</span>
          </h1>
        </div>
      </section>

      <section className="py-16 bg-[#06252C] text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-5xl font-black text-[#F26C21]">{s.value}{s.suffix}</p>
              <p className="text-sm text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 grid md:grid-cols-3 gap-6">
          {STORIES.map((s) => (
            <article key={s.name} className="border border-[#06252C]/10 rounded-sm overflow-hidden hover:-translate-y-1 transition" data-testid={`success-${s.name}`}>
              <img src={s.img} alt={s.name} className="aspect-[4/3] w-full object-cover" />
              <div className="p-6">
                <p className="font-display text-lg font-bold text-[#06252C]">{s.name}</p>
                <p className="text-sm text-[#F26C21] font-semibold">{s.role} · {s.company}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#06252C]/60 font-bold">Before</p>
                  <p className="text-sm text-[#163A44]/75">{s.before}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#F26C21] font-bold mt-3">After</p>
                  <p className="text-sm text-[#06252C] font-semibold">{s.after}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 bg-[#F4F4F4]">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading eyebrow="In their words" title="What graduates actually say after they're placed." />
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="bg-white border border-[#06252C]/10 p-7 rounded-sm">
                <Quote className="text-[#F26C21]" size={22} />
                <blockquote className="mt-4 text-[15px] leading-relaxed text-[#06252C]">{t.quote}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-[#06252C]">{t.name}</p>
                    <p className="text-xs text-[#163A44]/70">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
