'use server';
import axios from 'axios';

/**
 * Scrapes Pick n Pay website for products based on search string.
 *
 * @param searchString - The search string to use.
 *
 * @returns {Promise<SearchOutcome[]>} - The search outcome.
 */
export async function queryPickNPay(searchString: string) {
  try {

    const { data } = await axios.get('https://www.pnp.co.za/pnphybris/v2/pnp-spa/products/search', {
      params: {
        query: searchString,
        pageSize: 72,
        storeCode: 'WC44',
        lang: 'en',
        curr: 'ZAR',
      },
    });

    const productList = data.products.map((product: any) => {
      return {
        id: product.code,
        name: product.name,
        price: product.price.value,
        brand: product.brandSellerId,
        category: '',
        position: '',
        variant: '',
        list:'',
        unit_sale_price: product.price.formattedValue,
        stock: product.stock.stockLevelStatus,
        product_image_url: product.images[2].url,
      };
    });

    return productList;
  } catch (error) {
    throw error;
  }
}
