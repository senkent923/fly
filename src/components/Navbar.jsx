import { useEffect, useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import { useApp } from '../store/AppContext'

const NAV_ITEMS = [
  { n: '01', label: 'Маршруты', href: '#routes' },
  { n: '02', label: 'Каюты', href: '#cabins' },
  { n: '03', label: 'Журнал', href: '#journal' },
  { n: '04', label: 'Бронь', href: '#book' },
]

// Живые часы по московскому времени — домашний хаб авиакомпании.
function useHubClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Europe/Moscow',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Navbar() {
  const time = useHubClock()
  const { isAuthed, user, openAuth, openAccount } = useApp()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled || open
          ? 'border-b border-white/10 bg-black/70 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1340px] items-center justify-between px-[15px] transition-all duration-500 md-tablet:px-[18px] mobile:px-[18px] ${
          scrolled
            ? 'py-4 md-tablet:py-4 mobile:py-4'
            : 'py-9 md-tablet:py-[30px] mobile:py-6'
        }`}
      >
        {/* Wordmark */}
        <a
          href="#top"
          className="nav-link-underline text-xs font-semibold uppercase tracking-[0.28em]"
        >
          Aether
        </a>

        {/* Desktop nav */}
        <nav
          aria-label="Основная навигация"
          className="flex items-center gap-8 md-tablet:gap-4 mobile:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.n}
              href={item.href}
              className="nav-link-underline flex items-baseline gap-1"
            >
              <span className="text-[8px] font-medium uppercase leading-3 tracking-[-0.08px] opacity-60">
                {item.n}
              </span>
              <span className="text-xs font-medium uppercase leading-4 tracking-[-0.12px]">
                / {item.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Right cluster: contact + clock + account (desktop) */}
        <div className="flex items-center gap-5 mobile:hidden">
          <div className="flex flex-col items-end gap-0.5">
            <a
              href="mailto:concierge@flyaether.ru"
              className="nav-link-underline text-xs font-medium leading-4 tracking-[-0.12px]"
            >
              concierge@flyaether.ru
            </a>
            <span
              className="text-[8px] font-medium uppercase leading-3 tracking-[0.18em] opacity-60"
              aria-label={`Московское время ${time}`}
            >
              МСК {time}
            </span>
          </div>
          {isAuthed ? (
            <button
              type="button"
              onClick={openAccount}
              className="flex items-center gap-2 rounded-full border border-white/15 py-1.5 pl-1.5 pr-3.5 transition-colors hover:border-white/40"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-[11px] font-semibold text-black">
                {(user.name || user.email)[0].toUpperCase()}
              </span>
              <span className="max-w-[90px] truncate text-xs font-medium">
                {user.name || 'Кабинет'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openAuth}
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <User size={14} /> Войти
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[-0.12px] mobile:flex"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
          {open ? 'Закрыть' : 'Меню'}
        </button>
      </div>

      {/* Mobile panel — grid-rows trick for a smooth height transition */}
      <div
        className={`hidden overflow-hidden px-[18px] transition-[grid-template-rows] duration-[420ms] mobile:grid ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-spring)' }}
      >
        <div className="min-h-0 overflow-hidden">
          <nav aria-label="Мобильная навигация" className="flex flex-col gap-3 pb-8 pt-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.n}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-[28px] font-medium uppercase leading-8 tracking-[-0.84px]"
              >
                <span className="mr-2 align-super text-[10px] opacity-60">
                  {item.n}
                </span>
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                isAuthed ? openAccount() : openAuth()
              }}
              className="mt-2 flex w-fit items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium"
            >
              <User size={15} />
              {isAuthed ? user.name || 'Личный кабинет' : 'Войти / Регистрация'}
            </button>
            <div className="mt-4 flex flex-col gap-1 text-xs">
              <a href="mailto:concierge@flyaether.ru">concierge@flyaether.ru</a>
              <span className="opacity-60">МСК {time}</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
