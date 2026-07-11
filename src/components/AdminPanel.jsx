import { useApp } from '../store/AppContext'
import { formatRub } from '../data/airports'
import { X } from 'lucide-react'

const dt = (ts) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts))

export default function AdminPanel() {
  const { admin, closeAdmin, allUsers } = useApp()
  if (!admin) return null

  const users = Object.values(allUsers || {})
  const orders = users
    .flatMap((u) => (u.bookings || []).map((b) => ({ ...b, user: u })))
    .sort((a, b) => b.createdAt - a.createdAt)
  const revenue = orders.reduce((s, o) => s + (o.price || 0), 0)

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#070709]">
      <div className="mx-auto max-w-[1340px] px-[15px] py-10 mobile:px-[18px]">
        {/* header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]">
              AETHER · Админ-панель
            </span>
            <h1 className="text-3xl font-medium tracking-[-0.8px]">Заявки и пользователи</h1>
          </div>
          <button
            type="button"
            onClick={closeAdmin}
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            <X size={15} /> Закрыть
          </button>
        </div>

        {/* stats */}
        <div className="mb-10 grid grid-cols-3 gap-6 mobile:grid-cols-1">
          <Stat label="Заявок" value={orders.length} />
          <Stat label="Пользователей" value={users.length} />
          <Stat label="Сумма заявок" value={formatRub(revenue)} />
        </div>

        {/* orders */}
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/45">Заявки на рейсы</h2>
        <div className="mb-12 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-[0.14em] text-white/40">
                {['Бронь', 'Пассажир', 'Почта', 'Паспорт', 'Маршрут', 'Дата', 'Класс', 'Сумма', 'Создано'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-white/40">
                    Заявок пока нет. Оформите бронирование на сайте — оно появится здесь.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id + o.user.email} className="border-b border-white/8 last:border-0">
                    <td className="px-4 py-3 font-mono text-white/60">{o.id}</td>
                    <td className="px-4 py-3">
                      {[o.user.lastName, o.user.firstName, o.user.middleName].filter(Boolean).join(' ') || o.user.name || '—'}
                      {o.user.age ? <span className="text-white/40"> · {o.user.age}</span> : null}
                    </td>
                    <td className="px-4 py-3 text-white/60">{o.user.email}</td>
                    <td className="px-4 py-3 font-mono text-white/60">{o.passport || '—'}</td>
                    <td className="px-4 py-3">
                      {o.fromCode} {o.round ? '⇄' : '→'} {o.toCode}
                    </td>
                    <td className="px-4 py-3 text-white/60">
                      {o.date}
                      {o.returnDate ? ` ⇄ ${o.returnDate}` : ''}
                    </td>
                    <td className="px-4 py-3 text-white/60">{o.classLabel}</td>
                    <td className="px-4 py-3 font-medium">{formatRub(o.price)}</td>
                    <td className="px-4 py-3 text-white/45">{dt(o.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* users */}
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/45">Пользователи</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-[0.14em] text-white/40">
                {['ФИО', 'Возраст', 'Почта', 'Паспорт', 'Заявок'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-white/40">Пользователей пока нет.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.email} className="border-b border-white/8 last:border-0">
                    <td className="px-4 py-3">{[u.lastName, u.firstName, u.middleName].filter(Boolean).join(' ') || u.name || '—'}</td>
                    <td className="px-4 py-3 text-white/60">{u.age || '—'}</td>
                    <td className="px-4 py-3 text-white/60">{u.email}</td>
                    <td className="px-4 py-3 font-mono text-white/60">{u.passport?.series || '—'}</td>
                    <td className="px-4 py-3 text-white/60">{(u.bookings || []).length}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-white/35">
          Демо: данные читаются из localStorage браузера. Никакой сервер не подключён.
        </p>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="text-3xl font-medium tracking-[-0.5px]">{value}</div>
      <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{label}</div>
    </div>
  )
}
