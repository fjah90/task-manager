'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/lib/api-client';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(tokenStorage.get() ? '/tasks' : '/login');
  }, [router]);
  return null;
}
