import React, { useEffect, useRef, useState } from "react";

export function Counter({ to = 100, suffix = "+", duration = 1500 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (t) => {
            const p = Math.min((t - start) / duration, 1);
            setVal(Math.floor(p * to));
            if (p < 1) requestAnimationFrame(step);
            else setVal(to);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className="font-display tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

export function SectionLabel({ children, className = "" }) {
  return (
    <p className={`text-xs uppercase tracking-[0.25em] font-semibold text-[#F26C21] ${className}`}>
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, sub, className = "" }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && <SectionLabel className="mb-4">{eyebrow}</SectionLabel>}
      <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-[#06252C] leading-[1.05]">
        {title}
      </h2>
      {sub && <p className="mt-5 text-base md:text-lg text-[#163A44]/80 max-w-2xl">{sub}</p>}
    </div>
  );
}

export function PrimaryBtn({ children, className = "", ...rest }) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 bg-[#F26C21] text-white px-6 py-3 text-sm font-semibold rounded-sm hover:bg-[#FF6600] transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryBtn({ children, className = "", ...rest }) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 bg-transparent border border-[#06252C] text-[#06252C] px-6 py-3 text-sm font-semibold rounded-sm hover:bg-[#06252C] hover:text-white transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
