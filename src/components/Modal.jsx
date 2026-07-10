import { useEffect } from 'react'
import { X } from 'lucide-react'

/** Centered overlay modal with fade/slide-in, Escape to close, scroll lock. */
export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-[520px]' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 mobile:items-end"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[videoFadeIn_0.3s_ease]"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[92vh] overflow-y-auto rounded-3xl border border-white/12 bg-[#0b0b0d] p-8 shadow-2xl animate-[revealUp_0.5s_var(--ease-spring)] mobile:rounded-b-none mobile:p-6`}
      >
        <div className="mb-6 flex items-start justify-between gap-6">
          <h3 className="text-2xl font-medium tracking-[-0.6px]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
