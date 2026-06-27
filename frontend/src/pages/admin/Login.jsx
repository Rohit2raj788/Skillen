import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Logo } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/admin");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:flex relative bg-[#06252C] text-white p-12 flex-col justify-between se-grain">
        <Logo light />
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#F26C21] font-bold">Admin Console</p>
          <h1 className="mt-4 font-display text-5xl font-black leading-[1.02]">
            Manage every lead.<br />Publish every story.
          </h1>
          <p className="mt-6 text-white/70 max-w-md">
            Sign in to view incoming applications, hiring requests, college inquiries and your blog.
          </p>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} SkillEn</p>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-16">
        <form onSubmit={submit} className="w-full max-w-md" data-testid="admin-login-form">
          <div className="lg:hidden mb-8 block"><Logo /></div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#F26C21] font-bold">Admin Login</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-[#06252C]">Sign in to continue</h2>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] font-bold">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="admin-email"
                className="mt-1 w-full border border-[#06252C]/20 px-3 py-3 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] font-bold">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid="admin-password"
                className="mt-1 w-full border border-[#06252C]/20 px-3 py-3 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#F26C21]" />
            </div>
          </div>

          <button type="submit" disabled={busy} data-testid="admin-login-submit"
            className="mt-8 w-full bg-[#F26C21] text-white py-3 text-sm font-semibold rounded-sm hover:bg-[#FF6600] transition disabled:opacity-50">
            {busy ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}
