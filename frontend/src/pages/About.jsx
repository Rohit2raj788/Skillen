import React from "react";
import { SectionHeading, SectionLabel } from "@/components/Primitives";
import { VALUES } from "@/data/content";

export default function About() {
  return (
    <>
      <section className="border-b border-[#06252C]/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <SectionLabel>About SkillEn</SectionLabel>
            <h1 className="mt-4 font-display text-5xl lg:text-6xl font-black text-[#06252C] leading-[1.02]">
              We bridge the gap between <span className="text-[#F26C21]">education</span> and <span className="text-[#F26C21]">employability</span>.
            </h1>
            <p className="mt-6 text-lg text-[#163A44]/80">
              SkillEn was born from a simple observation: India produces millions of graduates every year — yet companies still struggle to find candidates who are job-ready on day one. We exist to close that gap.
            </p>
          </div>
          <div className="lg:col-span-5">
            <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=70" alt="About SkillEn" className="rounded-sm aspect-[4/5] object-cover" />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 grid md:grid-cols-2 gap-12">
          <div className="border-l-4 border-[#F26C21] pl-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#F26C21] font-bold">Mission</p>
            <p className="mt-3 font-display text-3xl font-extrabold text-[#06252C] leading-tight">
              To bridge the gap between education and employability.
            </p>
          </div>
          <div className="border-l-4 border-[#06252C] pl-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#06252C] font-bold">Vision</p>
            <p className="mt-3 font-display text-3xl font-extrabold text-[#06252C] leading-tight">
              To become India's most trusted career readiness and talent solutions platform.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F4F4F4]">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading eyebrow="Our Values" title="Four words. Every decision filtered through them." />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white p-7 rounded-sm border border-[#06252C]/10 hover:border-[#F26C21] transition" data-testid={`value-${v.title.toLowerCase()}`}>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#F26C21] font-bold">Value</p>
                <p className="mt-2 font-display text-2xl font-extrabold text-[#06252C]">{v.title}</p>
                <p className="mt-3 text-sm text-[#163A44]/75">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
