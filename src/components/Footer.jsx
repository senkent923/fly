import { useApp } from '../store/AppContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const { openPrivacy, openAdmin } = useApp()
  return (
    <footer
      id="journal"
      className="border-t border-white/10"
      aria-label="Подвал"
    >
      <div className="mx-auto flex max-w-[1340px] flex-col gap-12 px-[15px] py-16 mobile:px-[18px]">
        <div className="flex items-end justify-between mobile:flex-col mobile:items-start mobile:gap-8">
          <span className="text-[64px] font-semibold uppercase leading-none tracking-[-2px] mobile:text-[44px]">
            Aether<span className="text-[var(--accent)]">.</span>
          </span>
          <div className="flex gap-14 mobile:gap-10">
            <FooterCol
              title="Компания"
              links={['О нас', 'Флот', 'Экология', 'Вакансии']}
            />
            <FooterCol
              title="Полёты"
              links={['Маршруты', 'Каюты', 'Клуб', 'Консьерж']}
            />
            <FooterCol
              title="Контакты"
              links={['Telegram', 'VK', 'Пресса', 'Связаться']}
            />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs font-medium uppercase tracking-[0.14em] text-white/40 mobile:flex-col mobile:items-start mobile:gap-2">
          <span>© {year} AETHER — частное небо</span>
          <div className="flex items-center gap-5">
            <button type="button" onClick={openPrivacy} className="uppercase tracking-[0.14em] transition-colors hover:text-white">
              Политика конфиденциальности
            </button>
            <button type="button" onClick={openAdmin} className="uppercase tracking-[0.14em] transition-colors hover:text-white">
              Админ-панель
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
        {title}
      </span>
      {links.map((l) => (
        <a
          key={l}
          href="#top"
          className="nav-link-underline w-fit text-sm font-medium text-white/75"
        >
          {l}
        </a>
      ))}
    </div>
  )
}
