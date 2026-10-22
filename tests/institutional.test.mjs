import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');
const privacy = read('privacidade/index.html');

test('a página identifica a empresa e oferece contato institucional, sem placeholder', () => {
  for (const text of ['FAMCORE HEVEA LTDA', '23.146.485/0001-21', '937043988', 'heveicultura', 'Rua Brigadeiro Faria Lima', '1140', 'Conj. 115', '01452-001', '+55 (11) 94584-3491', 'contato@famcore.com.br', 'mailto:contato@famcore.com.br', 'tel:+5511945843491', 'FAMCORE Hevea App']) {
    assert.ok(html.includes(text), `Informação institucional ausente: ${text}`);
  }
  assert.doesNotMatch(html, /em breve/i);
});

test('os dados estruturados da organização são JSON válido e coerentes com o cadastro', () => {
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json, 'JSON-LD ausente');
  const org = JSON.parse(json);
  assert.equal(org.legalName, 'FAMCORE HEVEA LTDA');
  assert.equal(org.taxID, '23.146.485/0001-21');
  assert.equal(org.duns, '937043988');
  assert.equal(org.address.postalCode, '01452-001');
});

test('a política de privacidade existe, está linkada e identifica a empresa', () => {
  assert.ok(html.includes('href="/privacidade/"'));
  for (const text of ['FAMCORE HEVEA LTDA', '23.146.485/0001-21', 'contato@famcore.com.br', 'GitHub Pages']) {
    assert.ok(privacy.includes(text), `Informação ausente na política: ${text}`);
  }
});
