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
