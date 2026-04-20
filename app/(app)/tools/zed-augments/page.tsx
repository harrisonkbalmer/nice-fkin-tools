// app/tools/zed-augments/page.tsx
import { getAllAugments } from '@/lib/augments';
import type { Augment } from '@/lib/augments-utils';
import ZedAugmentsClient from './ZedAugmentsClient';

export default function ZedAugments() {
  const augments = getAllAugments();

  return <ZedAugmentsClient initialAugments={augments} />;
  
}