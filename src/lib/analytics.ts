import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, VISITS } from './firebase'

/**
 * Logs a single visit to Firestore.
 *
 * Runs silently in the background — it never blocks rendering and
 * never throws into the UI. One document per browser session, so a
 * refresh or an internal scroll does not inflate the count.
 */

type IpInfo = {
  ip?: string
  city?: string
  region?: string
  country?: string
  org?: string
}

async function lookupIp(): Promise<IpInfo> {
  /* primary: ipapi.co — returns IP + rough geo in one call */
  try {
    const res = await fetch('https://ipapi.co/json/')
    if (res.ok) {
      const d = await res.json()
      if (d && !d.error) {
        return {
          ip: d.ip,
          city: d.city,
          region: d.region,
          country: d.country_name,
          org: d.org,
        }
      }
    }
  } catch {
    /* fall through */
  }

  /* fallback: ipify — IP only */
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    if (res.ok) {
      const d = await res.json()
      return { ip: d.ip }
    }
  } catch {
    /* give up — still log the visit without an IP */
  }

  return {}
}

/** rough device class from the user agent */
function deviceType(ua: string) {
  if (/iPad|Tablet/i.test(ua)) return 'tablet'
  if (/Mobi|Android|iPhone/i.test(ua)) return 'mobile'
  return 'desktop'
}

function browserName(ua: string) {
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/OPR\/|Opera/i.test(ua)) return 'Opera'
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome'
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return 'Safari'
  if (/Firefox\//i.test(ua)) return 'Firefox'
  return 'Other'
}

function osName(ua: string) {
  if (/Windows/i.test(ua)) return 'Windows'
  if (/Android/i.test(ua)) return 'Android'
  if (/iPhone|iPad|iOS/i.test(ua)) return 'iOS'
  if (/Mac OS X/i.test(ua)) return 'macOS'
  if (/Linux/i.test(ua)) return 'Linux'
  return 'Other'
}

const SESSION_KEY = 'v_logged'

export async function logVisit() {
  if (!db) return
  if (typeof window === 'undefined') return

  /* one visit per session — refreshes don't inflate the number */
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* private mode with no sessionStorage — still log once per load */
  }

  try {
    const ua = navigator.userAgent
    const info = await lookupIp()

    await addDoc(collection(db, VISITS), {
      ...info,
      ts: serverTimestamp(),
      t: Date.now(),
      path: window.location.pathname + window.location.hash,
      referrer: document.referrer || 'direct',
      language: navigator.language || '',
      device: deviceType(ua),
      browser: browserName(ua),
      os: osName(ua),
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      ua,
    })
  } catch {
    /* analytics must never surface an error to the visitor */
  }
}
