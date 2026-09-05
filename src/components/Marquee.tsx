import { Asterisk } from 'lucide-react'

const LANE_ONE = [
  'Mobile Apps',
  'Backend APIs',
  'Real-time Systems',
  'Machine Learning',
  'Clean Architecture',
  'Open to New Stacks',
]

const LANE_TWO = [
  'Flutter',
  'Node.js',
  'Firebase',
  'MongoDB',
  'Python',
  'TypeScript',
  'Dart',
  'Express',
]

function Lane({
  items,
  reverse = false,
  className = '',
}: {
  items: string[]
  reverse?: boolean
  className?: string
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={`animate-marquee flex w-max items-center gap-10 py-1 ${
          reverse ? '[animation-direction:reverse] [animation-duration:46s]' : ''
        } ${className}`}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-fog">
              {item}
            </span>
            <Asterisk className="size-4 shrink-0 text-lime" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  return (
    <section
      aria-hidden
      className="marquee-pause space-y-1.5 border-y border-cream/[0.08] bg-surface/70 py-3"
    >
      <Lane items={LANE_ONE} />
      <Lane items={LANE_TWO} reverse className="opacity-60" />
    </section>
  )
}
