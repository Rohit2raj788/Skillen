import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Rule-based free chatbot. No API costs.
 * Each intent has trigger keywords + a response (possibly with quick-replies / route).
 */
const INTENTS = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "hii", "hola"],
    reply: "Hi! 👋 I'm SkillBot. I can help you with programs, mock interviews, jobs, pricing or talking to a counsellor. What are you looking for?",
    chips: ["Programs", "Mock Interviews", "Jobs", "Pricing", "Talk to a human"],
  },
  {
    id: "programs",
    keywords: ["program", "course", "training", "syllabus", "curriculum", "learn"],
    reply: "We run four flagship tracks: Tech Job Readiness (Java + QA), Soft Skills & Interview Prep, Sales & BD, and AI & Digital Skills. Want to see the full curriculum?",
    chips: ["View Programs", "Enroll", "Pricing"],
    route: { label: "View Programs", to: "/courses" },
  },
  {
    id: "mock",
    keywords: ["mock", "interview", "practice", "mocks"],
    reply: "Our mock interviews are conducted by senior hiring managers. ₹499 for 1 mock, ₹999 for 3 mocks (best value). Tracks: Java, SQL, Automation, API, Sales & BD, HR.",
    chips: ["Book Now", "See Tracks"],
    route: { label: "Book Mock Interview", to: "/mock-interviews" },
  },
  {
    id: "jobs",
    keywords: ["job", "internship", "intern", "vacancy", "opening", "hiring", "placement"],
    reply: "We list live jobs and internships from our 50+ partner companies. Browse openings and apply directly.",
    chips: ["See Jobs", "See Internships"],
    route: { label: "Browse Jobs", to: "/jobs" },
  },
  {
    id: "pricing",
    keywords: ["price", "pricing", "fee", "cost", "charge", "how much"],
    reply: "Course fees vary by track and start at ₹4,999. Mock interviews are ₹499 / ₹999. Hop on a free counselling call to get the exact number for your program.",
    chips: ["Talk to a human", "Book Mock"],
    route: { label: "Talk to counsellor", to: "/contact" },
  },
  {
    id: "company",
    keywords: ["hire", "hiring", "recruit", "talent", "company", "hr"],
    reply: "If you're a company looking to hire pre-screened talent, our team can typically close 5–50 hires in 2–3 weeks.",
    chips: ["Hiring Request", "Talk to us"],
    route: { label: "Submit Hiring Request", to: "/companies" },
  },
  {
    id: "college",
    keywords: ["college", "university", "campus", "placement officer", "tpo"],
    reply: "We partner with 20+ colleges for placement training, bootcamps and live drives.",
    chips: ["Partnership Inquiry"],
    route: { label: "Inquire about partnership", to: "/colleges" },
  },
  {
    id: "contact",
    keywords: ["contact", "talk", "human", "counsellor", "advisor", "support", "whatsapp", "email", "phone", "call"],
    reply: "You can reach us at info@skillen.in or +91 7070330407. Or drop a message and our team will respond in under 24 hours.",
    chips: ["Send Message", "WhatsApp Us"],
    route: { label: "Contact form", to: "/contact" },
  },
  {
    id: "thanks",
    keywords: ["thanks", "thank you", "ty", "thx"],
    reply: "You're welcome! Anything else? 🙂",
    chips: ["Programs", "Jobs", "Mock Interviews"],
  },
  {
    id: "bye",
    keywords: ["bye", "ok", "okay", "see you", "later"],
    reply: "Bye! Wishing you great offers ahead. ✨",
    chips: [],
  },
];

const FALLBACK = {
  reply: "I'm a simple bot — I might have missed that. Try one of these or contact a human counsellor:",
  chips: ["Programs", "Mock Interviews", "Jobs", "Pricing", "Talk to a human"],
};

function match(text) {
  const t = text.toLowerCase();
  for (const i of INTENTS) {
    if (i.keywords.some((k) => t.includes(k))) return i;
  }
  return null;
}

const CHIP_TO_TEXT = {
  "Programs": "programs",
  "Mock Interviews": "mock interviews",
  "Jobs": "jobs",
  "Pricing": "pricing",
  "Talk to a human": "talk to human",
  "View Programs": "programs",
  "Enroll": "programs",
  "Book Now": "book mock",
  "See Tracks": "tracks",
  "See Jobs": "jobs",
  "See Internships": "internships",
  "Hiring Request": "hiring",
  "Talk to us": "contact",
  "Partnership Inquiry": "college",
  "Send Message": "contact",
  "WhatsApp Us": "whatsapp",
  "Book Mock": "mock",
  "Book Mock Interview": "mock",
  "Browse Jobs": "jobs",
  "Talk to counsellor": "contact",
  "Submit Hiring Request": "hiring",
  "Inquire about partnership": "college",
  "Contact form": "contact",
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm SkillBot 🤖. Ask me about programs, jobs, mock interviews or pricing.", chips: ["Programs", "Mock Interviews", "Jobs", "Talk to a human"] },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      const intent = match(text);
      const reply = intent ? { text: intent.reply, chips: intent.chips || [], route: intent.route } : { text: FALLBACK.reply, chips: FALLBACK.chips };
      setMessages((m) => [...m, { from: "bot", ...reply }]);
    }, 350);
  };

  const onChip = (chip) => {
    if (chip === "WhatsApp Us") {
      window.open("https://wa.me/917070330407", "_blank");
      return;
    }
    send(CHIP_TO_TEXT[chip] || chip);
  };

  const widget = useMemo(() => (
    <div className="fixed bottom-24 right-6 z-40 w-[340px] max-w-[calc(100vw-2rem)] bg-white border border-[#06252C]/15 rounded-sm shadow-2xl overflow-hidden flex flex-col" style={{ height: 480 }} data-testid="chatbot-panel">
      <div className="bg-[#06252C] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center bg-[#F26C21] rounded-sm font-display font-black text-sm">S</span>
          <div>
            <p className="font-display font-bold leading-tight">SkillBot</p>
            <p className="text-[10px] text-white/60">We usually reply within 1 minute</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} data-testid="chatbot-close"><X size={18} /></button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F4F4]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`${m.from === "user" ? "bg-[#F26C21] text-white" : "bg-white text-[#06252C] border border-[#06252C]/10"} max-w-[80%] px-3 py-2 text-sm rounded-sm`}>
              {m.text}
              {m.route && (
                <Link to={m.route.to} onClick={() => setOpen(false)} className="mt-2 block text-xs font-bold underline">
                  → {m.route.label}
                </Link>
              )}
              {m.chips && m.chips.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.chips.map((c) => (
                    <button key={c} onClick={() => onChip(c)} data-testid={`chip-${c.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-[11px] px-2 py-1 bg-[#06252C]/5 hover:bg-[#F26C21] hover:text-white rounded-sm transition">
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-[#06252C]/10 p-2 flex gap-2 bg-white">
        <input
          data-testid="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 text-sm px-3 py-2 border border-[#06252C]/15 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]"
        />
        <button data-testid="chatbot-send" type="submit" className="grid place-items-center h-9 w-9 bg-[#F26C21] text-white rounded-sm hover:bg-[#FF6600]"><Send size={16} /></button>
      </form>
    </div>
  ), [messages, input]);

  return (
    <>
      {open && widget}
      <button
        onClick={() => setOpen(!open)}
        data-testid="chatbot-toggle"
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center bg-[#06252C] text-white rounded-full shadow-xl hover:bg-[#F26C21] transition"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}
