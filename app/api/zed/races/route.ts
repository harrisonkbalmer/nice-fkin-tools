import { NextRequest, NextResponse } from 'next/server';
import { getCachedAllRaces, getCachedMonthRaces } from '@/lib/zed-races-cache';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode');
  const month = searchParams.get('month') ?? '2026-04';

  const result = mode === 'alltime'
    ? await getCachedAllRaces()
    : await getCachedMonthRaces(month);

  return NextResponse.json(result);
}
