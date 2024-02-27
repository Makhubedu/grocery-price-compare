//  https://api-beta-game.walmart.com/occ/v2/game/channel/web/zone/G121/products/search?fields=DEFAULT&currentPage=0

'use server';
import axios from 'axios';
import puppeteer from 'puppeteer';

/**
 * Scrapes Game website for products based on search string.
 *
 * @param searchString - The search string to use.
 *
 * @returns {Promise<SearchOutcome[]>} - The search outcome.
 */
export async function game(searchString: string) {
  try {

    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();

    await page.goto(`https://www.game.co.za/l/search/?q=${searchString}%3Arelevance&t=${searchString}`);
    
    // Promise that resolves when the data is received
    const dataPromise = new Promise(resolve => {
        page.on('response', async response => {
          if (response.url().includes('https://api-beta-game.walmart.com/occ/v2/game/channel/web/zone') && response.status() === 200) {
            const data = await response.json();
            resolve(data.products); // Resolve with the products
          }
        });
      });
  
      // Wait for the data to be received
      const products = await dataPromise;
  
      await browser.close();
  
      return products;


    
  } catch (error) {
    console.log(error);
    throw error;
  }
}
