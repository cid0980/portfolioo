import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Rocket } from 'lucide-react'
import { Reveal, SectionHead, stagger, staggerItem } from './motion'

const TERMINAL_LINES = [
  { prompt: '$ whoami', result: 'sheik_asen — software developer' },
  { prompt: '$ cat education.txt', result: 'bca · graduated · puducherry, in' },
  {
    prompt: '$ cat focus.txt',
    result: 'mobile · backend · real-time systems · ml',
  },
  { prompt: '$ echo $STATUS', result: 'open_to_any_software_work: true' },
]

const TIMELINE = [
  {
    icon: GraduationCap,
    title: 'BCA — Bachelor of Computer Applications',
    sub: 'Graduated with strong computer science fundamentals.',
  },
  {
    icon: Briefcase,
    title: 'Flutter Developer — Internship',
    sub: 'Shipped ComicVerse, a production-grade e-commerce mobile app.',
  },
  {
    icon: Rocket,
    title: 'Independent Builder',
    sub: '6+ self-driven projects across mobile, web, backend and ML.',
  },
]

const VALUES = ['Clean architecture', 'Usable, honest UI', 'Ship, then improve']

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHead
          label="01 / About"
          title="Software, built with intent."
          description="Not a tutor-marked exercise — real products, real users, real constraints."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* terminal card */}
          <Reveal className="lg:col-span-5" delay={0.05}>
            <div className="overflow-hidden rounded-2xl border border-cream/[0.08] bg-[#17171d] shadow-[0_36px_80px_-40px_rgba(75,70,229,0.4)]">
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-[#a3a8ff]/80" />
                <span className="ml-3 font-mono text-[11px] text-white/40">
                  asen@dev: ~
                </span>
              </div>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                className="space-y-4 px-5 py-6 font-mono text-[13px] leading-relaxed sm:px-6 sm:text-sm"
              >
                {TERMINAL_LINES.map((line) => (
                  <motion.div key={line.prompt} variants={staggerItem}>
                    <p className="text-[#a3a8ff]">{line.prompt}</p>
                    <p className="mt-1 text-white/65">
                      <span className="mr-2 text-white/25">→</span>
                      {line.result}
                    </p>
                  </motion.div>
                ))}
                <motion.div variants={staggerItem} className="flex items-center gap-1.5 pt-1">
                  <span className="text-[#a3a8ff]">$</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="inline-block h-4 w-2 bg-[#a3a8ff]"
                    aria-hidden
                  />
                </motion.div>
              </motion.div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {VALUES.map((v) => (
                <span key={v} className="chip">
                  {v}
                </span>
              ))}
            </div>
          </Reveal>

          {/* copy + timeline */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-cream/90">
                I&apos;m a{' '}
                <span className="text-lime">BCA graduate</span> and software
                developer from Puducherry, India. My experience is hands-on:
                during my internship I built a production Flutter e-commerce
                app, and outside of it I&apos;ve designed and shipped
                attendance systems, chat apps, delivery platforms, a game, and
                an ML model.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-2xl leading-relaxed text-fog">
                I work across the whole shape of a product — mobile interfaces,
                APIs, databases and real-time data — and I care about the same
                things everywhere: clean structure, honest UX, and software
                that solves the problem it claims to solve.
              </p>
            </Reveal>

            <div className="mt-10 space-y-3.5">
              {TIMELINE.map((item, i) => (
                <Reveal key={item.title} delay={0.08 * i}>
                  <div className="group flex items-start gap-4 rounded-xl border border-cream/10 bg-surface p-5 shadow-[0_2px_20px_-14px_rgba(23,23,29,0.15)] transition-colors duration-300 hover:border-lime/40">
                    <span className="icon-tile transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                      <item.icon size={18} />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-cream sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-fog">
                        {item.sub}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
