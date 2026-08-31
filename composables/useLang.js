import en from '@/locales/en.json'
import ua from '@/locales/ua.json'

const dictionaries = { en, ua }

const STORAGE_KEY = 'od_lang'
const DEFAULT_LANG = 'en'

function resolvePath(dict, key) {
  return key.split('.').reduce((node, part) => {
    if (node && typeof node === 'object' && part in node) return node[part]
    return undefined
  }, dict)
}

export function useLang() {
  // 'en' on the server and on first paint; the saved choice is applied on mount
  const lang = useState('od-lang', () => DEFAULT_LANG)
  // true while we don't know yet whether the language modal should appear
  const hasStoredChoice = useState('od-lang-stored', () => true)

  // t(key) returns strings as well as arrays/objects (ticker.items, faq.items, …).
  // Missing keys fall back to English, then to the key itself.
  function t(key) {
    const value = resolvePath(dictionaries[lang.value], key)
    if (value !== undefined) return value
    const fallback = resolvePath(dictionaries[DEFAULT_LANG], key)
    return fallback !== undefined ? fallback : key
  }

  function applyLang(code) {
    if (!(code in dictionaries)) return
    lang.value = code
    if (import.meta.client) {
      document.documentElement.lang = code
    }
  }

  // User-initiated choice: apply + persist (also closes the first-visit modal path)
  function setLang(code) {
    if (!(code in dictionaries)) return
    applyLang(code)
    hasStoredChoice.value = true
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, code)
      } catch {
        // storage unavailable (private mode) — language still switches for the session
      }
    }
  }

  // Called once on the client: restores the saved language and reports whether
  // the first-visit modal is needed (no stored choice yet).
  function init() {
    if (!import.meta.client) return
    let stored = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }
    if (stored && stored in dictionaries) {
      applyLang(stored)
      hasStoredChoice.value = true
    } else {
      hasStoredChoice.value = false
    }
  }

  return { lang, hasStoredChoice, t, setLang, init }
}
