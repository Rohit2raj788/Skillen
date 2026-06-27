import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Students from "@/pages/Students";
import Companies from "@/pages/Companies";
import Colleges from "@/pages/Colleges";
import Courses from "@/pages/Courses";
import MockInterviews from "@/pages/MockInterviews";
import SuccessStories from "@/pages/SuccessStories";
import About from "@/pages/About";
import Blog, { BlogDetail } from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Jobs from "@/pages/Jobs";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";

function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-[#06252C]">Loading…</div>;
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace />;
  return children;
}

const wrap = (node) => <Layout>{node}</Layout>;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={wrap(<Home />)} />
            <Route path="/students" element={wrap(<Students />)} />
            <Route path="/companies" element={wrap(<Companies />)} />
            <Route path="/colleges" element={wrap(<Colleges />)} />
            <Route path="/courses" element={wrap(<Courses />)} />
            <Route path="/mock-interviews" element={wrap(<MockInterviews />)} />
            <Route path="/success-stories" element={wrap(<SuccessStories />)} />
            <Route path="/about" element={wrap(<About />)} />
            <Route path="/blog" element={wrap(<Blog />)} />
            <Route path="/blog/:slug" element={wrap(<BlogDetail />)} />
            <Route path="/contact" element={wrap(<Contact />)} />
            <Route path="/jobs" element={wrap(<Jobs />)} />
            <Route path="/internships" element={wrap(<Jobs />)} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
