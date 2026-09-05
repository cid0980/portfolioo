import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Asterisk } from 'lucide-react'

const WORDS: { text: string; accent?: boolean }[] = [
  { text: 'The' },
  { text: 'stack' },
  { text: 'is' },
  { text: 'a' },
  { text: 'tool' },
  { text: '—' },
  { text: 'never' },
  { text: 'a' },
  { text: 'boundary.' },
  { text: "I'm" },
  { text: 'open' },
  { text: 'to' },
  { text: 'any', accent: true },
  { text: 'kind', accent: true },
  { text: 'of', accent: true },
  { text: 'software', accent: true },
  { text: 'work:' },
  { text: 'mobile,' },
  { text: 'web,' },
  { text: 'backend,' },
  { text: 'or' },
  { text: 'ML.' },
  { text: 'If' },
  { text: 'it' },
  { text: 'needs' },
  { text: 'to' },
  { text: 'exist,' },
  { text: "I'll", accent: true },
  { text: 'learn', accent: true },
  { text: 'it,', accent: true },
  { text: 'build', accent: true },
  { text: 'it,', accent: true },
  { text: 'and', accent: true },
  { text: 'ship', accent: true },
  { text: 'it.', accent: true },
]

function Word({
  children,
  accent,
  progress,
  range,
}: {
  children: string
  accent?: boolean
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.13, 1])
  return (
    <motion.span
      style={{ opacity }}
      className={accent ? 'text-lime' : undefined}
    >
      {children}{' '}
    </motion.span>
  )
}

export default function Statement() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.45'],
  })

  return (
    <section className="relative py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(46rem 28rem at 50% 50%, rgba(75,70,229,0.06), transparent 65%)',
        }}
      />
      <div className="container-x relative">
        <div className="mb-10 flex items-center justify-center gap-3">
          <Asterisk className="size-4 text-lime" aria-hidden />
          <p className="mono-label">{'// mindset'}</p>
          <Asterisk className="size-4 text-lime" aria-hidden />
        </div>

        <p
          ref={ref}
          className="mx-auto max-w-4xl text-center font-display text-3xl font-semibold leading-[1.25] tracking-tight text-cream sm:text-5xl sm:leading-[1.2]"
        >
          {WORDS.map((word, i) => (
            <Word
              key={i}
              accent={word.accent}
              progress={scrollYProgress}
              range={[i / WORDS.length, Math.min(1, (i + 1.5) / WORDS.length)]}
            >
              {word.text}
            </Word>
          ))}
        </p>
      </div>
    </section>
  )
}
