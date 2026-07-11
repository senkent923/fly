import { useState } from 'react'
import { useApp } from '../store/AppContext'

const inputCls =
  'w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--accent)]'

/**
 * Shared login / registration form. Registration collects full name
 * (фамилия, имя, отчество), age and requires consent to data processing.
 * onSuccess fires after a successful auth.
 */
export default function AuthForm({ onSuccess }) {
  const { login, register, openPrivacy } = useApp()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    age: '',
    email: '',
    password: '',
  })
  const [consent, setConsent] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setErr('')
    if (mode === 'register') {
      if (!f.lastName || !f.firstName || !f.middleName)
        return setErr('Укажите фамилию, имя и отчество')
      const age = parseInt(f.age, 10)
      if (!age || age < 18 || age > 120) return setErr('Возраст должен быть от 18 лет')
      if (!f.email || !f.password) return setErr('Заполните почту и пароль')
      if (f.password.length < 6) return setErr('Пароль должен быть не короче 6 символов')
      if (!consent) return setErr('Нужно согласие на обработку персональных данных')
      const res = register({ ...f, age })
      if (!res.ok) return setErr(res.error)
    } else {
      if (!f.email || !f.password) return setErr('Заполните почту и пароль')
      const res = login({ email: f.email, password: f.password })
      if (!res.ok) return setErr(res.error)
    }
    onSuccess?.()
  }

  return (
    <div>
      <div className="mb-5 flex rounded-full border border-white/10 p-1 text-sm">
        {[
          ['login', 'Войти'],
          ['register', 'Регистрация'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMode(id)
              setErr('')
            }}
            className={`flex-1 rounded-full py-2 font-medium transition-colors ${
              mode === id ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === 'register' && (
          <>
            <input className={inputCls} placeholder="Фамилия" value={f.lastName} onChange={set('lastName')} autoComplete="family-name" />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputCls} placeholder="Имя" value={f.firstName} onChange={set('firstName')} autoComplete="given-name" />
              <input className={inputCls} placeholder="Отчество" value={f.middleName} onChange={set('middleName')} autoComplete="additional-name" />
            </div>
            <input
              className={inputCls}
              placeholder="Возраст"
              inputMode="numeric"
              value={f.age}
              onChange={(e) => setF((s) => ({ ...s, age: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
            />
          </>
        )}
        <input className={inputCls} type="email" placeholder="Почта" value={f.email} onChange={set('email')} autoComplete="email" />
        <input
          className={inputCls}
          type="password"
          placeholder="Пароль"
          value={f.password}
          onChange={set('password')}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />

        {mode === 'register' && (
          <label className="mt-1 flex cursor-pointer items-start gap-3 text-xs leading-5 text-white/55">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
            />
            <span>
              Я согласен на обработку персональных данных в соответствии с{' '}
              <button type="button" onClick={openPrivacy} className="text-[var(--accent)] underline underline-offset-2">
                политикой конфиденциальности
              </button>
              .
            </span>
          </label>
        )}

        {err && <p className="text-sm text-[#ff9a9a]">{err}</p>}

        <button type="submit" className="fill-btn mt-1 rounded-full border border-white py-3.5 text-sm font-medium tracking-[0.02em]">
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
        <p className="text-center text-xs text-white/40">Демо: данные хранятся только в вашем браузере.</p>
      </form>
    </div>
  )
}
