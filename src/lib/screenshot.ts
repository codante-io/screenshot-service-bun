import { firefox } from 'playwright-core';
import sharp from 'sharp';

export async function getBufferFromPageScreenshot(
  url: string,
  timeout = 30000
) {
  // Added timeout parameter with default value
  try {
    console.log('screenshot');
    const browser = await firefox.launch();
    console.log('screenshot2');
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto(url, { timeout, waitUntil: 'domcontentloaded' }); // Added timeout option to page.goto()
    console.log('screenshot3');
    let screenshotBuffer = await page.screenshot({ timeout }); // Added timeout option to page.screenshot()
    console.log('screenshot4');
    await browser.close();
    console.log('screenshot5');

    const image = sharp(screenshotBuffer);
    await image.metadata();

    screenshotBuffer = await image.webp().toBuffer();

    return screenshotBuffer;
  } catch (e: any) {
    throw e;
  }
}
