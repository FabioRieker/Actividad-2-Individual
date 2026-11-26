import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, devices } from '@playwright/test';

const PORT = 8102;
const URL = `http://localhost:${PORT}`;
const OUT = 'evidence/tarea2';

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
    for (const [name, device, suffix] of [
      ['Pixel 7', devices['Pixel 7'], ''],
      ['iPhone 14', devices['iPhone 14'], '-iphone14'],
    ]) {
      const context = await browser.newContext({ ...device });
      const page = await context.newPage();
      page.on('console', (m) => messages.push(`[${name}] ${m.type()}: ${m.text()}`));
      page.on('pageerror', (e) => messages.push(`[${name}] pageerror: ${e.message}`));
      await page.goto(URL, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `${OUT}/02-movil-estados${suffix}.png`, fullPage: true });
      await page.getByRole('searchbox').fill('ZZZ');
      await page.getByText('No hay paquetes').waitFor();
      await page.screenshot({ path: `${OUT}/04-empty${suffix}.png`, fullPage: true });
      await context.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  process.kill(-server.pid, 'SIGTERM');
}
await writeFile(`${OUT}/console.log`, messages.join('\n') + (messages.length ? '\n' : ''));
console.log(`Mensajes de consola: ${messages.length}`);
