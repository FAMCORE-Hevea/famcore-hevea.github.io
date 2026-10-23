import './style.css'

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()) })

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue
    entry.target.classList.add('is-visible')
    observer.unobserve(entry.target)
  }
}, { rootMargin: '0px 0px -8% 0px' })

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

const carousel = document.querySelector<HTMLElement>('#telas')
const arrows = document.querySelectorAll<HTMLButtonElement>('[data-scroll]')
if (carousel) {
  const step = () => (carousel.querySelector<HTMLElement>('.tile')?.offsetWidth ?? 0) + 20
  const update = () => {
    const max = carousel.scrollWidth - carousel.clientWidth - 2
    arrows.forEach((b) => { b.disabled = b.dataset.scroll === '-1' ? carousel.scrollLeft <= 2 : carousel.scrollLeft >= max })
  }
  arrows.forEach((b) => b.addEventListener('click', () => carousel.scrollBy({ left: Number(b.dataset.scroll) * step(), behavior: 'smooth' })))

  // Pontos indicam quantas telas existem e qual está em foco
  const tiles = [...carousel.querySelectorAll<HTMLElement>('.tile')]
  const dots = tiles.map((tile, i) => {
    const dot = document.createElement('button')
    dot.type = 'button'
    dot.setAttribute('aria-label', `Tela ${i + 1}: ${tile.querySelector('.eyebrow')?.textContent ?? ''}`)
    dot.addEventListener('click', () => {
      const centered = getComputedStyle(tile).scrollSnapAlign.includes('center')
      tile.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: centered ? 'center' : 'start' })
    })
    document.querySelector('.carousel-dots')?.append(dot)
    return dot
  })
  const markActive = () => {
    const box = carousel.getBoundingClientRect()
    const centered = getComputedStyle(tiles[0]).scrollSnapAlign.includes('center')
    const target = centered ? box.left + box.width / 2 : box.left + (parseFloat(getComputedStyle(carousel).scrollPaddingLeft) || 0)
    const atEnd = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 2
    let active = 0
    tiles.forEach((tile, i) => {
      const r = tile.getBoundingClientRect()
      const point = centered ? r.left + r.width / 2 : r.left
      const best = tiles[active].getBoundingClientRect()
      if (Math.abs(point - target) < Math.abs((centered ? best.left + best.width / 2 : best.left) - target)) active = i
    })
    if (atEnd) active = tiles.length - 1
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === active)))
  }
  // Textos de tamanhos diferentes: iguala a altura do bloco de texto para os celulares ficarem alinhados
  const copies = [...carousel.querySelectorAll<HTMLElement>('.tile-copy')]
  const equalize = () => {
    copies.forEach((c) => { c.style.minHeight = '' })
    const tallest = Math.max(...copies.map((c) => c.offsetHeight))
    copies.forEach((c) => { c.style.minHeight = `${tallest}px` })
  }
  equalize()
  addEventListener('resize', equalize)
  document.fonts?.ready.then(equalize)
  carousel.addEventListener('scroll', markActive, { passive: true })
  addEventListener('resize', markActive)
  markActive()
  carousel.addEventListener('scroll', update, { passive: true })
  addEventListener('resize', update)
  update()
}

// Parallax da foto do campo: desce mais devagar que a página e desliza com o carrossel
const product = document.querySelector<HTMLElement>('.product')
if (product && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let queued = false
  const move = () => {
    queued = false
    const box = product.getBoundingClientRect()
    const progress = (box.top + box.height / 2 - innerHeight / 2) / innerHeight
    product.style.setProperty('--py', `${(progress * -60).toFixed(1)}px`)
    const max = carousel ? carousel.scrollWidth - carousel.clientWidth : 0
    product.style.setProperty('--px', `${(max > 0 ? (carousel!.scrollLeft / max) * -40 : 0).toFixed(1)}px`)
  }
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(move) } }
  addEventListener('scroll', queue, { passive: true })
  addEventListener('resize', queue)
  carousel?.addEventListener('scroll', queue, { passive: true })
  move()
}

// Abas das etapas de segurança (visíveis só no celular; no computador todas as etapas aparecem)
const stageTabs = [...document.querySelectorAll<HTMLButtonElement>('.stage-tabs [role="tab"]')]
const selectStage = (tab: HTMLButtonElement) => {
  stageTabs.forEach((t) => {
    const active = t === tab
    t.setAttribute('aria-selected', String(active))
    t.tabIndex = active ? 0 : -1
    document.getElementById(t.getAttribute('aria-controls') ?? '')?.classList.toggle('is-active', active)
  })
}
if (stageTabs[0]) selectStage(stageTabs[0])

// Celular/tablet: prende cabeçalho, diagrama e card na tela e troca a etapa conforme a rolagem (como nas páginas da Apple)
const scroller = document.querySelector<HTMLElement>('.stage-scroller')
const pin = scroller?.querySelector<HTMLElement>('.stage-pin')
const stages = scroller?.querySelector<HTMLElement>('.stages')
const title = scroller?.querySelector<HTMLElement>('h2')
const lead = scroller?.querySelector<HTMLElement>('.section-lead')
const eyebrow = scroller?.querySelector<HTMLElement>('.eyebrow')
const shield = scroller?.querySelector<SVGElement>('.shield')
const tabList = scroller?.querySelector<HTMLElement>('.stage-tabs')
const pinTop = 76
const narrow = matchMedia('(max-width: 960px)')
const calm = matchMedia('(prefers-reduced-motion: reduce)')
let above = 0 // o que fica acima do ponto de fixação sai por baixo do menu
let fading: (HTMLElement | SVGElement)[] = [] // ficam numa faixa ainda visível abaixo do menu: esmaecem junto com o recolhimento
let folding: { el: HTMLElement, height: number, margin: number }[] = [] // recolhem com a rolagem
let fold = 0 // rolagem usada para recolher título/texto antes de começar a trocar as etapas
let travel = 0
let measured = false
const activeIndex = () => Math.max(0, stageTabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'))
const setFold = (shown: number) => {
  const opacity = shown < 1 ? String(Math.max(0, shown * 2 - 1)) : ''
  for (const { el, height, margin } of folding) {
    el.style.height = shown < 1 ? `${height * shown}px` : ''
    el.style.marginTop = shown < 1 ? `${margin * shown}px` : ''
    el.style.opacity = opacity
    el.style.overflow = shown < 1 ? 'hidden' : ''
  }
  for (const el of fading) el.style.opacity = opacity
}
const layoutPin = () => {
  if (!scroller || !pin || !stages || !title || !lead || !eyebrow || !shield || !tabList) return
  setFold(1)
  scroller.classList.remove('is-pinned')
  scroller.style.height = ''
  pin.style.top = ''
  stages.style.minHeight = ''
  if (!narrow.matches || calm.matches) return
  // mede já no modo fixado (cards compactos)
  scroller.classList.add('is-pinned')
  const current = activeIndex()
  const tallest = Math.max(...stageTabs.map((t) => { selectStage(t); return stages.offsetHeight }))
  selectStage(stageTabs[current])
  const titleFold = { el: title, height: title.offsetHeight, margin: 14 }
  const leadFold = { el: lead, height: lead.offsetHeight, margin: 22 }
  // fixa a partir do primeiro nível que couber, da tela mais alta para a mais baixa (ex.: iPhone SE)
  const levels = [
    { start: pin, fold: [leadFold] }, // escudo, rótulo e título
    { start: title, fold: [leadFold], fade: [eyebrow] }, // só o título
    { start: eyebrow, fold: [titleFold, leadFold], fade: [shield] }, // só o rótulo
    { start: tabList, fold: [] }, // só diagrama e card
  ]
  let shown = 0
  for (const level of levels) {
    above = level.start === pin ? 0 : level.start.offsetTop - 8 // relativo ao pin (sticky = posicionado); offsetTop ignora a animação de entrada
    folding = level.fold
    fold = folding.reduce((sum, f) => sum + f.height + f.margin, 0)
    fading = level.fade ?? []
    shown = pin.offsetHeight - above - fold - stages.offsetHeight + tallest
    if (shown + pinTop + 16 <= innerHeight) break
  }
  // medição antes do layout final (só o diagrama, sem card): refeita na próxima rolagem
  measured = tallest >= 200
  // só fixa se a etapa mais alta couber inteira na tela; senão fica a troca por toque
  if (!measured || shown + pinTop + 16 > innerHeight) {
    scroller.classList.remove('is-pinned')
    return
  }
  travel = innerHeight * 0.6 * (stageTabs.length - 1)
  pin.style.top = `${pinTop - above}px`
  stages.style.minHeight = `${tallest}px`
  scroller.style.height = `${above + shown + fold + travel}px`
}
const scrolled = () => pinTop - above - scroller!.getBoundingClientRect().top
const followScroll = () => {
  if (!measured && narrow.matches && !calm.matches) layoutPin()
  if (!scroller?.classList.contains('is-pinned')) return
  const done = scrolled()
  if (fold) setFold(1 - Math.min(1, Math.max(0, done / fold)))
  const progress = Math.min(1, Math.max(0, (done - fold) / travel))
  const index = Math.min(stageTabs.length - 1, Math.floor(progress * stageTabs.length))
  if (index !== activeIndex()) selectStage(stageTabs[index])
}
stageTabs.forEach((tab, i) => tab.addEventListener('click', () => {
  if (scroller?.classList.contains('is-pinned')) {
    scrollTo({ top: scrollY + fold + (travel * (i + 0.5)) / stageTabs.length - scrolled(), behavior: calm.matches ? 'auto' : 'smooth' })
  }
  selectStage(tab)
}))
if (scroller) {
  let width = innerWidth
  let queued = false
  layoutPin()
  // a barra do navegador do celular aparece/some ao rolar e muda só a altura: refazer o cálculo aí faria a seção pular
  addEventListener('resize', () => {
    if (innerWidth === width) return
    width = innerWidth
    layoutPin()
    followScroll()
  })
  addEventListener('scroll', () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => { queued = false; followScroll() })
  }, { passive: true })
  document.fonts?.ready.then(layoutPin)
  addEventListener('load', () => { layoutPin(); followScroll() })
}
