import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SectionHeading, SectionLabel } from "@/components/Primitives";
import { api } from "@/lib/api";

const CATEGORIES = ["All", "Interview Preparation", "Resume Tips", "Career Growth", "Technology Trends", "AI & Future Skills"];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [cat, setCat] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get("/blogs", { params: cat !== "All" ? { category: cat } : {} })
      .then(({ data }) => { if (!cancelled) setPosts(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [cat]);

  return (
    <>
      <section className="border-b border-[#06252C]/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20">
          <SectionLabel>Career Tips</SectionLabel>
          <h1 className="mt-4 font-display text-5xl lg:text-6xl font-black text-[#06252C] max-w-3xl leading-[1.02]">
            Honest, practical career advice. From people in the room.
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                data-testid={`blog-cat-${c.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-xs uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-sm border transition ${cat === c ? "bg-[#06252C] text-white border-[#06252C]" : "border-[#06252C]/20 text-[#06252C] hover:border-[#F26C21]"}`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="mt-12 text-[#163A44]/60">Loading articles...</p>
          ) : posts.length === 0 ? (
            <p className="mt-12 text-[#163A44]/60">No articles in this category yet.</p>
          ) : (
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p) => (
                <Link to={`/blog/${p.slug}`} key={p.slug} className="group border border-[#06252C]/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:border-[#F26C21] transition" data-testid={`blog-card-${p.slug}`}>
                  {p.cover_image && <img src={p.cover_image} alt={p.title} className="aspect-[16/10] w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#F26C21]">{p.category}</p>
                    <h3 className="mt-3 font-display text-xl font-extrabold text-[#06252C] leading-tight">{p.title}</h3>
                    <p className="mt-2 text-sm text-[#163A44]/75 line-clamp-2">{p.excerpt}</p>
                    <p className="mt-4 text-xs text-[#06252C]/60">{p.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.get(`/blogs/${slug}`)
      .then(({ data }) => setPost(data))
      .catch(() => setErr("Article not found"));
  }, [slug]);

  if (err) return <div className="mx-auto max-w-3xl px-5 lg:px-10 py-20"><p>{err}</p><Link to="/blog" className="text-[#F26C21]">← Back</Link></div>;
  if (!post) return <div className="mx-auto max-w-3xl px-5 lg:px-10 py-20">Loading...</div>;

  return (
    <article className="mx-auto max-w-3xl px-5 lg:px-10 py-16">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[#06252C] hover:text-[#F26C21]" data-testid="blog-back">
        <ArrowLeft size={14} /> Back to all articles
      </Link>
      <p className="mt-8 text-xs uppercase tracking-[0.25em] text-[#F26C21] font-bold">{post.category}</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl font-black text-[#06252C] leading-[1.05]">{post.title}</h1>
      <p className="mt-4 text-sm text-[#163A44]/70">{post.author} · {new Date(post.created_at).toLocaleDateString()}</p>
      {post.cover_image && <img src={post.cover_image} alt={post.title} className="mt-8 w-full aspect-[16/9] object-cover rounded-sm" />}
      <div className="prose prose-lg mt-8 max-w-none text-[#163A44]" data-testid="blog-content">
        {post.content.split("\n\n").map((p, i) => {
          if (p.startsWith("## ")) return <h2 key={i} className="font-display text-2xl font-extrabold text-[#06252C] mt-8">{p.replace("## ", "")}</h2>;
          if (p.startsWith("- ") || p.startsWith("1. ")) return <ul key={i} className="list-disc pl-6 my-4 space-y-2">{p.split("\n").map((li, j) => <li key={j}>{li.replace(/^[-\d.]+\s*/, "")}</li>)}</ul>;
          return <p key={i} className="my-4 leading-relaxed">{p}</p>;
        })}
      </div>
    </article>
  );
}
