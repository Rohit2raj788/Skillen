import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading, SectionLabel } from "@/components/Primitives";
import Seo from "@/components/Seo";
import { PROGRAMS } from "@/data/content";

export default function Courses() {
  return (
    <>
      <Seo title="Career-Defining Programs" description="Tech Job Readiness, Soft Skills & Interview Prep, Sales & BD, AI & Digital Skills — every track ends with mock interviews and active placement referrals." />
      <section className="border-b border-[#06252C]/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20">
          <SectionLabel>Programs</SectionLabel>
          <h1 className="mt-4 font-display text-5xl lg:text-6xl font-black text-[#06252C] max-w-3xl leading-[1.02]">
            Career-defining programs. Built with hiring managers.
          </h1>
          <p className="mt-5 text-lg text-[#163A44]/75 max-w-2xl">
            Each track ends with mock interviews, a real portfolio, and active placement referrals.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 grid md:grid-cols-2 gap-6">
          {PROGRAMS.map((p, i) => (
            <article key={p.id} className="border border-[#06252C]/10 p-8 rounded-sm hover:border-[#F26C21] transition" data-testid={`course-${p.id}`}>
              <p className="text-xs uppercase tracking-[0.25em] text-[#F26C21] font-bold">Track {String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 font-display text-2xl md:text-3xl font-extrabold text-[#06252C]">{p.title}</h2>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <Meta label="Duration" value={p.duration} />
                <Meta label="Mode" value={p.mode} />
                <Meta label="Outcomes" value={p.outcomes} span />
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#06252C]/60 font-bold">Curriculum</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.curriculum.map((c) => (
                    <li key={c} className="text-xs px-2.5 py-1 bg-[#F4F4F4] text-[#06252C] rounded-sm">{c}</li>
                  ))}
                </ul>
              </div>

              <Link to="/students" data-testid={`course-enroll-${p.id}`} className="mt-8 inline-flex items-center gap-2 bg-[#F26C21] text-white px-5 py-3 text-sm font-semibold rounded-sm hover:bg-[#FF6600] transition">
                Enroll Now <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Meta({ label, value, span }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#06252C]/60 font-bold">{label}</p>
      <p className="mt-1 text-sm text-[#06252C] font-medium">{value}</p>
    </div>
  );
}
