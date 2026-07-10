import { useMemo, useState } from 'react'
import { Plane, Check, Mail, Lock } from 'lucide-react'
import Modal from './Modal'
import { useApp } from '../store/AppContext'
import {
  findAirport,
  distanceKm,
  flightDuration,
  priceFor,
  formatRub,
  CLASSES,
} from '../data/airports'

export default function BookingModal() {
  const { modal, closeModal, bookingDraft, isAuthed, user, login, register, addBooking } = useApp()
  const open = modal === 'booking'

  const [step, setStep] = useState('fares')
  const [classId, setClassId] = useState('business')
  const [order, setOrder] = useState(null)

  const from = findAirport(bookingDraft?.fromCode)
  const to = findAirport(bookingDraft?.toCode)
  const pax = bookingDraft?.pax || 1
  const date = bookingDraft?.date
  const round = !!bookingDraft?.round
  const returnDate = bookingDraft?.returnDate

  const km = useMemo(() => Math.round(distanceKm(from, to)), [from, to])
  const dur = useMemo(() => flightDuration(km), [km])

  if (!open || !from || !to) return null

  const reset = () => {
    setStep('fares')
    setOrder(null)
    setClassId('business')
    closeModal()
  }

  const goCheckout = (id) => {
    setClassId(id)
    setStep('checkout')
  }

  const onPaid = (email) => {
    const cls = CLASSES.find((c) => c.id === classId)
    const total = priceFor(km, classId, pax, round)
    const booking = {
      id: 'AE' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      fromCode: from.code,
      fromCity: from.city,
      toCode: to.code,
      toCity: to.city,
      date,
      returnDate: round ? returnDate : null,
      round,
      pax,
      classLabel: cls.label,
      price: total,
      email,
      status: 'Оплачено',
      createdAt: Date.now(),
    }
    if (isAuthed) addBooking(booking)
    setOrder(booking)
    setStep('success')
  }

  const title =
    step === 'success' ? 'Готово' : `${from.city} → ${to.city}`

  return (
    <Modal open={open} onClose={reset} title={title} maxWidth="max-w-[640px]">
      {/* route summary */}
      {step !== 'success' && (
        <RouteSummary from={from} to={to} dur={dur} km={km} date={date} returnDate={round ? returnDate : null} pax={pax} />
      )}

      {step === 'fares' && (
        <div className="mt-6 flex flex-col gap-3">
          {CLASSES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => goCheckout(c.id)}
              className="glow-card group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left transition-all hover:-translate-y-0.5 hover:bg-white/[0.04]"
            >
              <div>
                <div className="text-lg font-medium">{c.label}</div>
                <div className="text-xs text-white/45">
                  {c.id === 'economy' && 'Полноценное кресло, питание, багаж 30 кг'}
                  {c.id === 'business' && 'Лежачее место, лаунж, багаж 40 кг'}
                  {c.id === 'first' && 'Отдельная каюта, консьерж, багаж без лимита'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-medium tracking-[-0.5px] group-hover:text-[var(--accent)]">
                  {formatRub(priceFor(km, c.id, pax, round))}
                </div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-white/40">
                  {round ? 'туда-обратно · ' : ''}за {pax} {plural(pax)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 'checkout' && (
        <Checkout
          priceLabel={formatRub(priceFor(km, classId, pax, round))}
          classLabel={CLASSES.find((c) => c.id === classId).label}
          isAuthed={isAuthed}
          user={user}
          onBack={() => setStep('fares')}
          onLogin={login}
          onRegister={register}
          onPaid={onPaid}
        />
      )}

      {step === 'success' && order && <Success order={order} onClose={reset} />}
    </Modal>
  )
}

function RouteSummary({ from, to, dur, km, date, returnDate, pax }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center gap-4">
        <Endpoint code={from.code} city={from.city} />
        <div className="relative flex-1">
          <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/40 to-white/20" />
          <Plane
            size={15}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-[var(--accent)]"
          />
        </div>
        <Endpoint code={to.code} city={to.city} right />
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/50">
        <span>В пути ~{dur.label}</span>
        <span>{km.toLocaleString('ru-RU')} км</span>
        {date && <span>Вылет: {date}</span>}
        {returnDate ? (
          <span className="text-[var(--accent)]">Обратно: {returnDate}</span>
        ) : (
          <span>В одну сторону</span>
        )}
        <span>{pax} {plural(pax)}</span>
      </div>
    </div>
  )
}

function Endpoint({ code, city, right }) {
  return (
    <div className={`flex flex-col ${right ? 'text-right' : ''}`}>
      <span className="text-2xl font-medium leading-none tracking-[-0.5px]">{code}</span>
      <span className="mt-1 text-[11px] uppercase tracking-[0.1em] text-white/45">{city}</span>
    </div>
  )
}

function Checkout({ priceLabel, classLabel, isAuthed, user, onBack, onLogin, onRegister, onPaid }) {
  const [mode, setMode] = useState('login')
  const [auth, setAuth] = useState({ name: '', email: '', password: '' })
  const [authErr, setAuthErr] = useState('')
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', name: '' })

  const doAuth = (e) => {
    e.preventDefault()
    setAuthErr('')
    if (!auth.email || !auth.password) return setAuthErr('Заполните почту и пароль')
    const res = mode === 'login' ? onLogin(auth) : onRegister(auth)
    if (!res.ok) setAuthErr(res.error)
  }

  const pay = (e) => {
    e.preventDefault()
    onPaid(user?.email)
  }

  if (!isAuthed) {
    return (
      <div className="mt-6">
        <div className="mb-5 rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/[0.06] p-4 text-sm text-white/75">
          Войдите или создайте аккаунт — билет сохранится в личном кабинете, а
          посадочный талон придёт на вашу почту.
        </div>
        <div className="mb-5 flex rounded-full border border-white/10 p-1 text-sm">
          {[['login', 'Войти'], ['register', 'Регистрация']].map(([id, l]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`flex-1 rounded-full py-2 font-medium transition-colors ${
                mode === id ? 'bg-white text-black' : 'text-white/60'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <form onSubmit={doAuth} className="flex flex-col gap-3">
          {mode === 'register' && (
            <Input icon={null} placeholder="Имя" value={auth.name}
              onChange={(e) => setAuth({ ...auth, name: e.target.value })} />
          )}
          <Input icon={Mail} type="email" placeholder="Почта" value={auth.email}
            onChange={(e) => setAuth({ ...auth, email: e.target.value })} />
          <Input icon={Lock} type="password" placeholder="Пароль" value={auth.password}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })} />
          {authErr && <p className="text-sm text-[#ff9a9a]">{authErr}</p>}
          <button type="submit" className="fill-btn mt-1 rounded-full border border-white py-3 text-sm font-medium">
            Продолжить
          </button>
        </form>
        <button onClick={onBack} className="mt-4 text-xs text-white/45 hover:text-white">
          ← назад к тарифам
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={pay} className="mt-6 flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="text-sm">
          <div className="font-medium">{classLabel}</div>
          <div className="text-white/45">Пассажир: {user?.name || user?.email}</div>
        </div>
        <div className="text-2xl font-medium tracking-[-0.5px]">{priceLabel}</div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
          Оплата картой (демо)
        </span>
        <Input placeholder="0000 0000 0000 0000" inputMode="numeric" value={card.number}
          onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} maxLength={19} />
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="MM/YY" value={card.exp}
            onChange={(e) => setCard({ ...card, exp: formatExp(e.target.value) })} maxLength={5} />
          <Input placeholder="CVC" inputMode="numeric" value={card.cvc}
            onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })} maxLength={3} />
        </div>
        <Input placeholder="Имя на карте" value={card.name}
          onChange={(e) => setCard({ ...card, name: e.target.value })} />
      </div>

      <button type="submit" className="fill-btn rounded-full border border-white py-3.5 text-sm font-medium tracking-[0.02em]">
        Оплатить {priceLabel}
      </button>
      <button type="button" onClick={onBack} className="text-xs text-white/45 hover:text-white">
        ← назад к тарифам
      </button>
      <p className="text-center text-xs text-white/35">
        Демонстрация. Реальное списание не происходит.
      </p>
    </form>
  )
}

function Success({ order, onClose }) {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/15">
        <Check className="text-[var(--accent)]" size={30} />
      </div>
      <div>
        <h4 className="text-2xl font-medium tracking-[-0.5px]">Оплачено</h4>
        <p className="mt-2 text-sm text-white/60">
          Посадочный талон отправлен на <span className="text-white">{order.email}</span>
        </p>
      </div>
      <div className="w-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left text-sm">
        <Row k="Номер брони" v={order.id} />
        <Row k="Маршрут" v={`${order.fromCode} ${order.round ? '⇄' : '→'} ${order.toCode}`} />
        <Row k="Тип" v={order.round ? 'Туда-обратно' : 'В одну сторону'} />
        <Row k="Класс" v={order.classLabel} />
        <Row k="Пассажиров" v={order.pax} />
        {order.date && <Row k="Вылет" v={order.date} />}
        {order.returnDate && <Row k="Обратно" v={order.returnDate} />}
        <Row k="Сумма" v={formatRub(order.price)} last />
      </div>
      <button onClick={onClose} className="fill-btn w-full rounded-full border border-white py-3 text-sm font-medium">
        Отлично
      </button>
    </div>
  )
}

function Row({ k, v, last }) {
  return (
    <div className={`flex items-center justify-between py-2 ${last ? '' : 'border-b border-white/8'}`}>
      <span className="text-white/45">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  )
}

function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />}
      <input
        {...props}
        className={`w-full rounded-xl border border-white/12 bg-white/[0.03] py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--accent)] ${
          Icon ? 'pl-10 pr-4' : 'px-4'
        }`}
      />
    </div>
  )
}

function formatCard(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExp(v) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}
function plural(n) {
  const m = n % 10
  if (n >= 11 && n <= 14) return 'пассажиров'
  if (m === 1) return 'пассажир'
  if (m >= 2 && m <= 4) return 'пассажира'
  return 'пассажиров'
}
