import { LogOut, Ticket } from 'lucide-react'
import Modal from './Modal'
import { useApp } from '../store/AppContext'
import { formatRub } from '../data/airports'

export default function AccountModal() {
  const { modal, closeModal, user, logout } = useApp()
  const open = modal === 'account'
  if (!open || !user) return null

  const bookings = user.bookings || []

  return (
    <Modal open={open} onClose={closeModal} title="Личный кабинет" maxWidth="max-w-[620px]">
      {/* profile */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-lg font-semibold text-black">
            {(user.name || user.email)[0].toUpperCase()}
          </span>
          <div>
            <div className="font-medium">
              {[user.lastName, user.firstName, user.middleName].filter(Boolean).join(' ') || user.name || 'Гость'}
            </div>
            <div className="text-sm text-white/45">
              {user.email}
              {user.age ? ` · ${user.age} лет` : ''}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            logout()
            closeModal()
          }}
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          <LogOut size={14} /> Выйти
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
          Мои заказы
        </span>
        <span className="text-xs text-white/40">{bookings.length}</span>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/12 py-12 text-center">
          <Ticket className="text-white/30" size={26} />
          <p className="text-sm text-white/45">
            Заказов пока нет.<br />Выберите направление и оформите первый рейс.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div>
                <div className="flex items-center gap-2 text-lg font-medium tracking-[-0.4px]">
                  {b.fromCode} <span className="text-white/30">{b.round ? '⇄' : '→'}</span> {b.toCode}
                </div>
                <div className="mt-0.5 text-xs text-white/45">
                  {b.fromCity} — {b.toCity} · {b.classLabel} · {b.pax} пасс.
                  {b.date ? ` · ${b.date}` : ''}
                  {b.returnDate ? ` ⇄ ${b.returnDate}` : ''}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.1em] text-white/35">
                  Бронь {b.id}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatRub(b.price)}</div>
                <span className="mt-1 inline-block rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
                  {b.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
