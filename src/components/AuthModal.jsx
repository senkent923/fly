import { useState } from 'react'
import Modal from './Modal'
import { useApp } from '../store/AppContext'

export default function AuthModal() {
  const { modal, closeModal, login, register } = useApp()
  const open = modal === 'auth'
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Заполните почту и пароль')
    if (mode === 'register' && form.password.length < 6)
      return setError('Пароль должен быть не короче 6 символов')
    const res = mode === 'login' ? login(form) : register(form)
    if (!res.ok) return setError(res.error)
    setForm({ name: '', email: '', password: '' })
    closeModal()
  }

  return (
    <Modal open={open} onClose={closeModal} title={mode === 'login' ? 'Вход' : 'Регистрация'}>
      {/* mode switch */}
      <div className="mb-6 flex rounded-full border border-white/10 p-1 text-sm">
        {[
          ['login', 'Войти'],
          ['register', 'Создать аккаунт'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMode(id)
              setError('')
            }}
            className={`flex-1 rounded-full py-2 font-medium transition-colors ${
              mode === id ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">
        {mode === 'register' && (
          <Field label="Имя">
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="Как к вам обращаться"
              className={inputCls}
            />
          </Field>
        )}
        <Field label="Почта">
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputCls}
          />
        </Field>
        <Field label="Пароль">
          <input
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="••••••••"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className={inputCls}
          />
        </Field>

        {error && <p className="text-sm text-[#ff9a9a]">{error}</p>}

        <button
          type="submit"
          className="fill-btn mt-2 rounded-full border border-white py-3.5 text-sm font-medium tracking-[0.02em]"
        >
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
        <p className="text-center text-xs text-white/40">
          Демо: данные хранятся только в вашем браузере.
        </p>
      </form>
    </Modal>
  )
}

const inputCls =
  'w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--accent)]'

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
        {label}
      </span>
      {children}
    </label>
  )
}
