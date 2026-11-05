import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../service-worker.js', import.meta.url), 'utf8');
function worker({ cached, networkFails = false } = {}) {
  const events = {};
  const removed = [];
  const shell = new Response('offline shell');
  const context = {
    self: { location: { origin: 'https://school.test' }, registration: { scope: 'https://school.test/game/' }, clients: { claim: async () => {} }, skipWaiting() {}, addEventListener: (name, fn) => { events[name] = fn; } },
    caches: { open: async () => ({ addAll: async files => { context.files = files; } }), keys: async () => ['guarani-caminhos-v1', 'unrelated-app'], delete: async key => { removed.push(key); }, match: async request => request === './index.html' ? shell : cached },
    URL, Response, fetch: async () => { if (networkFails) throw Error('offline'); return new Response('network'); }
  };
  vm.runInNewContext(source, context);
  async function lifecycle(name) { let promise; events[name]({ waitUntil: value => { promise = value; } }); await promise; }
  async function fetchRequest(url, method = 'GET') { let response; events.fetch({ request: { method, url }, respondWith: value => { response = value; } }); return response === undefined ? undefined : await response; }
  return { context, removed, lifecycle, fetchRequest };
}

test('PWA: instalação inclui arquivos existentes e ícones com dimensões reais', async () => {
  const w = worker(); await w.lifecycle('install');
  for (const file of w.context.files) await access(new URL(`../${file}`, import.meta.url));
  const manifest = JSON.parse(await readFile(new URL('../manifest.webmanifest', import.meta.url)));
  assert.equal(manifest.display, 'standalone');
  for (const icon of manifest.icons) {
    const bytes = await readFile(new URL(`../${icon.src}`, import.meta.url));
    assert.equal(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`, icon.sizes);
  }
});

test('PWA: atualização remove cache antigo e preserva outros aplicativos', async () => {
  const w = worker(); await w.lifecycle('activate');
  assert.deepEqual(w.removed, ['guarani-caminhos-v1']);
});

test('PWA: arquivo em cache é servido sem rede', async () => {
  const w = worker({ cached: new Response('cached asset'), networkFails: true });
  assert.equal(await (await w.fetchRequest('https://school.test/game/styles.css')).text(), 'cached asset');
});

test('PWA: navegação offline sem entrada específica recebe o HTML de fallback', async () => {
  const w = worker({ networkFails: true });
  assert.equal(await (await w.fetchRequest('https://school.test/game/unknown')).text(), 'offline shell');
});

test('PWA: não intercepta POST, outros sites ou caminhos fora do escopo', async () => {
  const w = worker();
  assert.equal(await w.fetchRequest('https://school.test/game/', 'POST'), undefined);
  assert.equal(await w.fetchRequest('https://other.test/game/'), undefined);
  assert.equal(await w.fetchRequest('https://school.test/another/'), undefined);
});
