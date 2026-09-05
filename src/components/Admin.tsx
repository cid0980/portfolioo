import { useEffect, useMemo, useState } from 'react'
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  Globe,
  LogOut,
  RefreshCw,
  Users,
  Eye,
  CalendarDays,
  Lock,
} from 'lucide-react'
import { auth, db, isFirebaseConfigured, VISITS } from '../lib/firebase'

type Visit = {
  id: string
  ip?: string
  city?: string
  region?: string
  country?: string
  org?: string
  t?: number
  path?: string
  referrer?: string
  device?: string
  browser?: string
  os?: string
  screen?: string
  timezone?: string
  language?: string
}

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-2xl border border-cream/10 bg-surface p-5 shadow-[0_2px_20px_-14px_rgba(23,23,29,0.15)]">
      <div className="flex items-center gap-3">
        <span className="icon-tile">
          <Icon size={17} />
        </span>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
          {label}
        </p>
      </div>
      <p className="mt-4 font-display text-4xl font-semibold tabular-nums tracking-tight text-cream">
        {value}
      </p>
    </div>
  )
}

/* ---------- shown when .env.local hasn't been filled in yet ---------- */
function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-cream/10 bg-surface p-8">
      <h1 className="font-display text-2xl font-semibold text-cream">
        Analytics not configured
      </h1>
      <p className="mt-3 leading-relaxed text-fog">
        Create a <code className="text-lime">.env.local</code> file in the
        project root with your Firebase web-app config, then rebuild:
      </p>
      <pre className="mt-5 overflow-x-auto rounded-xl bg-[#17171d] p-5 font-mono text-[12px] leading-relaxed text-white/75">
{`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}
      </pre>
      <p className="mt-5 text-sm leading-relaxed text-fog">
        Until then the portfolio works normally — visits simply aren&apos;t
        recorded.
      </p>
    </div>
  )
}

/* ---------- email + password gate (real Firebase Auth) ---------- */
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return
    setBusy(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch {
      setError('Incorrect email or password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-sm rounded-2xl border border-cream/10 bg-surface p-8 shadow-[0_2px_24px_-14px_rgba(23,23,29,0.18)]"
    >
      <span className="icon-tile">
        <Lock size={17} />
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-cream">
        Admin access
      </h1>
      <p className="mt-2 text-sm text-fog">Sign in to view visitor analytics.</p>

      <label className="mt-6 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
          Email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-cream/15 bg-ink px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-lime"
        />
      </label>

      <label className="mt-4 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
          Password
        </span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-cream/15 bg-ink px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-lime"
        />
      </label>

      {error && <p className="mt-4 text-sm text-[#d5342f]">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="btn-accent mt-6 w-full disabled:opacity-60"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

/* ---------- the dashboard ---------- */
function Dashboard({ user }: { user: User }) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    if (!db) return
    setLoading(true)
    setError('')
    try {
      const snap = await getDocs(
        query(collection(db, VISITS), orderBy('t', 'desc'), limit(500)),
      )
      setVisits(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Visit))
    } catch {
      setError(
        'Could not read visits. Check your Firestore security rules allow reads for signed-in users.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = useMemo(() => {
    const today = startOfDay(new Date())
    const uniqueIps = new Set(visits.map((v) => v.ip).filter(Boolean))
    const todayCount = visits.filter((v) => (v.t ?? 0) >= today).length

    /* last 7 days, oldest → newest */
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const from = startOfDay(d)
      const to = from + 86400000
      return {
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        count: visits.filter((v) => (v.t ?? 0) >= from && (v.t ?? 0) < to)
          .length,
      }
    })

    const tally = (key: keyof Visit) => {
      const m = new Map<string, number>()
      visits.forEach((v) => {
        const k = (v[key] as string) || 'unknown'
        m.set(k, (m.get(k) ?? 0) + 1)
      })
      return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    }

    return {
      total: visits.length,
      unique: uniqueIps.size,
      today: todayCount,
      days,
      countries: tally('country'),
      referrers: tally('referrer'),
    }
  }, [visits])

  const peak = Math.max(1, ...stats.days.map((d) => d.count))

  return (
    <div className="container-x py-10">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mono-label">Analytics</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
            Visitor dashboard
          </h1>
          <p className="mt-1 text-sm text-fog">{user.email}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={load} className="icon-btn" aria-label="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => auth && signOut(auth)}
            className="btn-ghost !py-2.5"
          >
            Sign out
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-[#d5342f]/30 bg-[#d5342f]/5 p-4 text-sm text-[#d5342f]">
          {error}
        </p>
      )}

      {/* stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={Eye} label="Total visits" value={stats.total} />
        <Stat icon={Users} label="Unique IPs" value={stats.unique} />
        <Stat icon={CalendarDays} label="Today" value={stats.today} />
      </div>

      {/* last 7 days */}
      <div className="mt-4 rounded-2xl border border-cream/10 bg-surface p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
          Last 7 days
        </p>
        <div className="mt-6 flex h-40 items-end gap-3">
          {stats.days.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="font-mono text-[11px] tabular-nums text-cream">
                {d.count}
              </span>
              <div
                className="w-full rounded-t-md bg-lime/85 transition-all"
                style={{ height: `${(d.count / peak) * 100}%`, minHeight: 4 }}
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-fog">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* breakdowns */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          { title: 'Top countries', rows: stats.countries, icon: Globe },
          { title: 'Top referrers', rows: stats.referrers, icon: Globe },
        ].map((block) => (
          <div
            key={block.title}
            className="rounded-2xl border border-cream/10 bg-surface p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
              {block.title}
            </p>
            <div className="mt-4 space-y-2.5">
              {block.rows.length === 0 && (
                <p className="text-sm text-fog">No data yet.</p>
              )}
              {block.rows.map(([name, count]) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="truncate text-cream">{name}</span>
                  <span className="font-mono tabular-nums text-fog">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* recent visits table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-cream/10 bg-surface">
        <p className="border-b border-cream/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
          Recent visits
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-cream/10 font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
                <th className="px-6 py-3 font-normal">When</th>
                <th className="px-6 py-3 font-normal">IP</th>
                <th className="px-6 py-3 font-normal">Location</th>
                <th className="px-6 py-3 font-normal">Device</th>
                <th className="px-6 py-3 font-normal">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-fog">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && visits.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-fog">
                    No visits recorded yet.
                  </td>
                </tr>
              )}
              {visits.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-cream/[0.06] last:border-0"
                >
                  <td className="whitespace-nowrap px-6 py-3.5 text-fog">
                    {v.t ? new Date(v.t).toLocaleString() : '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 font-mono text-[12px] text-cream">
                    {v.ip || '—'}
                  </td>
                  <td className="px-6 py-3.5 text-fog">
                    {[v.city, v.country].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-fog">
                    {[v.device, v.os, v.browser].filter(Boolean).join(' · ') ||
                      '—'}
                  </td>
                  <td className="max-w-[240px] truncate px-6 py-3.5 text-fog">
                    {v.referrer || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-6 text-center font-mono text-[11px] text-fog/70">
        Showing the most recent {visits.length} of up to 500 records.
      </p>
    </div>
  )
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!auth) {
      setChecking(false)
      return
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setChecking(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-ink font-body text-cream antialiased">
      <div className="flex min-h-screen flex-col justify-center py-12">
        {!isFirebaseConfigured ? (
          <SetupNotice />
        ) : checking ? (
          <p className="text-center font-mono text-sm text-fog">Loading…</p>
        ) : user ? (
          <Dashboard user={user} />
        ) : (
          <Login />
        )}
      </div>
    </div>
  )
}
