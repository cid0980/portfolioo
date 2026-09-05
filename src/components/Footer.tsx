import { ArrowUp, Asterisk } from 'lucide-react'
import GlitchName from './GlitchName'

const PHRASES = [
  "Let's build something",
  'Open to any software work',
  'Ship it with intent',
]

function BigMarquee() {
  const row = [...PHRASES, ...PHRASES]
  return (
    <div
      aria-hidden
      className="marquee-pause overflow-hidden border-t border-cream/[0.08] py-8"
    >
      <div className="animate-marquee flex w-max items-center gap-8 [animation-duration:38s]">
        {row.map((phrase, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className={`whitespace-nowrap font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl lg:text-7xl ${
                i % 2 === 0 ? 'text-cream' : 'text-stroke'
              }`}
            >
              {phrase}
            </span>
            <Asterisk className="size-8 shrink-0 text-lime" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Footer({
  onNavigate,
}: {
  onNavigate: (id: string) => void
}) {
  return (
    <footer>
      <BigMarquee />
      <div className="container-x flex flex-col items-center justify-between gap-6 border-t border-cream/[0.08] py-10 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="font-display text-base font-semibold tracking-tight text-cream">
            <GlitchName />
            <span className="text-lime">/</span>dev
          </p>
          <p className="text-sm text-fog">
            © {new Date().getFullYear()} A. Sheik Asen — Software Developer
          </p>
        </div>

        <p className="font-mono text-[11px] tracking-[0.14em] text-fog/70">
          PUDUCHERRY, IN — REACT · THREE.JS · GSAP · TAILWIND
        </p>

        <button
          onClick={() => onNavigate('#top')}
          className="icon-btn"
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  )
}
