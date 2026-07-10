import { useState } from 'react'
import { ArrowUpRight, Maximize2, X } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { useApp } from '../store/AppContext'

const today = new Date().toISOString().slice(0, 10)

const FLEET = [
  {
    id: 'challenger',
    img: '/jets/challenger-3500.jpg',
    frame: 'dark',
    fit: 'cover',
    model: 'Bombardier Challenger 3500',
    type: 'Сверхсредний бизнес-джет',
    classId: 'business',
    caption: 'Challenger 3500 — сверхсредний класс',
    desc: 'Самая тихая кабина в классе, цельное крыло и интеллектуальный салон Nuage. Идеален для маршрутов средней дальности с полным комфортом бизнес-класса.',
    specs: [
      ['Дальность', '6 300 км'],
      ['Скорость', '0.83 Маха'],
      ['Гостей', 'до 10'],
      ['Высота салона', '1.83 м'],
    ],
  },
  {
    id: 'gulfstream',
    img: '/jets/gulfstream.jpg',
    frame: 'light',
    fit: 'contain',
    model: 'Gulfstream G650ER',
    type: 'Сверхдальний флагман',
    classId: 'first',
    caption: 'Gulfstream G650ER — флагман дальних линий',
    desc: 'Два континента без посадки, панорамные иллюминаторы и крейсерская скорость до 0.90 Маха. Отдельные каюты и обзорная зона на борту.',
    specs: [
      ['Дальность', '13 890 км'],
      ['Скорость', '0.90 Маха'],
      ['Гостей', 'до 14'],
      ['Высота салона', '1.95 м'],
    ],
  },
]

export default function Fleet() {
  const [headRef, headVisible] = useReveal(0.3)
  const [lightbox, setLightbox] = useState(null)

  return (
    <section
      id="fleet"
      className="relative overflow-hidden border-b border-white/10 bg-white/[0.02]"
      aria-label="Флот"
    >
      <div className="mx-auto max-w-[1340px] px-[15px] py-[140px] mobile:px-[18px] mobile:py-[90px]">
        <div ref={headRef} className="mb-12 flex items-end justify-between gap-6 mobile:flex-col mobile:items-start">
          <div>
            <span className={`reveal-up ${headVisible ? 'is-visible' : ''} mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]`}>
              Флот
            </span>
            <h2 className={`reveal-up ${headVisible ? 'is-visible' : ''} text-[52px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[40px] mobile:text-[32px]`}>
              Два борта — <span className="text-white/45">весь мир.</span>
            </h2>
          </div>
          <span className={`reveal-up ${headVisible ? 'is-visible' : ''} max-w-[300px] text-sm text-white/45`}>
            Частные джеты последнего поколения — тихие, дальнобойные, углеродно-нейтральные.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
          {FLEET.map((ac, i) => (
            <AircraftCard key={ac.id} ac={ac} index={i} onZoom={() => setLightbox(ac)} />
          ))}
        </div>
      </div>

      {lightbox && <Lightbox ac={lightbox} onClose={() => setLightbox(null)} />}
    </section>
  )
}

function AircraftCard({ ac, index, onZoom }) {
  const [ref, visible] = useReveal(0.25)
  const { startBooking } = useApp()

  return (
    <article
      ref={ref}
      style={{ animationDelay: `${index * 0.1}s` }}
      className={`reveal-up ${visible ? 'is-visible' : ''} glow-card group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.015]`}
    >
      {/* photo */}
      <figure className="relative m-0">
        <button
          type="button"
          onClick={onZoom}
          aria-label={`Увеличить фото — ${ac.model}`}
          className={`block aspect-[16/10] w-full overflow-hidden ${
            ac.frame === 'light'
              ? 'bg-gradient-to-br from-[#eef1f7] to-[#dbe1ec]'
              : 'bg-[#0c0e12]'
          }`}
        >
          <img
            src={ac.img}
            alt={ac.model}
            loading="lazy"
            className={`h-full w-full ${
              ac.fit === 'contain' ? 'object-contain p-6' : 'object-cover'
            } transition-transform duration-[900ms] ease-[var(--ease-spring)] group-hover:scale-[1.06]`}
          />
          <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <Maximize2 size={15} />
          </span>
        </button>
        {/* caption directly under the photo */}
        <figcaption className="border-b border-white/8 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
          {ac.caption}
        </figcaption>
      </figure>

      {/* text */}
      <div className="flex flex-1 flex-col p-7 mobile:p-6">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h3 className="text-2xl font-medium tracking-[-0.6px]">{ac.model}</h3>
        </div>
        <span className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
          {ac.type}
        </span>
        <p className="mb-6 text-base font-medium leading-6 tracking-[-0.16px] text-white/60">
          {ac.desc}
        </p>

        <dl className="mb-7 grid grid-cols-2 gap-x-6 gap-y-4">
          {ac.specs.map(([k, v]) => (
            <div key={k} className="border-t border-white/10 pt-2">
              <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">{k}</dt>
              <dd className="text-lg font-medium">{v}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={() => startBooking({ fromCode: 'SVO', toCode: 'DXB', date: today, pax: 1, round: false })}
          className="fill-btn group/btn mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-white px-6 py-3 text-sm font-medium tracking-[0.02em]"
        >
          Забронировать борт
          <ArrowUpRight size={16} className="transition-transform duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </article>
  )
}

function Lightbox({ ac, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-6 animate-[videoFadeIn_0.25s_ease]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/50 hover:text-white"
      >
        <X size={18} />
      </button>
      <figure
        className="relative max-h-[85vh] w-full max-w-[1000px] animate-[revealUp_0.4s_var(--ease-spring)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`overflow-hidden rounded-2xl ${ac.frame === 'light' ? 'bg-white' : 'bg-[#0c0e12]'}`}>
          <img src={ac.img} alt={ac.model} className="max-h-[72vh] w-full object-contain" />
        </div>
        <figcaption className="mt-4 text-center">
          <span className="text-lg font-medium">{ac.model}</span>
          <span className="ml-3 text-sm text-white/45">{ac.type}</span>
        </figcaption>
      </figure>
    </div>
  )
}
