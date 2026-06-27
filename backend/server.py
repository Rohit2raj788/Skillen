from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# ---------------------------------------------------------------------------
# MongoDB
# ---------------------------------------------------------------------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ['JWT_SECRET']
bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> dict:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def get_admin_user(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str


# Lead models -- single collection `leads` distinguished by `lead_type`
LeadType = Literal["contact", "hiring", "college", "mock_booking", "student_enroll"]


class ContactLeadIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str


class HiringLeadIn(BaseModel):
    company_name: str
    contact_person: str
    email: EmailStr
    phone: Optional[str] = None
    hiring_requirement: str
    number_of_positions: int = Field(ge=1, le=10000)


class CollegeLeadIn(BaseModel):
    college_name: str
    contact_person: str
    email: EmailStr
    phone: Optional[str] = None
    interested_in: str
    message: Optional[str] = None


class MockBookingIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    track: str  # Java, Automation Testing, SQL, API Testing, Sales & BD, HR
    package: Literal["1-mock", "3-mock"]
    preferred_date: Optional[str] = None
    notes: Optional[str] = None


class EnrollLeadIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    program: str
    message: Optional[str] = None


class LeadOut(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: str
    lead_type: LeadType
    created_at: str
    status: str = "new"


class BlogIn(BaseModel):
    title: str
    slug: str
    category: str
    excerpt: str
    content: str
    cover_image: Optional[str] = None
    author: str = "SkillEn Team"
    published: bool = True


class BlogPatch(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    author: Optional[str] = None
    published: Optional[bool] = None


class StatsOut(BaseModel):
    total_leads: int
    by_type: dict
    new_leads: int
    total_blogs: int


# ---------------------------------------------------------------------------
# App + Router
# ---------------------------------------------------------------------------
app = FastAPI(title="SkillEn API")
api_router = APIRouter(prefix="/api")


# Auth ----------------------------------------------------------------------
@api_router.post("/auth/login")
async def login(payload: LoginInput):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"], user.get("role", "admin"))
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", "Admin"),
            "role": user.get("role", "admin"),
        },
    }


@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(**user)


# Public lead capture -------------------------------------------------------
async def _insert_lead(lead_type: str, data: dict) -> dict:
    doc = {
        "id": str(uuid.uuid4()),
        "lead_type": lead_type,
        "created_at": now_iso(),
        "status": "new",
        **data,
    }
    await db.leads.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.post("/leads/contact")
async def create_contact_lead(payload: ContactLeadIn):
    return await _insert_lead("contact", payload.model_dump())


@api_router.post("/leads/hiring")
async def create_hiring_lead(payload: HiringLeadIn):
    return await _insert_lead("hiring", payload.model_dump())


@api_router.post("/leads/college")
async def create_college_lead(payload: CollegeLeadIn):
    return await _insert_lead("college", payload.model_dump())


@api_router.post("/leads/mock-booking")
async def create_mock_booking(payload: MockBookingIn):
    return await _insert_lead("mock_booking", payload.model_dump())


@api_router.post("/leads/enroll")
async def create_enroll_lead(payload: EnrollLeadIn):
    return await _insert_lead("student_enroll", payload.model_dump())


# Public blog ---------------------------------------------------------------
@api_router.get("/blogs")
async def list_blogs(category: Optional[str] = None, limit: int = 50):
    q: dict = {"published": True}
    if category and category != "All":
        q["category"] = category
    cursor = db.blogs.find(q, {"_id": 0}).sort("created_at", -1).limit(limit)
    return await cursor.to_list(limit)


@api_router.get("/blogs/{slug}")
async def get_blog(slug: str):
    blog = await db.blogs.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


# Admin ---------------------------------------------------------------------
@api_router.get("/admin/stats", response_model=StatsOut)
async def admin_stats(_: dict = Depends(get_admin_user)):
    total = await db.leads.count_documents({})
    new_count = await db.leads.count_documents({"status": "new"})
    blogs_count = await db.blogs.count_documents({})
    pipeline = [{"$group": {"_id": "$lead_type", "n": {"$sum": 1}}}]
    by_type_raw = await db.leads.aggregate(pipeline).to_list(20)
    by_type = {row["_id"]: row["n"] for row in by_type_raw}
    return StatsOut(total_leads=total, by_type=by_type, new_leads=new_count, total_blogs=blogs_count)


@api_router.get("/admin/leads")
async def admin_list_leads(
    lead_type: Optional[str] = None,
    status_filter: Optional[str] = None,
    _: dict = Depends(get_admin_user),
):
    q: dict = {}
    if lead_type and lead_type != "all":
        q["lead_type"] = lead_type
    if status_filter and status_filter != "all":
        q["status"] = status_filter
    cursor = db.leads.find(q, {"_id": 0}).sort("created_at", -1).limit(500)
    return await cursor.to_list(500)


@api_router.patch("/admin/leads/{lead_id}")
async def admin_update_lead_status(
    lead_id: str,
    payload: dict,
    _: dict = Depends(get_admin_user),
):
    allowed = {"new", "contacted", "qualified", "closed"}
    new_status = payload.get("status")
    if new_status not in allowed:
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.leads.update_one({"id": lead_id}, {"$set": {"status": new_status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True}


@api_router.delete("/admin/leads/{lead_id}")
async def admin_delete_lead(lead_id: str, _: dict = Depends(get_admin_user)):
    res = await db.leads.delete_one({"id": lead_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True}


@api_router.get("/admin/blogs")
async def admin_list_blogs(_: dict = Depends(get_admin_user)):
    cursor = db.blogs.find({}, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(500)


@api_router.post("/admin/blogs")
async def admin_create_blog(payload: BlogIn, _: dict = Depends(get_admin_user)):
    exists = await db.blogs.find_one({"slug": payload.slug})
    if exists:
        raise HTTPException(status_code=400, detail="Slug already exists")
    doc = {
        "id": str(uuid.uuid4()),
        "created_at": now_iso(),
        "updated_at": now_iso(),
        **payload.model_dump(),
    }
    await db.blogs.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.patch("/admin/blogs/{blog_id}")
async def admin_update_blog(blog_id: str, payload: BlogPatch, _: dict = Depends(get_admin_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    updates["updated_at"] = now_iso()
    res = await db.blogs.update_one({"id": blog_id}, {"$set": updates})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    blog = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    return blog


@api_router.delete("/admin/blogs/{blog_id}")
async def admin_delete_blog(blog_id: str, _: dict = Depends(get_admin_user)):
    res = await db.blogs.delete_one({"id": blog_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"ok": True}


# Health --------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"service": "SkillEn API", "status": "ok"}


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Startup: seed admin + indexes + sample blogs
# ---------------------------------------------------------------------------
SAMPLE_BLOGS = [
    {
        "slug": "ace-your-first-tech-interview",
        "title": "How to Ace Your First Tech Interview in 2026",
        "category": "Interview Preparation",
        "excerpt": "From the STAR method to whiteboard etiquette — a no-nonsense playbook used by 500+ SkillEn graduates.",
        "cover_image": "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=70",
        "author": "SkillEn Mentors",
        "content": "## The 7 things hiring managers actually look for\n\nMost candidates over-prepare for puzzles and under-prepare for the basics. Here are the seven signals that recruiters at our 50+ partner companies consistently flag as decisive.\n\n1. **Clarity of thought** — verbalise your approach before writing code.\n2. **Communication** — explain trade-offs, not just the final answer.\n3. **Project ownership** — talk about *your* commits, not the team's.\n4. **Curiosity** — ask the interviewer at least two thoughtful questions.\n5. **Behavioural fit** — the STAR method is non-negotiable.\n6. **Fundamentals** — DSA, OOP, SQL joins. Always.\n7. **Follow-through** — a 24-hour thank-you note still works.\n\nWant to practice? Book a mock interview with a senior engineer from our network.",
    },
    {
        "slug": "resume-mistakes-freshers-make",
        "title": "5 Resume Mistakes Every Fresher Makes (and How to Fix Them)",
        "category": "Resume Tips",
        "excerpt": "Recruiters spend 7 seconds on a resume. Make those seconds count with these field-tested fixes.",
        "cover_image": "https://images.pexels.com/photos/9159042/pexels-photo-9159042.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "author": "Priya Nair",
        "content": "## Stop writing 'hard-working team player'\n\nGeneric adjectives are the fastest way to the rejection pile. Replace them with measurable outcomes.\n\n- ❌ *Improved website performance*\n- ✅ *Reduced page load by 38% by code-splitting React routes*\n\nQuantify everything. If you can't quantify it, it probably doesn't belong on a one-page resume.",
    },
    {
        "slug": "ai-skills-every-graduate-needs",
        "title": "The 4 AI Skills Every 2026 Graduate Must Have",
        "category": "AI & Future Skills",
        "excerpt": "Prompt engineering is table stakes. Here is what actually gets you hired in an AI-first job market.",
        "cover_image": "https://images.pexels.com/photos/8463151/pexels-photo-8463151.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "author": "Arjun Mehta",
        "content": "## Beyond ChatGPT\n\n1. **Prompt engineering** — knowing how to talk to LLMs.\n2. **Vector databases** — RAG is the new search.\n3. **Agentic workflows** — LangChain, n8n, automation thinking.\n4. **Evaluation** — measuring whether your AI feature actually works.\n\nWe cover all four in our AI & Digital Skills track.",
    },
    {
        "slug": "linkedin-optimization-2026",
        "title": "LinkedIn Optimization: The 2026 Edition",
        "category": "Career Growth",
        "excerpt": "Your LinkedIn headline is doing 80% of the work. Here is the exact formula our graduates use.",
        "cover_image": "https://images.pexels.com/photos/7972324/pexels-photo-7972324.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "author": "SkillEn Team",
        "content": "## The headline formula\n\n`[Role] | [Specialisation] | [Outcome you deliver]`\n\nExample: *SDET Intern | Playwright + API Testing | I help teams ship 2x faster*\n\nThen mirror the same language in your About section. Recruiters search for keywords — give them the exact ones from job descriptions you want.",
    },
    {
        "slug": "playwright-vs-selenium-2026",
        "title": "Playwright vs Selenium in 2026 — Which Should Freshers Learn?",
        "category": "Technology Trends",
        "excerpt": "Both pay well. One has a steeper learning curve. We benchmarked them for entry-level QA roles.",
        "cover_image": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=70",
        "author": "Rahul Verma",
        "content": "## TL;DR\n\nLearn Selenium first (still 70% of job postings), then add Playwright as a differentiator. Our Tech Job Readiness program covers both.",
    },
]


@app.on_event("startup")
async def on_startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.leads.create_index("id", unique=True)
    await db.leads.create_index("created_at")
    await db.leads.create_index("lead_type")
    await db.blogs.create_index("slug", unique=True)
    await db.blogs.create_index("id", unique=True)

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@skillen.in").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "SkillEn@2026")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "SkillEn Admin",
            "role": "admin",
            "password_hash": hash_password(admin_password),
            "created_at": now_iso(),
        })
        logger.info("Seeded admin user: %s", admin_email)
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info("Updated admin password for %s", admin_email)

    # Seed sample blogs (idempotent by slug)
    for blog in SAMPLE_BLOGS:
        if await db.blogs.find_one({"slug": blog["slug"]}):
            continue
        await db.blogs.insert_one({
            "id": str(uuid.uuid4()),
            "created_at": now_iso(),
            "updated_at": now_iso(),
            "published": True,
            **blog,
        })


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
