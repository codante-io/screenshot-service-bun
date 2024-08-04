import { chromium } from 'playwright-core';
import sharp from 'sharp';

export async function getBufferFromPageScreenshot(
  url: string,
  timeout = 30000
) {
  // Added timeout parameter with default value
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto(url, { timeout, waitUntil: 'domcontentloaded' }); // Added timeout option to page.goto()
    let screenshotBuffer = await page.screenshot({ timeout }); // Added timeout option to page.screenshot()
    await browser.close();

    const image = sharp(screenshotBuffer);
    await image.metadata();

    screenshotBuffer = await image.webp().toBuffer();

    return screenshotBuffer;
  } catch (e: any) {
    throw e;
  }
}
