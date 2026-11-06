import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

const mockAuth = vi.hoisted(() => vi.fn());
const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth,
  clerkMiddleware: vi.fn(() => vi.fn()),
}));
vi.mock('next/navigation', () => ({ redirect: mockRedirect }));
vi.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }): React.ReactElement => React.createElement('div', { 'data-testid': 'clerk-provider' }, children),
}));

describe('middleware config', () => {
  it('matcher covers all routes including api', async () => {
    const { config } = await import('../../middleware');
    expect(config.matcher).toHaveLength(2);
    expect(config.matcher[0]).toContain('(?!_next'); // negative lookahead excludes _next
    expect(config.matcher[1]).toContain('api');
  });
});

describe('RootLayout', () => {
  it('renders children inside ClerkProvider', async () => {
    const { default: RootLayout, metadata } = await import('../../app/layout');
    const jsx = RootLayout({ children: React.createElement('span', null, 'page content') });
    const { getByTestId, getByText } = render(jsx);
    expect(getByTestId('clerk-provider')).toBeDefined();
    expect(getByText('page content')).toBeDefined();
    expect(metadata.title).toBe('IA Factory');
  });
});

describe('AuthLayout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders children when user is authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: 'user_123' });
    const { default: AuthLayout } = await import('../../app/(auth)/layout');
    const jsx = await AuthLayout({ children: React.createElement('span', null, 'protected content') });
    const { getByText } = render(jsx);
    expect(getByText('protected content')).toBeDefined();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('redirects to /sign-in when user is not authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });
    const { default: AuthLayout } = await import('../../app/(auth)/layout');
    await AuthLayout({ children: React.createElement('span', null, 'protected content') });
    expect(mockRedirect).toHaveBeenCalledWith('/sign-in');
  });
});
