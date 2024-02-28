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
export async function queryGame(searchString: string) {
  try {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const [response] = await Promise.all([
      page.waitForResponse(response => {
        return response.url().startsWith('https://api-beta-game.walmart.com/occ/v2/game/channel/web/zone') && response.status() === 200 && response.request().method() === 'POST';
      }
      ),
      page.goto(`https://www.game.co.za/l/search/?q=${searchString}%3Arelevance&t=${searchString}`)
    ]);

  
    
    const { products } = await response.json();
    await browser.close();

    return products.map((product: any) => {
      return {
        id: product.code,
        name: product.name,
        price: product.price.value,
        brand: product.brand,
        category: product.categoryL1,
        position: '',
        variant: '',
        list:'',
        unit_sale_price: '',
        stock: product.stock.stockLevelStatus,
        product_image_url: product.image.url,
      };
    });

  } catch (error) {
    console.log(error);
    throw error;
  }
}
