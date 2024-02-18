'use server';

import puppeteer from 'puppeteer-extra';
import { executablePath } from 'puppeteer';

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import anonymous from 'puppeteer-extra-plugin-anonymize-ua';

/**
 * Scrapes Checkers website for products based on search string.
 *
 * @param searchString - The search string to use.
 *
 * @returns {Promise<SearchOutcome[]>} - The search outcome.
 */
export async function queryCheckers(searchString: string) {
  try {
    puppeteer.use(StealthPlugin());
    puppeteer.use(anonymous());

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath(),
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/60.0.3112.50 Safari/537.36',
    );

    // Navigate the page to a URL and wait for the dom to be rendered.
    await page.goto(`https://www.checkers.co.za/search/all?q=${searchString}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.setViewport({ width: 1280, height: 800 });

    const productList = await page.evaluate(() => {
      const itemsList = Array.from(document.querySelectorAll('.product-frame'));

      return itemsList.map((item) => {
        const dataProductGa = item.getAttribute('data-product-ga');

        if (dataProductGa) {
          return JSON.parse(dataProductGa);
        }
      });
    });

    // Close the browser
    // await browser.close();

    return productList;
  } catch (error) {
    throw error;
  }
}
