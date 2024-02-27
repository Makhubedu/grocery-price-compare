'use server';
import axios from 'axios';
import { load } from 'cheerio';

/**
 * Scrapes Shoprite website for products based on search string.
 *
 * @param searchString - The search string to use.
 *
 */
export async function queryShoprite(searchString: string) {
  try {

    const { data } = await axios.get(`https://www.shoprite.co.za/search/all?q=${searchString}`);

    const $ = load(data);

    const itemsList = $('.product-frame');

    const productList = itemsList.map((i, item) => {
        const dataProductGa = $(item).attr('data-product-ga');

        if (dataProductGa) {
            return JSON.parse(dataProductGa);
        }
    }).get();

    return productList;
  } catch (error) {
    throw error;
  }
}
