import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from 'lucide-react'
import { Magnetic, Reveal, SectionHead } from './motion'
import { GitHubIcon } from './icons'

const EMAIL = 'asencid07@gmail.com'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section
      id="contact"
      className="relative border-t border-cream/[0.08] py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(48rem 30rem at 12% 30%, rgba(75,70,229,0.05), transparent 60%)',
        }}
      />
      <div className="container-x relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        {/* left */}
        <div>
          <SectionHead
            label="04 / Contact"
            title="Let's build something worth shipping."
            description="I'm open to software development roles, internships and freelance projects — in any domain, on any stack. If it involves software, I want to hear about it."
          />

          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Magnetic>
                <a href={`mailto:${EMAIL}`} className="btn-accent">
                  Say hello
                  <Mail size={15} />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="https://github.com/cid0980"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                >
                  GitHub
                  <GitHubIcon size={15} />
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-cream/10 bg-surface px-4 py-2 shadow-[0_2px_16px_-10px_rgba(23,23,29,0.15)]">
              <span className="pulse-dot" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
                Available now · IST (UTC+5:30)
              </span>
            </div>
          </Reveal>
        </div>

        {/* right — contact rows */}
        <div className="flex flex-col justify-center gap-3">
          <Reveal delay={0.1}>
            <div className="group flex items-center gap-4 rounded-xl border border-cream/10 bg-surface px-5 py-4 shadow-[0_2px_20px_-14px_rgba(23,23,29,0.15)] transition-colors duration-300 hover:border-lime/40">
              <span className="icon-tile">
                <Mail size={17} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  Email
                </p>
                <p className="truncate font-display text-base text-cream sm:text-lg">
                  {EMAIL}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={copyEmail}
                  className="icon-btn !size-9"
                  aria-label={copied ? 'Email copied' : 'Copy email address'}
                >
                  {copied ? (
                    <Check size={15} className="text-lime" />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
                <a
                  href={`mailto:${EMAIL}`}
                  className="icon-btn !size-9"
                  aria-label="Open mail app"
                >
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <a
              href="tel:+919952703183"
              className="group flex items-center gap-4 rounded-xl border border-cream/10 bg-surface px-5 py-4 shadow-[0_2px_20px_-14px_rgba(23,23,29,0.15)] transition-colors duration-300 hover:border-lime/40"
            >
              <span className="icon-tile">
                <Phone size={17} />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  Phone
                </p>
                <p className="font-display text-base text-cream sm:text-lg">
                  +91 99527 03183
                </p>
              </div>
              <ArrowUpRight
                className="ml-auto size-4.5 text-fog transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                aria-hidden
              />
            </a>
          </Reveal>

          <Reveal delay={0.22}>
            <a
              href="https://github.com/cid0980"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-cream/10 bg-surface px-5 py-4 shadow-[0_2px_20px_-14px_rgba(23,23,29,0.15)] transition-colors duration-300 hover:border-lime/40"
            >
              <span className="icon-tile">
                <GitHubIcon size={17} />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  GitHub
                </p>
                <p className="font-display text-base text-cream sm:text-lg">
                  github.com/cid0980
                </p>
              </div>
              <ArrowUpRight
                className="ml-auto size-4.5 text-fog transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                aria-hidden
              />
            </a>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="flex items-center gap-4 rounded-xl border border-cream/10 bg-surface px-5 py-4 shadow-[0_2px_20px_-14px_rgba(23,23,29,0.15)]">
              <span className="icon-tile">
                <MapPin size={17} />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  Location
                </p>
                <p className="font-display text-base text-cream sm:text-lg">
                  Villianur, Puducherry, India
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
