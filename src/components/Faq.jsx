import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

const ITEMS = [
  {
    q: 'Как забронировать рейс?',
    a: 'Выберите маршрут и дату в блоке бронирования, укажите класс и число пассажиров, затем оплатите картой. Посадочный талон придёт на вашу почту, а бронь появится в личном кабинете.',
  },
  {
    q: 'Что такое «пустые рейсы»?',
    a: 'Это перегоночные перелёты — борт и так летит в нужную сторону без пассажиров. Вы платите только за своё место, поэтому цена ниже обычной до 65%. Расписание таких рейсов фиксированное.',
  },
  {
    q: 'Какой багаж можно взять на борт?',
    a: 'В бизнес-классе — до 40 кг, в первом и на частном борте лимита фактически нет. Негабаритный груз (лыжи, гольф, музыкальные инструменты) согласуется с консьержем заранее.',
  },
  {
    q: 'Можно ли лететь с питомцем?',
    a: 'Да. На частном борте питомец летит с вами в салоне без переноски и ограничений по весу. Достаточно предупредить консьержа при бронировании.',
  },
  {
    q: 'Как происходит оплата и возврат?',
    a: 'Оплата — картой онлайн (в этой демоверсии списание не производится). Возврат возможен до подтверждения вылета; по «пустым рейсам» действуют специальные условия.',
  },
  {
    q: 'За сколько подтверждается вылет?',
    a: 'Регулярные направления подтверждаются мгновенно. Рейс по запросу мы поднимаем в воздух от 4 часов с момента брони — терминал бизнес-авиации, без очередей и досмотра общего потока.',
  },
]

export default function Faq() {
  const [headRef, headVisible] = useReveal(0.3)
  const [open, setOpen] = useState(0)

  return (
    <section
      id="faq"
      className="border-b border-white/10"
      aria-label="Вопросы и ответы"
    >
      <div className="mx-auto grid max-w-[1340px] grid-cols-[0.8fr_1.2fr] gap-16 px-[15px] py-[140px] md-tablet:gap-10 mobile:grid-cols-1 mobile:gap-8 mobile:px-[18px] mobile:py-[90px]">
        <div ref={headRef}>
          <span className={`reveal-up ${headVisible ? 'is-visible' : ''} mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]`}>
            Вопросы
          </span>
          <h2 className={`reveal-up ${headVisible ? 'is-visible' : ''} text-[52px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[40px] mobile:text-[32px]`}>
            Коротко<br />
            <span className="text-white/45">о главном.</span>
          </h2>
          <a
            href="mailto:concierge@flyaether.ru"
            className="mt-8 inline-block text-sm font-medium text-white/50 underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
          >
            Остались вопросы? Напишите консьержу →
          </a>
        </div>

        <ul className="flex flex-col">
          {ITEMS.map((item, i) => (
            <li key={i} className="border-t border-white/10 last:border-b">
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-lg font-medium tracking-[-0.3px] mobile:text-base">{item.q}</span>
                <Plus
                  size={20}
                  className={`shrink-0 text-[var(--accent)] transition-transform duration-500 ease-[var(--ease-spring)] ${
                    open === i ? 'rotate-45' : ''
                  }`}
                />
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500"
                style={{ gridTemplateRows: open === i ? '1fr' : '0fr', transitionTimingFunction: 'var(--ease-spring)' }}
              >
                <div className="overflow-hidden">
                  <p className="max-w-[560px] pb-6 text-base font-medium leading-6 tracking-[-0.16px] text-white/55">
                    {item.a}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
