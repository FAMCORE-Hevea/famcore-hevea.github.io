#!/usr/bin/env node
// Gera public/og-image.jpg (1200x630) a partir de scripts/og-image.html usando Chromium headless.
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const template = path.join(root, 'scripts/og-image.html')
const output = path.join(root, 'public/og-image.jpg')

const cache = path.join(os.homedir(), '.cache/ms-playwright')
const installations = await fs.readdir(cache).catch(() => [])
const candidates = [
  process.env.CHROMIUM_PATH,
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  ...installations.filter((name) => /^chromium-\d+$/.test(name)).sort().reverse()
    .flatMap((name) => ['chrome-linux64/chrome', 'chrome-linux/chrome'].map((binary) => path.join(cache, name, binary))),
].filter(Boolean)
let chromium
for (const candidate of candidates) {
  if (await fs.access(candidate, fs.constants.X_OK).then(() => true, () => false)) {
    chromium = candidate
    break
  }
}
if (!chromium) throw new Error('Chromium ausente. Instale-o ou defina CHROMIUM_PATH com o caminho do executável.')

const before = await fs.stat(output).then((s) => s.mtimeMs, () => 0)
// A extensão .jpg faz o Chromium gravar JPEG, mantendo a imagem leve para o WhatsApp.
// Sem --user-data-dir: com perfil temporário, o Chromium do Playwright trava sem gravar a imagem.
await promisify(execFile)(chromium, [
  '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1200,630', '--virtual-time-budget=1500',
  `--screenshot=${output}`, pathToFileURL(template).href,
], { timeout: 60_000 })

if ((await fs.stat(output)).mtimeMs <= before) throw new Error('O Chromium terminou sem gravar a imagem.')
const data = await fs.readFile(output)
if (data[0] !== 0xff || data[1] !== 0xd8) throw new Error('A saída não é um JPEG válido.')
if (data.length > 300_000) throw new Error(`Imagem com ${data.length} bytes; o WhatsApp pode ignorar prévias acima de ~300 KB.`)
console.log(`Gerado ${path.relative(root, output)} (${Math.round(data.length / 1024)} KB)`)
