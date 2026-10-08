import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('a página identifica a empresa e oferece contato institucional, sem placeholder', () => {
  for (const text of ['FAMCORE HEVEA LTDA', '23.146.485/0001-21', 'heveicultura', 'Rua Brigadeiro Faria Lima', '1140', 'Conj. 115', '01452-001', '+55 (11) 94584-3491', 'contato@famcore.com.br']) {
    assert.ok(html.includes(text), `Informação institucional ausente: ${text}`);
  }
  assert.doesNotMatch(html, /em breve/i);
});
