// app/tools/zed-augments/page.tsx
import { getAllAugments, type Augment } from '@/lib/augments';
import ZedAugmentsClient from './ZedAugmentsClient';

export default function ZedAugments() {
  const augments = getAllAugments();

  return <ZedAugmentsClient initialAugments={augments} />;
}