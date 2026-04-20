import { NextRequest, NextResponse } from 'next/server';
import { bustCache, getCachedAllRaces, getCachedMonthRaces } from '@/lib/zed-races-cache';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  bustCache();

  const currentMonth = new Date().toISOString().slice(0, 7);
  await Promise.all([
    getCachedAllRaces(),
    getCachedMonthRaces(currentMonth),
  ]);

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
    month: currentMonth,
  });
}
