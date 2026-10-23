import { test, expect, type Page } from '@playwright/test'

// Seção "Segurança e privacidade": no celular, prende o cabeçalho que couber + diagrama + card
// e troca as etapas com a rolagem; quando nada cabe, mostra as três etapas empilhadas.
const etapas = ['Sistema da empresa', 'Nuvem FAMCORE', 'App do fornecedor']

type Amostra = {
  presa: boolean
  ativa: string
  menu: number
  pinTop: number
  pinSticky: number
  escudo: { top: number, opacidade: number }
  rotulo: { top: number, opacidade: number }
  titulo: { top: number, altura: number }
  diagrama: number
  cardFim: number
  infra: number
}

async function abrir(page: Page) {
  await page.goto('/')
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
    await document.fonts.ready
    dispatchEvent(new Event('load'))
  })
}

// Rola a página pela seção, de 40 em 40 px, e registra o estado em cada ponto
function percorrer(page: Page): Promise<Amostra[]> {
  return page.evaluate(async () => {
    const q = <T extends Element>(s: string) => document.querySelector<T>(s)!
    const scroller = q<HTMLElement>('.stage-scroller')
    const pin = q<HTMLElement>('.stage-pin')
    const inicio = scroller.getBoundingClientRect().top + scrollY - innerHeight
    const fim = inicio + scroller.offsetHeight + innerHeight * 2
    const amostras = []
    for (let y = inicio; y < fim; y += 40) {
      scrollTo(0, y)
      await new Promise(requestAnimationFrame)
      await new Promise(requestAnimationFrame)
      const box = (s: string) => q(s).getBoundingClientRect()
      const opacidade = (s: string) => Number(getComputedStyle(q(s)).opacity)
      amostras.push({
        presa: scroller.classList.contains('is-pinned'),
        ativa: q('.stage-tabs [aria-selected="true"]')?.textContent?.trim() ?? '',
        menu: box('.site-header').bottom,
        pinTop: pin.getBoundingClientRect().top,
        pinSticky: parseFloat(pin.style.top),
        escudo: { top: box('#seguranca .shield').top, opacidade: opacidade('#seguranca .shield') },
        rotulo: { top: box('#seguranca .eyebrow').top, opacidade: opacidade('#seguranca .eyebrow') },
        titulo: { top: box('#seguranca-titulo').top, altura: box('#seguranca-titulo').height },
        diagrama: box('.stage-tabs').top,
        cardFim: box('.stage.is-active').bottom,
        infra: box('.providers').top,
      })
    }
    return amostras
  })
}

const presas = (amostras: Amostra[]) => amostras.filter((a) => Math.abs(a.pinTop - a.pinSticky) < 1)

// Do mais completo ao mais enxuto: o que deve continuar visível enquanto a seção está presa
// (o rodapé de progresso ocupa o fim da tela; em 360×640 ele não cabe e a seção prende sem ele)
const niveis = [
  { tela: { width: 390, height: 844 }, preso: 'escudo' },
  { tela: { width: 390, height: 750 }, preso: 'título' },
  { tela: { width: 390, height: 664 }, preso: 'rótulo' },
  { tela: { width: 375, height: 667 }, preso: 'diagrama' },
  { tela: { width: 360, height: 640 }, preso: 'diagrama' },
] as const
const descricao = { escudo: 'escudo, rótulo, título, diagrama e card', título: 'título, diagrama e card', rótulo: 'rótulo, diagrama e card', diagrama: 'só diagrama e card' }

for (const { tela, preso } of niveis) {
  test.describe(`celular ${tela.width}×${tela.height}`, () => {
    test.use({ viewport: tela, isMobile: true, hasTouch: true })

    test(`prende ${descricao[preso]} e troca as três etapas com a rolagem`, async ({ page }) => {
      await abrir(page)
      const amostras = await percorrer(page)
      expect(amostras[0].presa).toBe(true)

      const fixadas = presas(amostras)
      expect([...new Set(fixadas.map((a) => a.ativa))]).toEqual(etapas)

      // no meio da troca, o cabeçalho já recolheu: confere o que ficou visível abaixo do menu
      const meio = fixadas.find((a) => a.ativa === etapas[1])!
      const visivel = (top: number, opacidade = 1) => top >= meio.menu && opacidade === 1
      expect(visivel(meio.escudo.top, meio.escudo.opacidade)).toBe(preso === 'escudo')
      expect(visivel(meio.rotulo.top, meio.rotulo.opacidade)).toBe(preso === 'escudo' || preso === 'rótulo')
      expect(visivel(meio.titulo.top) && meio.titulo.altura > 0).toBe(preso === 'escudo' || preso === 'título')
      expect(meio.diagrama).toBeGreaterThanOrEqual(meio.menu)

      // depois que o cabeçalho recolheu, cada card cabe inteiro na tela
      for (const a of fixadas.slice(fixadas.indexOf(meio))) expect(a.cardFim).toBeLessThanOrEqual(tela.height)
    })

    test('depois da última etapa, a Infraestrutura vem com espaço', async ({ page }) => {
      await abrir(page)
      const ultima = (await percorrer(page)).at(-1)!
      expect(ultima.infra - ultima.cardFim).toBeGreaterThanOrEqual(55)
    })
  })
}

test.describe('celular 390×750: toque no diagrama e barra do navegador', () => {
  test.use({ viewport: { width: 390, height: 750 }, isMobile: true, hasTouch: true })

  test('a barra do navegador aparecer/sumir não refaz a seção no meio da rolagem', async ({ page }) => {
    await abrir(page)
    const altura = () => page.locator('.stage-scroller').evaluate((el) => el.style.height)
    const antes = await altura()
    await page.setViewportSize({ width: 390, height: 690 })
    await page.setViewportSize({ width: 390, height: 750 })
    await page.setViewportSize({ width: 390, height: 700 })
    expect(await altura()).toBe(antes)
  })

  test('tocar numa etapa rola até ela', async ({ page }) => {
    await abrir(page)
    await page.locator('#seguranca').scrollIntoViewIfNeeded()
    await page.getByRole('tab', { name: etapas[2] }).click()
    await expect(page.getByRole('tab', { name: etapas[2] })).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#etapa-app')).toBeVisible()
    await expect(page.locator('#etapa-empresa')).toBeHidden()
  })

  test('barra no rodapé mostra o progresso das etapas só enquanto a seção está presa', async ({ page }) => {
    await abrir(page)
    const rodape = page.locator('.stage-progress')
    await expect(rodape).not.toHaveClass(/is-shown/)
    await page.getByRole('tab', { name: etapas[1] }).click()
    await expect(rodape).toHaveClass(/is-shown/)
    const preenchido = () => rodape.evaluate((el) => Number(el.style.getPropertyValue('--p')))
    expect(await preenchido()).toBeCloseTo(0.5, 1)
    await page.getByRole('tab', { name: etapas[2] }).click()
    expect(await preenchido()).toBeCloseTo(5 / 6, 1)
    await page.locator('.providers').scrollIntoViewIfNeeded()
    await expect(rodape).not.toHaveClass(/is-shown/)
  })
})

// Sem espaço para prender (tela baixa, celular deitado) ou com "reduzir movimento": tudo empilhado
const empilhadas = [
  { nome: 'tela baixa 375×600', tela: { width: 375, height: 600 }, calmo: false },
  { nome: 'celular deitado 667×375', tela: { width: 667, height: 375 }, calmo: false },
  { nome: 'reduzir movimento 390×750', tela: { width: 390, height: 750 }, calmo: true },
]

for (const { nome, tela, calmo } of empilhadas) {
  test.describe(nome, () => {
    test.use({ viewport: tela, isMobile: true, hasTouch: true, reducedMotion: calmo ? 'reduce' : 'no-preference' })

    test('não prende e mostra as três etapas empilhadas, com as ligações', async ({ page }) => {
      await abrir(page)
      await expect(page.locator('.stage-scroller')).not.toHaveClass(/is-pinned/)
      await expect(page.locator('.stage-tabs')).toBeHidden()
      for (const etapa of etapas) await expect(page.getByRole('heading', { name: etapa })).toBeVisible()
      await expect(page.locator('.stage-link')).toHaveCount(2)
      for (const ligacao of await page.locator('.stage-link').all()) await expect(ligacao).toBeVisible()
    })
  })
}

test.describe('computador 1440×900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('mostra as três etapas lado a lado, sem prender', async ({ page }) => {
    await abrir(page)
    await expect(page.locator('.stage-scroller')).not.toHaveClass(/is-pinned/)
    const tops = await page.locator('.stage').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)))
    expect(new Set(tops).size).toBe(1)
  })
})
