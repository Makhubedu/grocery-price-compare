"use server"

import { SearchOutcome } from "../(@types)/SearchOutcome";
import puppeteer from "puppeteer";


/**
 * Scrapes Shoprite website for products based on search string.
 * 
 * @param searchString - The search string to use.
 * 
 */
export async function queryShoprite(searchString: string) {

    let browser;

    try {
        
        // Launch the browser and open a new blank page
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        await browser.userAgent();

        const page = await browser.newPage();

        await page.setViewport({ width: 1280, height: 800 });


        // Navigate the page to a URL and wait for the dom to be rendered.
        await page.goto(`https://www.shoprite.co.za/search/all?q=${searchString}`, {
            waitUntil: 'domcontentloaded'
        });

        const productList = await page.evaluate(() => {
            const itemsList =Array.from(document.querySelectorAll('.product-frame'));

            return itemsList.map(item => {
                const dataProductGa = item.getAttribute('data-product-ga');

                const replacedString = dataProductGa?.replace(/&quot;/g, '"');

               if (replacedString) {
                return JSON.parse(replacedString);
               }

            });
        });;

        // Close the browser
        await browser.close();

        return productList;

    } catch (error) {

       throw error;
        
    } finally {
        // Close the browser
    
    }

}