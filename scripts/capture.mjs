import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from '@playwright/test';

const PORT = 4200;
const EXTERNAL_URL = process.env.CAPTURE_URL;
const URL = EXTERNAL_URL ?? `http://localhost:${PORT}`;
const OUTPUT = 'evidence/tarea1/ionic-serve.png';

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // el servidor aún no responde
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`El servidor no respondió en ${timeoutMs} ms`);
}

await mkdir('evidence/tarea1', { recursive: true });

const server = EXTERNAL_URL
  ? undefined
  : spawn('npx', ['ng', 'serve', '--port', String(PORT)], {
      stdio: 'inherit',
      detached: true,
    });

try {
  await waitForServer(URL, 120_000);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ ...devices['Pixel 7'] });
    const page = await context.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.screenshot({ path: OUTPUT, fullPage: true });
    console.log(`Captura guardada en ${OUTPUT}`);
  } finally {
    await browser.close();
  }
} finally {
  if (server?.pid) process.kill(-server.pid, 'SIGTERM');
}
