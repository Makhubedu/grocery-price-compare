import { NextResponse } from 'next/server';
import { game } from '../(services)/game.query';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchText = searchParams.get('search');

  if (!searchText) {
    return new Response('Please provide a search query', { status: 400 });
  }

  try {
    const result = await game(searchText);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went fetching the data' },
      { status: 500 },
    );
  }
}
