// Static content used across pages (testimonials, courses, etc.)

export const STATS = [
  { value: 500, suffix: "+", label: "Students Trained" },
  { value: 100, suffix: "+", label: "Internship Opportunities" },
  { value: 50, suffix: "+", label: "Hiring Partners" },
  { value: 20, suffix: "+", label: "College Collaborations" },
];

export const WHY_CHOOSE = [
  { title: "Industry-Oriented Curriculum", desc: "Designed with active industry mentors, not textbooks." },
  { title: "Live Training Sessions", desc: "Cohort-based learning with real engineers and recruiters." },
  { title: "Real-World Projects", desc: "Build a portfolio that survives the 7-second resume scan." },
  { title: "Mock Interviews", desc: "Technical + HR rounds with senior hiring managers." },
  { title: "Placement Support", desc: "Active referrals into our 50+ hiring partner network." },
  { title: "Internship Opportunities", desc: "100+ live internships across 8 business domains." },
  { title: "Career Mentorship", desc: "1:1 mentorship from professionals currently in the industry." },
  { title: "Employer Network", desc: "Direct hiring pipelines into mid-cap and product companies." },
];

export const PROGRAMS = [
  {
    id: "tech-job-readiness",
    title: "Tech Job Readiness Program",
    duration: "12 weeks",
    mode: "Hybrid (Live + Recorded)",
    outcomes: "SDE / SDET / QA Roles · ₹4–8 LPA",
    curriculum: ["Java", "SQL", "API Testing", "Selenium", "Playwright", "Git & GitHub", "Interview Prep"],
  },
  {
    id: "soft-skills-interview",
    title: "Soft Skills & Interview Preparation",
    duration: "6 weeks",
    mode: "Live cohort",
    outcomes: "HR rounds · Communication · Branding",
    curriculum: ["Communication", "HR Interview Skills", "Resume Building", "LinkedIn Branding"],
  },
  {
    id: "sales-bd",
    title: "Sales & Business Development",
    duration: "8 weeks",
    mode: "Live + Practicum",
    outcomes: "BDA / Sales Exec roles · ₹3.5–6 LPA",
    curriculum: ["Sales Fundamentals", "CRM Tools", "Client Communication", "Lead Generation"],
  },
  {
    id: "ai-digital-skills",
    title: "AI & Digital Skills",
    duration: "10 weeks",
    mode: "Hybrid",
    outcomes: "AI-augmented roles · Analyst tracks",
    curriculum: ["Prompt Engineering", "Vector DBs & RAG", "Agentic Workflows", "AI Evaluation"],
  },
];

export const PLACEMENT_STEPS = [
  { n: 1, title: "Enroll in Program", desc: "Pick a track aligned with your career goal." },
  { n: 2, title: "Complete Training", desc: "Live sessions + mentor-led practicums." },
  { n: 3, title: "Build Portfolio", desc: "Ship real projects with measurable outcomes." },
  { n: 4, title: "Mock Interviews", desc: "Technical + HR rounds with senior managers." },
  { n: 5, title: "Internship Opportunities", desc: "Apply real skills inside hiring partner teams." },
  { n: 6, title: "Placement Assistance", desc: "Referrals, drives, and final-round prep." },
];

export const TESTIMONIALS = [
  {
    name: "Aishwarya R.",
    role: "QA Engineer · Hexaware",
    quote:
      "SkillEn's mock interviews were brutal in the best way. By the time I walked into the real one I had already failed three times in practice — and learned exactly why.",
    image: "https://images.pexels.com/photos/31869537/pexels-photo-31869537.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Karthik S.",
    role: "Business Development Associate",
    quote:
      "I came from a non-IT background. The Sales & BD program taught me how to read a P&L and pitch in the same week. Got placed within 40 days.",
    image: "https://images.pexels.com/photos/26872232/pexels-photo-26872232.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Neha P.",
    role: "SDET Intern · Product Startup",
    quote:
      "The Playwright + Selenium combo opened doors I didn't know existed. My mentor still reviews my code on weekends.",
    image: "https://images.pexels.com/photos/9159042/pexels-photo-9159042.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export const PARTNER_NAMES = [
  "InfoTech", "Hexaware", "Capgemini", "Wipro Spark", "TCS BPS", "Mindtree",
  "Cognizant", "Accenture Edge", "Tech Mahindra", "LTIMindtree", "HCL",
];

export const MOCK_TRACKS = [
  { id: "java", name: "Java" },
  { id: "automation", name: "Automation Testing" },
  { id: "sql", name: "SQL" },
  { id: "api", name: "API Testing" },
  { id: "sales", name: "Sales & BD" },
  { id: "hr", name: "HR Interviews" },
];

export const FAQ_STUDENTS = [
  { q: "Do I need a tech background to enroll?", a: "No. We offer tracks for both tech (Java, QA, Automation) and non-tech (Sales, BD, HR Interview Prep)." },
  { q: "What is the placement assistance process?", a: "After mock interviews and portfolio review, you are added to active referral drives with our 50+ hiring partners." },
  { q: "Are internships paid?", a: "Most internships through our partner network are paid stipends; some are conversion-based (intern-to-full-time)." },
  { q: "Is the training online or offline?", a: "Hybrid — live online cohorts with optional in-person mock interview drives in select cities." },
  { q: "Do I get a certificate?", a: "Yes. A SkillEn completion certificate plus mentor recommendation for top performers." },
];

export const CONTACT = {
  email: "info@skillen.in",
  phone: "+91 7070330407",
  whatsapp: "+917070330407",
  instagram: "https://www.instagram.com/skillen_?igsh=dTRnbGE5Njk4MWJ6",
  linkedin: "https://www.linkedin.com/company/skill-en/",
};

export const VALUES = [
  { title: "Growth", desc: "Every program is built around measurable career outcomes." },
  { title: "Integrity", desc: "We never sell promises we can't deliver." },
  { title: "Innovation", desc: "We update curriculum every quarter — because the industry does." },
  { title: "Excellence", desc: "Mentors are active practitioners, not retired trainers." },
];
