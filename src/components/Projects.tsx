import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { Reveal, SectionHead } from './motion'
import { GITHUB_REPOS_URL } from '../data/socials'

const PROJECTS = [
  {
    index: '01',
    title: 'ComicVerse',
    category: 'Mobile · E-Commerce',
    tag: 'Internship',
    description:
      'E-commerce simulation app for browsing manga, novels and webtoons — built and shipped during my Flutter internship.',
    features: [
      'Login and session handling',
      'Category browsing and search',
      'Cart with state management',
    ],
    stack: ['Flutter', 'Dart', 'State Management'],
    image: 'images/projects/comicverse.jpg',
  },
  {
    index: '02',
    title: 'BLUEMARK',
    category: 'System · Firebase',
    description:
      'Role-based attendance management system with hierarchical access for Principal, HOD, Staff and Students.',
    features: [
      'Four-tier role-based dashboards',
      'Real-time attendance updates',
      'Centralized Firebase database',
    ],
    stack: ['Firebase', 'Role-Based Auth', 'Real-time DB'],
    image: 'images/projects/bluemark.jpg',
  },
  {
    index: '03',
    title: 'TUNO',
    category: 'Mobile · Real-time',
    description:
      'WhatsApp-style messaging app with live synchronization, Google sign-in and dynamic profile management.',
    features: [
      'Google authentication integration',
      'Live chat sync, zero refresh',
      'Profile and bio management',
    ],
    stack: ['Flutter', 'Firebase', 'Google Auth'],
    image: 'images/projects/tuno.jpg',
  },
  {
    index: '04',
    title: 'Foodverse',
    category: 'Platform · Web',
    description:
      'Food delivery platform for customers, vendors and delivery partners on a layered Node.js backend.',
    features: [
      'JWT auth and protected routes',
      'Vendor, customer and delivery flows',
      'Full order lifecycle tracking',
    ],
    stack: ['Node.js', 'Express', 'MongoDB', 'React', 'JWT'],
    image: 'images/projects/foodverse.jpg',
  },
  {
    index: '05',
    title: 'Pixel Dodge',
    category: 'Game · Web',
    description:
      'Arcade survival game — dodge hazards, collect coins and climb the leaderboard.',
    features: [
      'Hazard dodging and coin scoring',
      'Competitive leaderboard',
      'Fast, keyboard-first gameplay',
    ],
    stack: ['React', 'TypeScript', 'Vite'],
    image: 'images/projects/pixeldodge.jpg',
  },
  {
    index: '06',
    title: 'Crop Yield Prediction',
    category: 'AI / ML · Python',
    description:
      'Machine learning model that predicts crop yield from agricultural data.',
    features: [
      'Yield prediction from agri data',
      'End-to-end Python data pipeline',
      'Trained and evaluated ML model',
    ],
    stack: ['Python', 'Machine Learning', 'Data Analysis'],
    image: 'images/projects/cropyield.jpg',
  },
]

/* 3D tilt wrapper — cards lean toward the cursor */
function Tilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 160, damping: 18, mass: 0.4 })
  const sry = useSpring(ry, { stiffness: 160, damping: 18, mass: 0.4 })

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1100 }}
      className="h-full will-change-transform"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 6.5)
        rx.set((0.5 - (e.clientY - r.top) / r.height) * 6.5)
      }}
      onMouseLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            label="02 / Selected Work"
            title="Things I've designed, built & shipped."
            description="Six projects across mobile, systems, web platforms, games and machine learning — each one built to work, not just to demo."
          />
          <Reveal delay={0.2}>
            <p className="font-mono text-sm text-fog">
              <span className="text-lime">(</span>01{' '}
              <span className="text-cream/30">——</span> 06
              <span className="text-lime">)</span>
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:gap-6 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={0.05 * (i % 2)} className="h-full">
              <Tilt>
                <a
                  href={GITHUB_REPOS_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title} — view code on GitHub`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream/10 bg-surface shadow-[0_2px_24px_-14px_rgba(23,23,29,0.16)] transition-colors duration-500 hover:border-lime/40 hover:shadow-[0_34px_64px_-26px_rgba(75,70,229,0.35)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={p.image}
                      alt={`${p.title} project artwork`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-md bg-black/45 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur-sm">
                      {p.index}
                    </span>
                    {p.tag && (
                      <span className="absolute right-4 top-4 rounded-md bg-lime/90 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                        {p.tag}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-lime">
                        {p.category}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-4">
                        <h3 className="font-display text-2xl font-semibold tracking-tight text-cream">
                          {p.title}
                        </h3>
                        <ArrowUpRight
                          className="size-5 shrink-0 text-fog transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                          aria-hidden
                        />
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-fog">
                      {p.description}
                    </p>

                    <ul className="grid gap-1.5">
                      {p.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-[13px] text-fog"
                        >
                          <Check
                            className="mt-0.5 size-3.5 shrink-0 text-lime"
                            aria-hidden
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {p.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
