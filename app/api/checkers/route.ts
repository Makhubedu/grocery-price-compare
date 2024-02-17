import { NextResponse } from "next/server";
import { queryCheckers } from "../(services)/checkers.query";

export async function GET(req: Request, res: Response) {

    const { searchParams } = new URL(req.url)

    const searchText = searchParams.get('search');

    if (!searchText) {
        return new Response('Please provide a search query', { status: 400 })
    }

    try {
        const result  = await queryCheckers(searchText);
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        
    }
  }