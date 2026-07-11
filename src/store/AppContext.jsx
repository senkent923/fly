import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const USERS_KEY = 'aether_users'
const SESSION_KEY = 'aether_session'

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {}
  } catch {
    return {}
  }
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AppProvider({ children }) {
  const [users, setUsers] = useState(readUsers)
  const [email, setEmail] = useState(() => localStorage.getItem(SESSION_KEY) || null)

  // modal: null | 'auth' | 'account' | 'booking'
  const [modal, setModal] = useState(null)
  // draft passed into the booking flow: { fromCode, toCode, date, pax }
  const [bookingDraft, setBookingDraft] = useState(null)
  // privacy policy overlay (can appear over any modal)
  const [privacy, setPrivacy] = useState(false)
  // admin panel overlay (demo)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    writeUsers(users)
  }, [users])

  // open the admin panel via the #admin hash too
  useEffect(() => {
    const check = () => {
      if (window.location.hash === '#admin') setAdmin(true)
    }
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  useEffect(() => {
    if (email) localStorage.setItem(SESSION_KEY, email)
    else localStorage.removeItem(SESSION_KEY)
  }, [email])

  const user = email ? users[email] || null : null

  const register = useCallback(
    ({ email: e, password, lastName, firstName, middleName, age }) => {
      const key = e.trim().toLowerCase()
      const current = readUsers()
      if (current[key]) return { ok: false, error: 'Аккаунт с такой почтой уже существует' }
      const name = [lastName, firstName].filter(Boolean).join(' ')
      const next = {
        ...current,
        [key]: { email: key, password, lastName, firstName, middleName, age, name, passport: null, bookings: [] },
      }
      setUsers(next)
      setEmail(key)
      return { ok: true }
    },
    [],
  )

  // remember passport details on the profile for future prefill
  const savePassport = useCallback(
    (passport) => {
      if (!email) return
      setUsers((prev) => (prev[email] ? { ...prev, [email]: { ...prev[email], passport } } : prev))
    },
    [email],
  )

  const login = useCallback(({ email: e, password }) => {
    const key = e.trim().toLowerCase()
    const current = readUsers()
    const u = current[key]
    if (!u || u.password !== password) return { ok: false, error: 'Неверная почта или пароль' }
    setUsers(current)
    setEmail(key)
    return { ok: true }
  }, [])

  const logout = useCallback(() => setEmail(null), [])

  const addBooking = useCallback(
    (booking) => {
      if (!email) return
      setUsers((prev) => {
        const u = prev[email]
        if (!u) return prev
        return {
          ...prev,
          [email]: { ...u, bookings: [booking, ...(u.bookings || [])] },
        }
      })
    },
    [email],
  )

  const openAuth = useCallback(() => setModal('auth'), [])
  const openAccount = useCallback(() => setModal('account'), [])
  const closeModal = useCallback(() => setModal(null), [])
  const startBooking = useCallback((draft) => {
    setBookingDraft(draft)
    setModal('booking')
  }, [])
  const openPrivacy = useCallback(() => setPrivacy(true), [])
  const closePrivacy = useCallback(() => setPrivacy(false), [])
  const openAdmin = useCallback(() => setAdmin(true), [])
  const closeAdmin = useCallback(() => {
    setAdmin(false)
    if (window.location.hash === '#admin') history.replaceState(null, '', window.location.pathname)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      allUsers: users,
      modal,
      bookingDraft,
      privacy,
      admin,
      register,
      login,
      logout,
      addBooking,
      savePassport,
      openAuth,
      openAccount,
      closeModal,
      startBooking,
      openPrivacy,
      closePrivacy,
      openAdmin,
      closeAdmin,
    }),
    [user, users, modal, bookingDraft, privacy, admin, register, login, logout, addBooking, savePassport, openAuth, openAccount, closeModal, startBooking, openPrivacy, closePrivacy, openAdmin, closeAdmin],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
