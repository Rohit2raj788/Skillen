import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { CONTACT } from "@/data/content";
import Chatbot from "@/components/Chatbot";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/students", label: "Students" },
  { to: "/companies", label: "Companies" },
  { to: "/colleges", label: "Colleges" },
  { to: "/courses", label: "Courses" },
  { to: "/jobs", label: "Jobs" },
  { to: "/mock-interviews", label: "Mock Interviews" },
  { to: "/success-stories", label: "Success" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Logo({ light = false }) {
  const ink = light ? "text-white" : "text-[#06252C]";
  return (
    <Link to="/" data-testid="nav-logo" className={`flex items-center gap-2 ${ink}`}>
      <span className="grid h-9 w-9 place-items-center bg-[#F26C21] text-white font-display font-black text-lg rounded-sm">
        S
      </span>
      <span className="font-display font-extrabold tracking-tight text-xl">
        skill<span className="relative">en
          <span className="absolute -top-0.5 right-[-6px] h-1.5 w-1.5 rounded-full bg-[#F26C21] se-logo-dot" />
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${scrolled ? "bg-white/85 backdrop-blur-xl border-b border-[#06252C]/10" : "bg-white"}`}
      data-testid="site-header"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-link-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-[#F26C21]" : "text-[#06252C]/80 hover:text-[#06252C]"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Link
            to="/courses"
            data-testid="nav-cta-explore"
            className="inline-flex items-center gap-2 bg-[#F26C21] text-white px-5 py-2.5 text-sm font-semibold rounded-sm hover:bg-[#FF6600] transition-colors"
          >
            Explore Programs →
          </Link>
        </div>
        <button
          className="lg:hidden p-2 text-[#06252C]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          data-testid="nav-mobile-toggle"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#06252C]/10 bg-white" data-testid="nav-mobile-panel">
          <div className="px-5 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) => `text-base py-1 ${isActive ? "text-[#F26C21] font-semibold" : "text-[#06252C]/80"}`}
              >
                {n.label}
              </NavLink>
            ))}
            <Link to="/courses" className="mt-2 inline-flex justify-center bg-[#F26C21] text-white px-5 py-2.5 text-sm font-semibold rounded-sm">
              Explore Programs
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#06252C] text-white" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-white/70 max-w-xs">
            Learn. Grow. Lead. — bridging students, colleges, and companies through career-ready training.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">For You</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/students" className="hover:text-[#F26C21]">Students</Link></li>
            <li><Link to="/companies" className="hover:text-[#F26C21]">Companies</Link></li>
            <li><Link to="/colleges" className="hover:text-[#F26C21]">Colleges</Link></li>
            <li><Link to="/mock-interviews" className="hover:text-[#F26C21]">Mock Interviews</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">Company</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[#F26C21]">About</Link></li>
            <li><Link to="/courses" className="hover:text-[#F26C21]">Courses</Link></li>
            <li><Link to="/success-stories" className="hover:text-[#F26C21]">Success Stories</Link></li>
            <li><Link to="/blog" className="hover:text-[#F26C21]">Career Tips</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">Reach Us</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail size={14} /> <a href={`mailto:${CONTACT.email}`} className="hover:text-[#F26C21]">{CONTACT.email}</a></li>
            <li className="flex items-center gap-2"><Phone size={14} /> <a href={`tel:${CONTACT.phone}`} className="hover:text-[#F26C21]">{CONTACT.phone}</a></li>
            <li className="flex items-center gap-3 pt-2">
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="hover:text-[#F26C21]"><Instagram size={18} /></a>
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#F26C21]"><Linkedin size={18} /></a>
              <a href={`https://wa.me/${CONTACT.whatsapp.replace("+", "")}`} target="_blank" rel="noreferrer" className="hover:text-[#F26C21] text-xs font-bold">WA</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-5 flex flex-col md:flex-row justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} SkillEn. All rights reserved.</p>
          <p>Built with focus on careers, not clichés.</p>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${CONTACT.whatsapp.replace("+", "")}`}
      target="_blank"
      rel="noreferrer"
      data-testid="floating-whatsapp"
      className="fixed bottom-6 left-6 z-40 grid h-12 w-12 place-items-center bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition"
      aria-label="WhatsApp us"
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current"><path d="M16.001 3C9.373 3 4 8.373 4 15a11.94 11.94 0 0 0 1.69 6.14L4 29l8.07-1.66A11.93 11.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.628 3 16.001 3zm0 21.7a9.66 9.66 0 0 1-4.93-1.34l-.36-.21-4.79.99 1.01-4.66-.23-.38A9.7 9.7 0 1 1 16 24.7zm5.43-7.27c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.66-1.59-.9-2.18-.24-.57-.49-.49-.66-.5l-.57-.01c-.2 0-.5.07-.77.37-.27.3-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.06 3.14 5 4.41.7.3 1.25.48 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/></svg>
    </a>
  );
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <FloatingWhatsApp />
      <Chatbot />
      <Footer />
    </div>
  );
}
