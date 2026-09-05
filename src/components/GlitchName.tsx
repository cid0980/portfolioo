import { useEffect, useState } from 'react'

const PRIMARY = 'asen'
const ALIAS = 'cid'
const CYCLE = 15000 // every 15s
const FIRST_RUN = 5000 // first flick shortly after load

/**
 * Wordmark that glitch-flicks from "asen" to "cid" for a beat,
 * then snaps back. Sized to the longest string so nothing shifts.
 */
export default function GlitchName() {
  const [text, setText] = useState(PRIMARY)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const pending: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) => pending.push(setTimeout(fn, ms))

    const run = () => {
      at(0, () => setActive(true)) // tear in
      at(170, () => setText(ALIAS)) // swap identity
      at(430, () => setActive(false)) // settle as "cid"
      at(1150, () => setActive(true)) // tear out
      at(1310, () => setText(PRIMARY)) // back to "asen"
      at(1570, () => setActive(false))
    }

    const first = setTimeout(run, FIRST_RUN)
    const loop = setInterval(run, CYCLE)

    return () => {
      clearTimeout(first)
      clearInterval(loop)
      pending.forEach(clearTimeout)
    }
  }, [])

  return (
    <span className="relative inline-block align-baseline">
      {/* invisible sizer keeps the layout perfectly stable */}
      <span aria-hidden className="invisible">
        {PRIMARY}
      </span>
      <span
        className="glitch absolute inset-0"
        data-text={text}
        data-active={active}
      >
        {text}
      </span>
    </span>
  )
}
