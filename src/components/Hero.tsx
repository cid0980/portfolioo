import { Component, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NumberFlow from '@number-flow/react'
import { MeshGradient } from '@paper-design/shaders-react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react'
import Scene3D from './Scene3D'
import { Magnetic } from './motion'
import { GitHubIcon, InstagramIcon, LinkedInIcon } from './icons'
import { EMAIL, GITHUB_URL, INSTAGRAM_URL, LINKEDIN_URL } from '../data/socials'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/* only desktops run two WebGL contexts (shader bg + 3D) at once */
const FINE_POINTER =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches

const STATS = [
  { value: 6, suffix: '+', label: 'Projects shipped' },
  { value: 4, suffix: '+', label: 'Domains explored' },
  { value: 1, suffix: '', label: 'Internship completed' },
]

/* Never let a shader failure take the hero down */
class SafeGL extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function Hero({
  onNavigate,
  start,
}: {
  onNavigate: (id: string) => void
  start: boolean
}) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!start) return

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.fromTo(
        '.hero-eyebrow',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
      )
        .fromTo(
          '.hero-line-inner',
          { yPercent: 118, rotate: 3 },
          { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.13 },
          '-=0.35',
        )
        .fromTo(
          '.hero-copy',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.85 },
          '-=0.65',
        )
        .fromTo(
          '.hero-cta > *',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          '-=0.55',
        )
        .fromTo(
          '.hero-stats',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.45',
        )
        .fromTo(
          '.hero-cue',
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          '-=0.4',
        )

      /* scroll-scrubbed exit — geometry only; opacity is never touched,
         so the scene can never be hidden by an animation conflict */
      gsap.to('.hero-exit', {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to('.hero-heads', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: root, dependencies: [start], revertOnUpdate: true },
  )

  return (
    <section ref={root} id="top" className="relative overflow-hidden">
      {/* backdrop */}
      <div className="absolute inset-0" aria-hidden>
        {FINE_POINTER ? (
          <SafeGL>
            <MeshGradient
              colors={['#f6f5f0', '#c9ceff', '#9fbcff', '#ffe0b8']}
              speed={0.45}
              distortion={0.55}
              swirl={0.12}
              style={{ width: '100%', height: '100%', opacity: 0.85 }}
            />
          </SafeGL>
        ) : (
          <>
            <div className="absolute -top-40 left-[28%] h-[28rem] w-[50rem] -translate-x-1/2 rounded-full bg-lime/[0.12] blur-[140px]" />
            <div className="absolute right-[-10%] top-[18%] h-[26rem] w-[26rem] rounded-full bg-[#7db4ff]/25 blur-[120px]" />
            <div className="absolute bottom-[-22%] left-[-8%] h-[24rem] w-[24rem] rounded-full bg-[#ffd8a8]/40 blur-[120px]" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      </div>

      <div className="container-x relative grid gap-10 pb-16 pt-32 sm:pb-20 lg:min-h-screen lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-6 lg:pb-24 lg:pt-0">
        {/* left — copy */}
        <div className="hero-heads max-w-2xl">
          <p className="hero-eyebrow font-mono text-sm text-fog">
            A. Sheik Asen <span className="text-cream/25">—</span> Puducherry,
            India
          </p>

          <h1 className="mt-3 font-display text-[17vw] font-bold uppercase leading-[0.93] tracking-tight text-cream sm:text-7xl lg:text-7xl xl:text-[5.6rem]">
            <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
              <span className="hero-line-inner block will-change-transform">
                Software
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.02em]">
              <span className="hero-line-inner block will-change-transform">
                <span className="text-stroke">Developer</span>
                <span className="text-lime">.</span>
              </span>
            </span>
          </h1>

          <p className="hero-copy mt-7 max-w-lg text-base leading-relaxed text-fog sm:text-lg">
            BCA graduate building mobile apps, backend systems and real-time
            products — open to{' '}
            <span className="font-medium text-cream">
              any kind of software work
            </span>
            , not just the languages I already know. If it can be built,
            I&apos;m in.
          </p>

          <div className="hero-cta mt-9 flex flex-wrap items-center gap-3.5">
            <Magnetic>
              <button onClick={() => onNavigate('#work')} className="btn-accent">
                View selected work
                <ArrowDown size={15} />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => onNavigate('#contact')}
                className="btn-ghost"
              >
                Get in touch
                <ArrowUpRight size={15} />
              </button>
            </Magnetic>
            <div className="flex items-center gap-2.5">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="icon-btn"
                aria-label="GitHub profile"
              >
                <GitHubIcon size={17} />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="icon-btn"
                aria-label="LinkedIn profile"
              >
                <LinkedInIcon size={17} />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="icon-btn"
                aria-label="Instagram profile"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="icon-btn"
                aria-label="Send email"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          <div className="hero-stats mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-cream/15 pt-6 sm:gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-semibold tabular-nums text-cream sm:text-3xl">
                  <NumberFlow
                    value={start ? s.value : 0}
                    format={{ minimumIntegerDigits: 2 }}
                    trend={1}
                  />
                  <span className="text-lime">{s.suffix}</span>
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fog sm:text-[11px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* right — 3D — visibility owned by Scene3D itself, never GSAP */}
        <div className="hero-exit pointer-events-none relative h-[320px] sm:h-[400px] lg:h-[580px]">
          <div className="h-full">
            <div
              className="absolute left-1/2 top-1/2 -z-10 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
              aria-hidden
              style={{
                background:
                  'radial-gradient(circle, rgba(75,70,229,0.12), transparent 65%)',
              }}
            />
            <Scene3D />
            <p className="absolute bottom-1 right-1 font-mono text-[10px] tracking-[0.2em] text-fog/60">
              {'// it follows you'}
            </p>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        className="hero-cue pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        aria-hidden
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-fog">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-lime"
        >
          <ArrowDown size={13} />
        </motion.span>
      </div>
    </section>
  )
}
