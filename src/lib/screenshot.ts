import { firefox } from 'playwright-core';
import sharp from 'sharp';

export async function getBufferFromPageScreenshot(url: string) {
  try {
    console.log('screenshot');
    const browser = await firefox.launch();
    console.log('screenshot2');
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto(url);
    console.log('screenshot3');
    let screenshotBuffer = await page.screenshot();
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
