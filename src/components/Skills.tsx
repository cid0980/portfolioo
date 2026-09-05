import { useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type Variants,
} from 'framer-motion'
import {
  Braces,
  BrainCircuit,
  Database,
  Server,
  Smartphone,
  Wrench,
} from 'lucide-react'
import { SectionHead } from './motion'

const SKILLS = [
  {
    icon: Braces,
    title: 'Languages',
    items: ['Dart', 'Python', 'JavaScript / TypeScript', 'HTML5', 'CSS3'],
  },
  {
    icon: Smartphone,
    title: 'Mobile',
    items: ['Flutter', 'Firebase', 'Responsive UI'],
  },
  {
    icon: Server,
    title: 'Backend',
    items: ['Node.js', 'Express', 'REST APIs', 'JWT Auth'],
  },
  {
    icon: Database,
    title: 'Databases',
    items: ['MongoDB', 'MySQL', 'SQLite'],
  },
  {
    icon: BrainCircuit,
    title: 'AI & Machine Learning',
    items: ['Python', 'Prediction Models', 'Data Analysis'],
  },
  {
    icon: Wrench,
    title: 'Tools & Workflow',
    items: ['Git', 'GitHub', 'VS Code', 'Linux'],
  },
]

/* ---------- entrance choreography ---------- */
const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const card: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 130, damping: 16, mass: 0.7 },
  },
}

const chips: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.18 } },
}

const chip: Variants = {
  hidden: { opacity: 0, scale: 0.45, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 420, damping: 18 },
  },
}

/* ---------- single skill card ---------- */
function SkillCard({
  skill,
  index,
}: {
  skill: (typeof SKILLS)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(-300)
  const my = useMotionValue(-300)
  const sx = useSpring(mx, { stiffness: 380, damping: 38, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 380, damping: 38, mass: 0.4 })
  const spotlight = useMotionTemplate`radial-gradient(230px circle at ${sx}px ${sy}px, rgba(75,70,229,0.11), transparent 70%)`

  return (
    <motion.div
      ref={ref}
      variants={card}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
      }}
      onMouseLeave={() => {
        mx.set(-300)
        my.set(-300)
      }}
      whileHover={{ y: -5 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-cream/10 bg-surface p-6 shadow-[0_2px_20px_-14px_rgba(23,23,29,0.14)] transition-colors duration-300 hover:border-lime/40 hover:shadow-[0_26px_50px_-24px_rgba(75,70,229,0.3)]"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-lime/[0.07] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <div className="relative">
        <div className="flex items-center gap-3.5">
          <motion.span
            whileHover={{ rotate: -10, scale: 1.12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 12 }}
            className="icon-tile"
          >
            <skill.icon size={18} />
          </motion.span>
          <h3 className="font-display text-lg font-semibold text-cream">
            {skill.title}
          </h3>
          <span className="ml-auto font-mono text-[11px] text-fog/50 transition-colors duration-300 group-hover:text-lime">
            0{index + 1}
          </span>
        </div>
        <motion.div variants={chips} className="mt-5 flex flex-wrap gap-2">
          {skill.items.map((item) => (
            <motion.span key={item} variants={chip} className="chip">
              {item}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(40rem 26rem at 88% 20%, rgba(75,70,229,0.05), transparent 60%)',
        }}
      />
      <div className="container-x relative">
        <SectionHead
          label="03 / Skills"
          title="The toolbox — never the limit."
          description="What I reach for day to day. Every project above taught me something new, and the next one will too."
        />
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        >
          {SKILLS.map((s, i) => (
            <SkillCard key={s.title} skill={s} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
