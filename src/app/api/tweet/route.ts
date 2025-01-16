import { NextResponse } from 'next/server';

export const runtime = 'edge';

const generateToken = () => {
  return Math.random().toString(36).slice(-10);
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing tweet ID' }, { status: 400 });
  }

  if (!/^\d{19}$/.test(id)) {
    return NextResponse.json(
      { error: 'Tweet ID must be 19 digits' },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=${generateToken()}`,
    {
      headers: {
        Accept: 'application/json',
        Origin: 'https://platform.twitter.com',
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
