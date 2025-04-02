import { chromium, Browser, Page } from 'playwright-core';
import sharp from 'sharp';

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_ANIMATION_WAIT = 1500;
const VIEWPORT = { width: 1920, height: 1080 };

async function setupBrowser(): Promise<Browser> {
  return await chromium.launch();
}

async function setupPage(
  browser: Browser,
  url: string,
  timeout: number,
  animationWait: number
): Promise<Page> {
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);
  await page.goto(url, { timeout, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(animationWait);
  return page;
}

async function processScreenshot(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  await image.metadata(); // Validate image
  return await image.webp().toBuffer();
}

export async function getBufferFromPageScreenshot(
  url: string,
  timeout = DEFAULT_TIMEOUT,
  animationWaitTime = DEFAULT_ANIMATION_WAIT
): Promise<Buffer> {
  let browser: Browser | null = null;

  try {
    browser = await setupBrowser();
    const page = await setupPage(browser, url, timeout, animationWaitTime);

    const screenshotBuffer = await page.screenshot({ timeout });
    return await processScreenshot(screenshotBuffer);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Screenshot failed: ${error.message}`);
    }
    throw new Error('Screenshot failed with unknown error');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
