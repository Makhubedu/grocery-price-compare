import { queryShoprite } from '../(services)/shoprite.query';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const searchText = searchParams.get('search');

  if (!searchText) {
    return new Response('Please provide a search query', { status: 400 });
  }

  return new Response('Hello World, Spar', { status: 200 });
}
