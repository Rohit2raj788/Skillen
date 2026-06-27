import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { SectionLabel } from "@/components/Primitives";
import { api } from "@/lib/api";

export default function TrendingJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs", { params: { limit: 3 } })
      .then(({ data }) => setJobs(data.slice(0, 3)))
      .catch(() => setJobs([]));
  }, []);

  if (jobs.length === 0) return null;

  return (
    <section className="py-20 bg-white border-y border-[#06252C]/10" data-testid="trending-jobs">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="relative grid h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-[#F26C21] animate-ping opacity-75" />
                <span className="absolute inset-0 rounded-full bg-[#F26C21]" />
              </span>
              <SectionLabel>Trending now</SectionLabel>
            </div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight text-[#06252C] leading-[1.05]">
              Fresh openings — apply today.
            </h2>
          </div>
          <Link to="/jobs" data-testid="trending-view-all" className="text-sm font-semibold text-[#06252C] underline underline-offset-4 hover:text-[#F26C21]">
            See all jobs →
          </Link>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {jobs.map((j) => (
            <Link key={j.id} to="/jobs" data-testid={`trending-job-${j.id}`}
              className="group border border-[#06252C]/10 p-6 rounded-sm hover:border-[#F26C21] hover:-translate-y-1 transition-all bg-white">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#F26C21]">{j.type}</p>
                {j.salary && <span className="text-[11px] font-bold text-[#06252C] bg-[#F4F4F4] px-2 py-0.5 rounded-sm">{j.salary}</span>}
              </div>
              <h3 className="mt-3 font-display text-xl font-extrabold text-[#06252C] leading-tight">{j.title}</h3>
              <p className="mt-1 text-sm font-semibold text-[#163A44]">{j.company}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#163A44]/70">
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> {j.location}</span>
                {j.apply_deadline && <span className="inline-flex items-center gap-1"><Clock size={12} /> By {j.apply_deadline}</span>}
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#06252C] group-hover:text-[#F26C21]">
                Apply now <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
