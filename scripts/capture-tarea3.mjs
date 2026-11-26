import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, devices } from '@playwright/test';

const PORT = 8103;
const URL = `http://localhost:${PORT}`;
const OUT = 'evidence/tarea3';

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // el servidor aún no responde
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`El servidor no respondió en ${timeoutMs} ms`);
}

await mkdir(OUT, { recursive: true });
const server = spawn('npx', ['ng', 'serve', '--port', String(PORT)], { stdio: 'ignore', detached: true });
const messages = [];

try {
  await waitForServer(URL, 120_000);
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const context = await browser.newContext({ ...devices['Pixel 7'] });
    const page = await context.newPage();
    page.on('console', (m) => messages.push(`${m.type()}: ${m.text()}`));
    page.on('pageerror', (e) => messages.push(`pageerror: ${e.message}`));
    await page.goto(URL, { waitUntil: 'networkidle' });
    const card = page.locator('app-package-item', { hasText: 'Estado: En tránsito' }).first();
    await card.waitFor();
    const code = (await card.locator('h3').innerText()).trim();
    const stable = page.locator('app-package-item', { hasText: code });
    const button = stable.getByRole('button', { name: /como inspeccionado/ });
    await page.screenshot({ path: `${OUT}/03-antes.png`, fullPage: true });
    await button.click();
    await stable.getByText('Estado: Inspeccionado').waitFor();
    await page.screenshot({ path: `${OUT}/04-despues.png`, fullPage: true });
    await context.close();
  } finally {
    await browser.close();
  }
} finally {
  process.kill(-server.pid, 'SIGTERM');
}
await writeFile(`${OUT}/console.log`, messages.join('\n') + (messages.length ? '\n' : ''));
console.log(`Mensajes de consola: ${messages.length}`);
