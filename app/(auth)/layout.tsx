import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }): Promise<React.ReactElement> {
  const { userId } = await auth();
  if (!userId) return redirect('/sign-in');
  return <>{children}</>;
}
