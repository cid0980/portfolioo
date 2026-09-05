import { useRef, useState } from 'react'
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { Magnetic, Reveal, SectionHead } from './motion'
import { GitHubIcon, InstagramIcon, LinkedInIcon } from './icons'
import { EMAIL, GITHUB_URL, INSTAGRAM_URL, LINKEDIN_URL } from '../data/socials'

const CARD =
  'group flex items-center gap-4 rounded-xl border border-cream/10 bg-surface px-5 py-4 shadow-[0_2px_20px_-14px_rgba(23,23,29,0.15)] transition-colors duration-300 hover:border-lime/40'
const LABEL =
  'font-mono text-[10px] uppercase tracking-[0.22em] text-fog'
const VALUE = 'font-display text-base text-cream sm:text-lg'
const ARROW =
  'ml-auto size-4.5 text-fog transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable — no-op */
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
                  href={GITHUB_URL}
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

        <div className="flex flex-col justify-center gap-3">
          <Reveal delay={0.1}>
            <div className={CARD}>
              <span className="icon-tile">
                <Mail size={17} />
              </span>
              <div className="min-w-0">
                <p className={LABEL}>Email</p>
                <p className={`truncate ${VALUE}`}>{EMAIL}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={copy}
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
            <a href="tel:+919952703183" className={CARD}>
              <span className="icon-tile">
                <Phone size={17} />
              </span>
              <div>
                <p className={LABEL}>Phone</p>
                <p className={VALUE}>+91 99527 03183</p>
              </div>
              <ArrowUpRight className={ARROW} aria-hidden />
            </a>
          </Reveal>

          <Reveal delay={0.22}>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={CARD}
            >
              <span className="icon-tile">
                <GitHubIcon size={17} />
              </span>
              <div>
                <p className={LABEL}>GitHub</p>
                <p className={VALUE}>github.com/cid0980</p>
              </div>
              <ArrowUpRight className={ARROW} aria-hidden />
            </a>
          </Reveal>

          <Reveal delay={0.26}>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className={CARD}
            >
              <span className="icon-tile">
                <LinkedInIcon size={17} />
              </span>
              <div>
                <p className={LABEL}>LinkedIn</p>
                <p className={VALUE}>in/sheik-asen</p>
              </div>
              <ArrowUpRight className={ARROW} aria-hidden />
            </a>
          </Reveal>

          <Reveal delay={0.3}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className={CARD}
            >
              <span className="icon-tile">
                <InstagramIcon size={17} />
              </span>
              <div>
                <p className={LABEL}>Instagram</p>
                <p className={VALUE}>@_kagenou____</p>
              </div>
              <ArrowUpRight className={ARROW} aria-hidden />
            </a>
          </Reveal>

          <Reveal delay={0.34}>
            <div className={`${CARD} hover:border-cream/10`}>
              <span className="icon-tile">
                <MapPin size={17} />
              </span>
              <div>
                <p className={LABEL}>Location</p>
                <p className={VALUE}>Villianur, Puducherry, India</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
