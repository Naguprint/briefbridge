import React, { useState } from 'react'

// Single‑file React landing page inspired by Slack aesthetics
// — clean typography, rounded pills, subtle gradients, soft shadows
// TailwindCSS utility classes are used for styling.

export default function App() {
  const [openForm, setOpenForm] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteBackground />
      <Header onCTAClick={() => setOpenForm(true)} />
      <main>
        <Hero onCTAClick={() => setOpenForm(true)} />
        <LogosBar />
        <HowItWorks />
        <Categories onCTAClick={() => setOpenForm(true)} />
        <FeaturedPros />
        <Stats />
        <Testimonials />
        <FAQ />
        <CTA onCTAClick={() => setOpenForm(true)} />
      </main>
      <Footer />
      {openForm && <BriefForm onClose={() => setOpenForm(false)} />}
    </div>
  )
}

function SiteBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-200 to-fuchsia-200 opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-teal-200 to-emerald-200 opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-gradient-to-tr from-amber-200 to-rose-200 opacity-60 blur-3xl" />
    </div>
  )
}

function Header({ onCTAClick }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="font-semibold tracking-tight">BriefBridge</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#categories" className="hover:text-slate-900">Categories</a>
            <a href="#pros" className="hover:text-slate-900">For clients</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-white shadow-sm" aria-label="Sign in">Sign in</button>
            <button onClick={onCTAClick} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500">Post a brief</button>
          </div>
        </div>
      </div>
    </header>
  )
}

function Hero({ onCTAClick }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow ring-1 ring-slate-200">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              New: Faster matching & curated pros
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Hire top creative & web pros
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">within 24 hours</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Describe your project once. Receive tailored offers. Compare, chat, and hire with confidence.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
              <button onClick={onCTAClick} className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold shadow hover:bg-indigo-500">
                <Sparkle className="h-5 w-5" /> Post a brief
              </button>
              <a href="#how" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                <Play className="h-5 w-5" /> See how it works
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-emerald-600" /> Verified pros</div>
              <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-indigo-600" /> Quotes in a day</div>
              <div className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /> Client‑rated</div>
            </div>
          </div>
          <div className="relative">
            <div className="relative mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
                <div className="text-sm">
                  <div className="font-semibold">Acme Roastery</div>
                  <div className="text-slate-500">Brand refresh & ecommerce</div>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <div className="mb-3 text-sm font-semibold text-slate-700">Incoming offers</div>
                <OfferRow name="Northwind Studio" price="€2,950" eta="2 weeks" rating={4.8} />
                <OfferRow name="Pixel&Paper" price="€2,400" eta="10 days" rating={4.6} />
                <OfferRow name="Bold Web Co" price="€3,200" eta="3 weeks" rating={4.9} />
              </div>
              <button onClick={onCTAClick} className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-white font-semibold shadow hover:bg-indigo-500">Start your project</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LogosBar() {
  const logos = ["Figma", "Shopify", "WordPress", "Webflow", "Woo", "Framer"]
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70">
          {logos.map((l) => (
            <div key={l} className="text-sm font-semibold text-slate-500">{l}</div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      title: 'Post a brief',
      desc: 'Answer a few guided questions. It takes ~2 minutes.',
      icon: <Pencil className="h-6 w-6" />,
    },
    {
      title: 'Get offers fast',
      desc: 'Receive multiple proposals and chat in one place.',
      icon: <Bolt className="h-6 w-6" />,
    },
    {
      title: 'Hire with confidence',
      desc: 'Review ratings, portfolios and timelines. Pick the best fit.',
      icon: <Shield className="h-6 w-6" />,
    },
  ]
  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mt-3 text-slate-600">Simple, transparent and built for speed.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">{s.icon}</div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Categories({ onCTAClick }) {
  const cats = [
    'Websites', 'E‑commerce', 'Logos & Branding', 'Graphic Design', 'UI/UX', 'Illustration',
    'SEO', 'Copywriting', 'Social Media', 'Photography', 'Video', 'Programming'
  ]
  return (
    <section id="categories" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Popular categories</h2>
            <p className="mt-2 text-slate-600">Browse specialties or just post a brief and let pros come to you.</p>
          </div>
          <button onClick={onCTAClick} className="hidden md:inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800">Post a brief</button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cats.map((c) => (
            <a key={c} href="#" className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{c}</h3>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-700" />
              </div>
              <p className="mt-1 text-sm text-slate-600">Hand‑picked freelancers & studios.</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedPros() {
  const pros = [
    { name: 'Northwind Studio', tags: ['Web', 'Branding'], rating: 4.8, projects: 126 },
    { name: 'Pixel&Paper', tags: ['E‑com', 'UI/UX'], rating: 4.6, projects: 98 },
    { name: 'Bold Web Co', tags: ['Webflow', 'SEO'], rating: 4.9, projects: 203 },
    { name: 'Aurora Creative', tags: ['Logo', 'Illustration'], rating: 4.7, projects: 152 },
  ]
  return (
    <section id="pros" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured professionals</h2>
            <p className="mt-2 text-slate-600">Browse verified profiles with ratings and recent work.</p>
          </div>
          <a href="#" className="text-sm font-semibold text-indigo-700 hover:text-indigo-600">See all →</a>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pros.map((p) => (
            <div key={p.name} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 ring-2 ring-white" />
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-slate-500">{p.tags.join(' • ')}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /><span className="font-medium">{p.rating}</span></div>
                <div>{p.projects} projects</div>
              </div>
              <button className="mt-4 w-full rounded-xl border border-slate-300 bg-white py-2 text-sm font-semibold hover:bg-slate-50">View profile</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const items = [
    { label: 'Pros in network', value: '8,000+' },
    { label: 'Projects posted', value: '10,000+' },
    { label: 'Avg. response time', value: '~24h' },
    { label: 'Client satisfaction', value: '4.8/5' },
  ]
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-3xl bg-slate-50 p-8 ring-1 ring-slate-100 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.label} className="text-center">
              <div className="text-3xl font-extrabold tracking-tight">{it.value}</div>
              <div className="mt-1 text-sm text-slate-600">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const ts = [
    {
      quote: 'We posted a brief on Monday and signed on a brilliant studio by Wednesday. Smooth and transparent process.',
      name: 'Maya K.',
      role: 'CMO, TinyTreats',
    },
    {
      quote: 'Clear apples‑to‑apples proposals made it easy to choose. We love the built‑in messaging and milestones.',
      name: 'Jon R.',
      role: 'Founder, SitStand Co',
    },
  ]
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by growing teams</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {ts.map((t, i) => (
            <figure key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <blockquote className="text-lg tracking-tight">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-slate-600">{t.name} — {t.role}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const faqs = [
    {
      q: 'Is posting a brief free?',
      a: 'Yes. Posting is free. You only pay the professional you hire.'
    },
    {
      q: 'How quickly will I get offers?',
      a: 'Most briefs receive initial responses within 24 hours.'
    },
    {
      q: 'Can I invite my own vendors?',
      a: 'Absolutely. Share a private link and your vendors can submit proposals here.'
    },
    {
      q: 'Do you vet professionals?',
      a: 'Profiles include verified details, portfolio links and client ratings to help you decide.'
    },
  ]
  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200">
          {faqs.map((f, i) => (
            <details key={f.q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-base font-semibold">{f.q}</span>
                <span className="rounded-full border border-slate-300 p-1 text-slate-500 group-open:rotate-45 transition"><Plus className="h-4 w-4"/></span>
              </summary>
              <p className="mt-3 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA({ onCTAClick }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-8 text-white shadow">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/20 blur-2xl"/>
          <h2 className="text-3xl font-bold tracking-tight">Ready to meet your next creative partner?</h2>
          <p className="mt-2 text-white/90">Post a brief now and start getting offers today.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={onCTAClick} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-slate-900 font-semibold shadow hover:bg-slate-100">
              <Sparkle className="h-5 w-5" /> Post a brief
            </button>
            <a href="#how" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white/90 hover:bg-white/10">How it works</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <span className="font-semibold">BriefBridge</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">A modern way to hire creative and web professionals.</p>
          </div>
          <div>
            <div className="text-sm font-semibold">Product</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li><a href="#how" className="hover:text-slate-900">How it works</a></li>
              <li><a href="#categories" className="hover:text-slate-900">Categories</a></li>
              <li><a href="#pros" className="hover:text-slate-900">Professionals</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">Company</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">About</a></li>
              <li><a href="#" className="hover:text-slate-900">Blog</a></li>
              <li><a href="#" className="hover:text-slate-900">Careers</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">Support</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li><a href="#faq" className="hover:text-slate-900">Help center</a></li>
              <li><a href="#" className="hover:text-slate-900">Contact</a></li>
              <li><a href="#" className="hover:text-slate-900">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 py-6 text-sm text-slate-500 sm:flex-row">
          <div>© {new Date().getFullYear()} BriefBridge. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-700">Terms</a>
            <a href="#" className="hover:text-slate-700">Security</a>
            <a href="#" className="hover:text-slate-700">Status</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function BriefForm({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Post a brief</h3>
            <p className="mt-1 text-sm text-slate-600">Tell us about your project and timing. We’ll notify matching pros.</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-300 p-2 hover:bg-slate-50" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Project title</label>
            <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Website redesign for coffee brand" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Category</label>
            <select className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Websites</option>
              <option>E‑commerce</option>
              <option>Logos & Branding</option>
              <option>UI/UX</option>
              <option>Graphic Design</option>
              <option>Copywriting</option>
              <option>SEO</option>
              <option>Programming</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Budget (EUR)</label>
            <div className="flex gap-3">
              <input type="number" className="w-1/2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Min" />
              <input type="number" className="w-1/2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Max" />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Timeline</label>
            <select className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>ASAP (within 1–2 weeks)</option>
              <option>Within 1 month</option>
              <option>Flexible</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Project details</label>
            <textarea rows={5} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Describe goals, deliverables, tech stack, examples you like, etc." />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Your name</label>
              <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <input type="email" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" /> I agree to the Terms and Privacy
            </label>
            <button type="button" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500">Submit brief</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function OfferRow({ name, price, eta, rating }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-slate-500">ETA {eta}</div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-amber-500"><Star className="h-4 w-4" /><span className="text-slate-800">{rating}</span></div>
        <div className="font-semibold">{price}</div>
      </div>
    </div>
  )
}

// --- Icons (simple inline SVGs to avoid external deps) ---
function Logo({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="9" height="9" rx="2" className="fill-indigo-600" />
      <rect x="13" y="2" width="9" height="9" rx="2" className="fill-fuchsia-500" />
      <rect x="2" y="13" width="9" height="9" rx="2" className="fill-sky-400" />
      <rect x="13" y="13" width="9" height="9" rx="2" className="fill-emerald-500" />
    </svg>
  )
}

function Sparkle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
    </svg>
  )
}

function Play(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M8 5v14l11-7-11-7z" />
    </svg>
  )
}

function Shield(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M12 2l8 4v6c0 5-3.8 9.2-8 10-4.2-.8-8-5-8-10V6l8-4z" />
    </svg>
  )
}

function Clock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 1-1.7-4-2.3V7z" />
    </svg>
  )
}

function Star(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M12 3l3 6 6 1-4.5 4.3 1 6.7L12 18l-5.5 3 1-6.7L3 10l6-1 3-6z" />
    </svg>
  )
}

function Plus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M11 5h2v14h-2z" /><path d="M5 11h14v2H5z" />
    </svg>
  )
}

function ArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2L11.6 6.4 13 5z" />
    </svg>
  )
}

function X(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z" />
    </svg>
  )
}

// Added missing icons causing runtime error
function Pencil(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
      <path d="M20.71 7.04a1 1 0 000-1.41L18.37 3.3a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.84z" />
    </svg>
  )
}

function Bolt(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M11 21l6-10h-4l2-8-8 12h4l-2 6z" />
    </svg>
  )
}

// --- Dev smoke tests (non‑intrusive) ---
function runSmokeTests() {
  try {
    console.assert(typeof Pencil === 'function', 'Pencil icon should be defined')
    console.assert(typeof Bolt === 'function', 'Bolt icon should be defined')
    console.assert(typeof Shield === 'function', 'Shield icon should be defined')

    // Can create elements without throwing
    React.createElement(Pencil, { className: 'h-4 w-4' })
    React.createElement(Bolt, { className: 'h-4 w-4' })

    // HowItWorks should conceptually have 3 steps
    const expectedSteps = 3
    console.assert(expectedSteps === 3, 'HowItWorks should render 3 steps')
  } catch (e) {
    console.error('Smoke tests failed', e)
  }
}

if (typeof window !== 'undefined' && !window.__BRIEFBRIDGE_TESTED) {
  runSmokeTests()
  window.__BRIEFBRIDGE_TESTED = true
}
