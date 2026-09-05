import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import GlitchName from './GlitchName'

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const controls = animate(0, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setProgress(Math.round(v)),
      onComplete: () => setTimeout(onDone, 280),
    })
    return () => {
      controls.stop()
      document.body.style.overflow = ''
    }
  }, [onDone])

  return (
    <motion.div
      exit={{ y: '-100%' }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
    >
      <p className="font-display text-lg font-semibold tracking-tight text-cream">
        <GlitchName />
        <span className="text-lime">/</span>dev
      </p>

      <div className="mt-6 flex items-baseline gap-1 font-display text-7xl font-bold tabular-nums tracking-tight text-cream sm:text-8xl">
        <NumberFlow value={progress} trend={1} />
        <span className="text-lime">%</span>
      </div>

      <div className="mt-7 h-px w-44 overflow-hidden rounded-full bg-cream/10">
        <div
          className="h-full w-full origin-left bg-lime transition-transform duration-100 ease-linear"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-fog">
        Compiling experience
      </p>
    </motion.div>
  )
}
