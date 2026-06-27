import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Building2, School, Sparkles, Quote } from "lucide-react";
import { Counter, SectionHeading, SectionLabel, PrimaryBtn, SecondaryBtn } from "@/components/Primitives";
import {
  STATS, WHY_CHOOSE, PROGRAMS, PLACEMENT_STEPS, TESTIMONIALS, PARTNER_NAMES,
} from "@/data/content";

const HERO_IMG = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=70";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#06252C]/10" data-testid="hero-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 grid lg:grid-cols-12 gap-10 py-16 lg:py-24">
          <div className="lg:col-span-7">
            <SectionLabel>Learn · Grow · Lead</SectionLabel>
            <h1 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.98] text-[#06252C]">
              Launch Your Career with{" "}
              <span className="relative inline-block">
                Industry-Ready
                <span className="absolute left-0 -bottom-2 h-2 w-full bg-[#F26C21]/80" />
              </span>{" "}
              Skills.
            </h1>
            <p className="mt-6 text-lg text-[#163A44]/80 max-w-xl leading-relaxed">
              SkillEn trains students into job-ready talent, helps companies hire pre-screened candidates,
              and partners with colleges to build future-ready graduates.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/courses" data-testid="hero-cta-explore">
                <PrimaryBtn>Explore Programs <ArrowRight size={16} /></PrimaryBtn>
              </Link>
              <Link to="/companies" data-testid="hero-cta-hire">
                <SecondaryBtn>Hire Talent</SecondaryBtn>
              </Link>
              <Link to="/colleges" data-testid="hero-cta-partner">
                <SecondaryBtn>Partner With Us</SecondaryBtn>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-4 text-sm text-[#163A44]/70">
              <div className="flex -space-x-2">
                {TESTIMONIALS.slice(0, 3).map((t) => (
                  <img key={t.name} src={t.image} alt={t.name} className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <span>Trusted by 500+ students & 50+ hiring partners</span>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <img src={HERO_IMG} alt="Students collaborating" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06252C]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-display text-2xl font-bold leading-tight">From classroom to offer letter — in one cohort.</p>
              </div>
            </div>
            <div className="absolute -left-4 -bottom-4 hidden lg:block bg-white border border-[#06252C]/10 px-5 py-4 shadow-xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#F26C21] font-bold">Placement Rate</p>
              <p className="font-display text-3xl font-extrabold mt-1">87%</p>
              <p className="text-xs text-[#163A44]/70">within 90 days of completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#06252C] text-white se-grain relative" data-testid="stats-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {STATS.map((s) => (
            <div key={s.label} data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <p className="text-6xl md:text-7xl font-display font-black text-[#F26C21]">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="py-20 lg:py-28" data-testid="ecosystem-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading eyebrow="Our Ecosystem" title="One platform. Three audiences. Real outcomes." />
          <div className="mt-12 grid md:grid-cols-12 gap-6">
            <EcosystemCard
              span="md:col-span-5"
              icon={<GraduationCap size={28} />}
              tag="Students"
              title="Training, internships, placements, referrals."
              desc="From mock interviews to portfolio reviews — we get you job-ready."
              to="/students"
              img="https://images.pexels.com/photos/9159042/pexels-photo-9159042.jpeg?auto=compress&cs=tinysrgb&w=900"
              dark
            />
            <EcosystemCard
              span="md:col-span-4"
              icon={<Building2 size={28} />}
              tag="Companies"
              title="Hire skilled candidates faster."
              desc="Pre-screened, trained talent across 8 domains. You only do the final round."
              to="/companies"
              img="https://images.pexels.com/photos/8463151/pexels-photo-8463151.jpeg?auto=compress&cs=tinysrgb&w=900"
            />
            <EcosystemCard
              span="md:col-span-3"
              icon={<School size={28} />}
              tag="Colleges"
              title="Placement training & partnerships."
              desc="Bootcamps, mock drives, and industry expert sessions on campus."
              to="/colleges"
              img="https://images.pexels.com/photos/7972324/pexels-photo-7972324.jpeg?auto=compress&cs=tinysrgb&w=900"
            />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-20 bg-[#F4F4F4]" data-testid="why-choose-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading eyebrow="Why SkillEn" title="We don't sell promises. We ship careers." />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#06252C]/10">
            {WHY_CHOOSE.map((w, i) => (
              <div key={w.title} className="bg-[#F4F4F4] p-6 hover:bg-white transition" data-testid={`why-item-${i}`}>
                <div className="flex items-center gap-2 text-[#F26C21]">
                  <Sparkles size={16} />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-4 font-display text-lg font-bold text-[#06252C]">{w.title}</p>
                <p className="mt-2 text-sm text-[#163A44]/75 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROGRAMS */}
      <section className="py-20 lg:py-28" data-testid="programs-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHeading eyebrow="Featured Programs" title="Pick a track. Walk out with a job." />
            <Link to="/courses" className="text-sm font-semibold text-[#06252C] underline underline-offset-4 hover:text-[#F26C21]">
              View all programs →
            </Link>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {PROGRAMS.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                to="/courses"
                className="group border border-[#06252C]/10 p-7 bg-white hover:border-[#F26C21] hover:-translate-y-1 transition-all rounded-sm"
                data-testid={`program-card-${p.id}`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[#F26C21] font-bold">{p.duration} · {p.mode}</p>
                <h3 className="mt-3 font-display text-xl font-extrabold text-[#06252C]">{p.title}</h3>
                <p className="mt-2 text-sm text-[#163A44]/75">{p.outcomes}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {p.curriculum.map((c) => (
                    <li key={c} className="text-[11px] px-2 py-1 bg-[#F4F4F4] text-[#06252C] rounded-sm">{c}</li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#06252C] group-hover:text-[#F26C21]">
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PLACEMENT PROCESS */}
      <section className="py-20 lg:py-28 bg-[#06252C] text-white relative overflow-hidden" data-testid="placement-process">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading
            eyebrow="Placement Process"
            title={<span className="text-white">Six steps. One outcome.</span>}
            sub={<span className="text-white/70">From enrolment to placement — a path designed by hiring managers, not trainers.</span>}
          />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {PLACEMENT_STEPS.map((s) => (
              <div key={s.n} className="relative pl-6 border-l-2 border-[#F26C21]/40" data-testid={`step-${s.n}`}>
                <span className="absolute -left-3 top-0 grid h-6 w-6 place-items-center bg-[#F26C21] text-white text-xs font-bold rounded-full">{s.n}</span>
                <p className="font-display text-xl font-bold">{s.title}</p>
                <p className="mt-2 text-sm text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-28" data-testid="testimonials-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading eyebrow="Success Stories" title="Real graduates. Real offers." />
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="border border-[#06252C]/10 p-7 bg-white hover:border-[#F26C21] transition rounded-sm" data-testid={`testimonial-${t.name}`}>
                <Quote className="text-[#F26C21]" size={22} />
                <blockquote className="mt-4 text-[15px] leading-relaxed text-[#06252C]">{t.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
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

      {/* PARTNER LOGOS (text-based marquee) */}
      <section className="py-12 border-y border-[#06252C]/10 bg-[#F4F4F4] overflow-hidden" data-testid="partners-section">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-[#163A44]/60 font-semibold">
          Trusted by hiring partners across India
        </p>
        <div className="mt-6 se-marquee">
          {[...PARTNER_NAMES, ...PARTNER_NAMES].map((p, i) => (
            <div key={i} className="mx-8 font-display text-2xl font-extrabold text-[#06252C]/40 whitespace-nowrap">
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24" data-testid="final-cta">
        <div className="mx-auto max-w-5xl px-5 lg:px-10 text-center">
          <h2 className="font-display text-4xl md:text-6xl font-black text-[#06252C]">Ready to build your career?</h2>
          <p className="mt-5 text-lg text-[#163A44]/75">Join the next cohort or partner with us to hire the country's best entry-level talent.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/students"><PrimaryBtn>Join SkillEn</PrimaryBtn></Link>
            <Link to="/contact"><SecondaryBtn>Contact Us</SecondaryBtn></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function EcosystemCard({ span, icon, tag, title, desc, to, img, dark }) {
  return (
    <Link
      to={to}
      className={`${span} group relative overflow-hidden rounded-sm border border-[#06252C]/10 hover:-translate-y-1 transition-all`}
      data-testid={`ecosystem-${tag.toLowerCase()}`}
    >
      <div className={`relative h-full ${dark ? "bg-[#06252C] text-white" : "bg-white text-[#06252C]"} p-7 flex flex-col`}>
        <div className={`inline-flex h-12 w-12 items-center justify-center ${dark ? "bg-[#F26C21]" : "bg-[#06252C] text-white"} rounded-sm`}>{icon}</div>
        <p className={`mt-6 text-xs uppercase tracking-[0.25em] font-bold ${dark ? "text-[#F26C21]" : "text-[#F26C21]"}`}>{tag}</p>
        <p className="mt-2 font-display text-xl md:text-2xl font-bold leading-tight">{title}</p>
        <p className={`mt-3 text-sm ${dark ? "text-white/70" : "text-[#163A44]/75"}`}>{desc}</p>
        <div className="mt-6 aspect-video overflow-hidden rounded-sm">
          <img src={img} alt={tag} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold group-hover:text-[#F26C21]">
          Explore <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
