'use server';

import { SearchOutcome } from '../(@types)/SearchOutcome';
import puppeteer from 'puppeteer';

/**
 * Scrapes Pick n Pay website for products based on search string.
 *
 * @param searchString - The search string to use.
 *
 * @returns {Promise<SearchOutcome[]>} - The search outcome.
 */
export async function queryPickNPay(searchString: string) {
  try {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    await browser.userAgent();

    const page = await browser.newPage();

    // Navigate the page to a URL and wait for the dom to be rendered.
    await page.goto(`https://www.pnp.co.za`, {
      waitUntil: 'domcontentloaded',
    });

    await page.setViewport({ width: 1280, height: 800 });
    await page.waitForSelector('.search-input');
    await page.type('.search-input', searchString);
    await page.click('button.search-button');
    await page.waitForSelector('ui-product-grid-item');

    const productList = await page.evaluate(() => {
      const itemsList = Array.from(
        document.querySelectorAll('ui-product-grid-item'),
      );

      return itemsList.map((item) => {
        const itemData = item?.querySelector<any>('.product-grid-item');
        let promotionPrice = item.querySelector<any>(
          '.product-grid-item__promotion-container',
        )?.innerText;

        if (promotionPrice) {
          promotionPrice = promotionPrice.replace('Smart Price: R', '');
        } else {
          promotionPrice = '';
        }
        return {
          id: itemData.getAttribute('data-cnstrc-item-id'),
          name: itemData.getAttribute('data-cnstrc-item-name'),
          price: itemData.getAttribute('data-cnstrc-item-price'),
          brand: '',
          category: '',
          position: '1',
          variant: '',
          list: '',
          unit_sale_price: promotionPrice,
          stock: '',
          product_image_url: item?.querySelector<any>(
            '.product-grid-item > a cx-media > img',
          )?.src,
        };
      });
    });

    // Close the browser
    await browser.close();

    return productList;
  } catch (error) {
    throw error;
  }
}
