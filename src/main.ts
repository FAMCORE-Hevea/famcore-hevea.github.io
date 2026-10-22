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
  carousel.addEventListener('scroll', update, { passive: true })
  addEventListener('resize', update)
  update()
}
