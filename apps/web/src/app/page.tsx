'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBrandConfig } from '@/hooks/useBrandConfig';

export default function Home() {
  const router = useRouter();
  const { isOnboarded } = useBrandConfig();

  useEffect(() => {
    if (isOnboarded) {
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
  }, [isOnboarded, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
