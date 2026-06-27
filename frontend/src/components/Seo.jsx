import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE = "https://skillen.in";
const DEFAULT_IMAGE = "https://customer-assets.emergentagent.com/job_skill-launch-3/artifacts/pnf7vadm_skillen%2C%20logo.jpg";

/**
 * Per-page SEO meta tags + Open Graph + Twitter cards + JSON-LD.
 */
export default function Seo({
  title,
  description,
  image = DEFAULT_IMAGE,
  type = "website",
  schema, // optional JSON-LD object
}) {
  const { pathname } = useLocation();
  const url = `${SITE}${pathname}`;
  const fullTitle = title ? `${title} · SkillEn` : "SkillEn — Learn. Grow. Lead.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="SkillEn" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  );
}

/** Global organisation schema — included once via App.js */
export const OrgSchema = () => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "SkillEn",
      "url": SITE,
      "logo": DEFAULT_IMAGE,
      "slogan": "Learn. Grow. Lead.",
      "description": "Career development and talent solutions platform bridging students, colleges, and companies.",
      "email": "info@skillen.in",
      "telephone": "+91 7070330407",
      "sameAs": [
        "https://www.instagram.com/skillen_",
        "https://www.linkedin.com/company/skill-en/"
      ],
    })}</script>
  </Helmet>
);
