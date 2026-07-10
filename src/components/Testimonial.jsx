import { useReveal } from '../hooks/useReveal'

const QUOTE =
  'Это не перелёт, а пауза между делами, которую наконец хочется продлить.'

export default function Testimonial() {
  const [ref, visible] = useReveal(0.3)
  const words = QUOTE.split(' ')

  return (
    <section
      className="border-b border-white/10"
      aria-label="Отзыв"
    >
      <div className="mx-auto max-w-[1340px] px-[15px] py-[160px] mobile:px-[18px] mobile:py-[110px]">
        <span className="mb-10 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]">
          Слово гостя
        </span>
        <blockquote ref={ref}>
          <p className="max-w-[1100px] text-[clamp(30px,4.4vw,60px)] font-medium leading-[1.08] tracking-[-1.5px]">
            {words.map((w, i) => (
              <span
                key={i}
                className={`word-reveal ${visible ? 'is-visible' : ''} mr-[0.28em]`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {w}
              </span>
            ))}
          </p>
          <footer className="mt-10 flex items-center gap-4">
            <span className="h-11 w-11 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]" />
            <div className="flex flex-col">
              <cite className="not-italic text-sm font-medium">Мария Левина</cite>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">
                Основатель, студия Nord
              </span>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
