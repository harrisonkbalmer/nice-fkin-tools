// app/api/horses-by-user/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://partner-api.zedchampions.com';
const QUERY_HASH = 'd0480a8f3987cf0d27a333647abce137a7573074ffd766864315b05080ee55d4';
const CLIENT_NAME = 'partner-api-v11';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const skipStr = request.nextUrl.searchParams.get('skip') || '0';
  const skip = parseInt(skipStr, 10);

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  const extensions = encodeURIComponent(
    JSON.stringify({
      persistedQuery: { version: 1, sha256Hash: QUERY_HASH },
    })
  );

  const variables = encodeURIComponent(
    JSON.stringify({
      userId,
      skip,
      state: null,
    })
  );

  const url = `${API_BASE}?extensions=${extensions}&variables=${variables}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.ZED_API_KEY}`,
        'graphql-client-name': CLIENT_NAME,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ZED API failed: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `ZED API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors?.length > 0) {
      return NextResponse.json(
        { error: data.errors.map((e: any) => e.message).join('; ') },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Proxy fetch error:', err);
    return NextResponse.json({ error: 'Internal proxy error' }, { status: 500 });
  }
}