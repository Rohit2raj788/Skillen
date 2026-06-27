import React, { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MessageCircle, Instagram, Linkedin } from "lucide-react";
import { SectionLabel, PrimaryBtn } from "@/components/Primitives";
import { Input } from "@/pages/Students";
import { api, formatApiError } from "@/lib/api";
import { CONTACT } from "@/data/content";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/leads/contact", form);
      toast.success("Message received — we'll respond within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <SectionLabel>Contact</SectionLabel>
          <h1 className="mt-4 font-display text-5xl lg:text-6xl font-black text-[#06252C] leading-[1.02]">
            Let's talk.
          </h1>
          <p className="mt-5 text-lg text-[#163A44]/75 max-w-md">
            Whether you're a student, a hiring manager, or a placement officer — we usually reply in under 24 hours.
          </p>

          <div className="mt-10 space-y-4">
            <ContactRow icon={<Mail />} label="Email" value={CONTACT.email} href={`mailto:${CONTACT.email}`} />
            <ContactRow icon={<Phone />} label="Phone" value={CONTACT.phone} href={`tel:${CONTACT.phone}`} />
            <ContactRow icon={<MessageCircle />} label="WhatsApp" value={CONTACT.phone} href={`https://wa.me/${CONTACT.whatsapp.replace("+", "")}`} />
            <ContactRow icon={<Instagram />} label="Instagram" value="@skillen_" href={CONTACT.instagram} />
            <ContactRow icon={<Linkedin />} label="LinkedIn" value="skill-en" href={CONTACT.linkedin} />
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={submit} className="border border-[#06252C]/10 p-8 rounded-sm space-y-4" data-testid="contact-form">
            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required tid="contact-name" />
            <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required tid="contact-email" />
            <Input label="Phone (optional)" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} tid="contact-phone" />
            <Input label="Message" value={form.message} onChange={(v) => setForm({ ...form, message: v })} required textarea tid="contact-message" />
            <PrimaryBtn type="submit" disabled={busy} data-testid="contact-submit">{busy ? "Sending..." : "Send Message"}</PrimaryBtn>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value, href }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 group" data-testid={`contact-${label.toLowerCase()}`}>
      <div className="grid h-10 w-10 place-items-center bg-[#06252C] text-white rounded-sm group-hover:bg-[#F26C21] transition">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#06252C]/60 font-bold">{label}</p>
        <p className="text-sm font-semibold text-[#06252C] group-hover:text-[#F26C21] transition">{value}</p>
      </div>
    </a>
  );
}
