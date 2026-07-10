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

  useEffect(() => {
    writeUsers(users)
  }, [users])

  useEffect(() => {
    if (email) localStorage.setItem(SESSION_KEY, email)
    else localStorage.removeItem(SESSION_KEY)
  }, [email])

  const user = email ? users[email] || null : null

  const register = useCallback(
    ({ email: e, password, name }) => {
      const key = e.trim().toLowerCase()
      const current = readUsers()
      if (current[key]) return { ok: false, error: 'Аккаунт с такой почтой уже существует' }
      const next = { ...current, [key]: { email: key, password, name: name || '', bookings: [] } }
      setUsers(next)
      setEmail(key)
      return { ok: true }
    },
    [],
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

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      modal,
      bookingDraft,
      register,
      login,
      logout,
      addBooking,
      openAuth,
      openAccount,
      closeModal,
      startBooking,
    }),
    [user, modal, bookingDraft, register, login, logout, addBooking, openAuth, openAccount, closeModal, startBooking],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
