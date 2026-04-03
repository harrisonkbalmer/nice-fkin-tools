import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://partner-api.zedchampions.com';
const QUERY_HASH = 'ef9e277a75eb08e549ce1d70c92da785310a3fb8bd58fb99440d65f264fcd17c';
const CLIENT_NAME = 'partner-api-v11';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing horse id' }, { status: 400 });
  }

  // Build the persisted query URL
  const extensions = encodeURIComponent(
    JSON.stringify({
      persistedQuery: { version: 1, sha256Hash: QUERY_HASH },
    })
  );

  const variables = encodeURIComponent(JSON.stringify({ id }));

  const url = `${API_URL}?extensions=${extensions}&variables=${variables}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.ZED_API_KEY}`,
        'graphql-client-name': CLIENT_NAME,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fresh data for testing
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Optional: Flatten or transform data if needed (e.g., handle errors in data.errors)
    if (data.errors) {
      return NextResponse.json({ error: data.errors }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Horse API fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch horse data' }, { status: 500 });
  }
}