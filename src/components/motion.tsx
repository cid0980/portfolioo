import { useEffect, useRef, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  type Variants,
} from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ---------- scroll reveal wrapper ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- GSAP word-roll heading ---------- */
function RollTitle({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.roll-word',
        { yPercent: 120, rotate: 5 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.05,
          ease: 'power4.out',
          stagger: 0.055,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 86%',
            once: true,
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [text])

  const words = text.split(' ')

  return (
    <h2 ref={ref} aria-label={text} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top"
        >
          <span className="roll-word inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </h2>
  )
}

/* ---------- section heading ---------- */
export function SectionHead({
  label,
  title,
  description,
}: {
  label: string
  title: string
  description?: string
}) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <p className="mono-label flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-lime/60" aria-hidden />
          {label}
        </p>
      </Reveal>
      <RollTitle
        text={title}
        className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream sm:text-5xl"
      />
      {description && (
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fog">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}

/* ---------- magnetic hover wrapper ---------- */
export function Magnetic({
  children,
  strength = 0.22,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.35 })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- stagger helpers ---------- */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}
