// @ts-ignore
import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
/**
 * Scrapes Game website for products based on search string.
 *
 * @param searchString - The search string to use.
 *
 * @returns {Promise<SearchOutcome[]>} - The search outcome.
 */
export async function queryGame(searchString: string) {
  try {

    const browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security",'--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
  
    });
  
    const page = await browser.newPage();

    const [response] = await Promise.all([
      page.waitForResponse((response: any) => {
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
