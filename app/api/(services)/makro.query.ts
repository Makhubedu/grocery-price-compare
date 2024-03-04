// Force the import without types
// @ts-ignore

import puppeteer from "puppeteer";

/**
 * Scrapes Game website for products based on search string.
 *
 * @param searchString - The search string to use.
 *
 * @returns {Promise<SearchOutcome[]>} - The search outcome.
 */
export async function queryMakro(searchString: string) {
  try {

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
      ignoreDefaultArgs: ['--disable-extensions'],
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    const [response] = await Promise.all([
      page.waitForResponse((response: any) => {
        return response.url().startsWith('https://www.makro.co.za/wmapi/bff/graphql/Search') && response.status() === 200 && response.request().method() === 'POST';
      }
      ),
      page.goto(`https://www.makro.co.za/search/?text=${searchString}`)
    ]);

  
    
    const { data: { search : { data: { results: { items } } }} } = await response.json();
    await browser.close();

    return items.map((item: any) => {
        return {
            id: item.itemDetails.itemInfo.itemId,
            name: item.itemDetails.displayName,
            price: item.price?.basePrice || item.price?.originalPrice || item.price?.unitPrice || item.price?.specialPrice || 0,
            brand: item.itemDetails.itemInfo.brand,
            category: item.itemDetails.itemInfo.categories[0].categoryName,
            position: '',
            variant: '',
            list:'',
            unit_sale_price: item.price?.specialPrice || 0,
            stock: item.itemDetails.availability.availableQty,
            product_image_url: item.itemDetails.itemInfo.images.primaryImages.large,
        };
    });

  } catch (error) {
    console.log(error);
    throw error;
  }
}
