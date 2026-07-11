import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../store/AppContext'

const SECTIONS = [
  {
    h: '1. Какие данные мы собираем',
    p: 'При регистрации — фамилия, имя, отчество, возраст и адрес электронной почты. При бронировании — паспортные данные пассажира и сведения о рейсе. При оплате — платёжные данные (в демоверсии реальное списание не производится).',
  },
  {
    h: '2. Зачем мы их обрабатываем',
    p: 'Для оформления и подтверждения бронирования, оформления посадочного талона, связи с вами по рейсу и выполнения требований авиационной безопасности.',
  },
  {
    h: '3. Хранение и защита',
    p: 'В этой демоверсии все данные хранятся исключительно в локальном хранилище вашего браузера (localStorage) и никуда не передаются. Вы можете удалить их в любой момент, очистив данные сайта.',
  },
  {
    h: '4. Передача третьим лицам',
    p: 'Мы не передаём ваши персональные данные третьим лицам, за исключением случаев, прямо предусмотренных законодательством.',
  },
  {
    h: '5. Ваши права',
    p: 'Вы вправе запросить доступ к своим данным, их исправление или удаление, а также отозвать согласие на обработку, написав на concierge@flyaether.ru.',
  },
  {
    h: '6. Согласие',
    p: 'Регистрируясь на сайте, вы подтверждаете согласие на обработку персональных данных на условиях настоящей политики.',
  },
]

export default function PrivacyModal() {
  const { privacy, closePrivacy } = useApp()

  useEffect(() => {
    if (!privacy) return
    const onKey = (e) => e.key === 'Escape' && closePrivacy()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [privacy, closePrivacy])

  if (!privacy) return null

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 mobile:items-end" role="dialog" aria-modal="true" aria-label="Политика конфиденциальности">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-[videoFadeIn_0.3s_ease]" onClick={closePrivacy} />
      <div className="relative max-h-[88vh] w-full max-w-[640px] overflow-y-auto rounded-3xl border border-white/12 bg-[#0b0b0d] p-8 shadow-2xl animate-[revealUp_0.5s_var(--ease-spring)] mobile:rounded-b-none mobile:p-6">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">AETHER</span>
            <h3 className="text-2xl font-medium tracking-[-0.6px]">Политика конфиденциальности</h3>
          </div>
          <button type="button" onClick={closePrivacy} aria-label="Закрыть" className="rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:border-white/40 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h4 className="mb-1.5 text-sm font-semibold">{s.h}</h4>
              <p className="text-sm leading-6 text-white/60">{s.p}</p>
            </div>
          ))}
        </div>

        <button onClick={closePrivacy} className="fill-btn mt-8 w-full rounded-full border border-white py-3 text-sm font-medium">
          Понятно
        </button>
      </div>
    </div>
  )
}
