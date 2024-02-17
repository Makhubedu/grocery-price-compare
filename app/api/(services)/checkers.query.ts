'use server';

import { SearchOutcome } from '../(@types)/SearchOutcome';
import puppeteer from 'puppeteer';

/**
 * Scrapes Checkers website for products based on search string.
 *
 * @param searchString - The search string to use.
 *
 * @returns {Promise<SearchOutcome[]>} - The search outcome.
 */
export async function queryCheckers(searchString: string) {
  try {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    await browser.userAgent();

    const page = await browser.newPage();

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
    await browser.close();

    return productList;
  } catch (error) {
    throw error;
  }
}
