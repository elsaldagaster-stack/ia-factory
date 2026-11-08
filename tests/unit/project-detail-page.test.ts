import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import type { getProject } from '@/app/actions/projects';

const mockGetProject = vi.hoisted(() => vi.fn());
const mockNotFound = vi.hoisted(() => vi.fn(() => { throw new Error('NEXT_NOT_FOUND'); }));

vi.mock('@/app/actions/projects', () => ({
  getProject: mockGetProject,
}));
vi.mock('next/navigation', () => ({ notFound: mockNotFound }));

type Project = Awaited<ReturnType<typeof getProject>>;

const projectFixture = {
  id: 'proj_1',
  name: 'Test Project',
  description: 'A test description',
  status: 'ACTIVE',
  ownerId: 'user_abc123',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
} satisfies NonNullable<Project>;

describe('ProjectDetailPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders project name and status', async () => {
    mockGetProject.mockResolvedValueOnce(projectFixture);
    const { default: ProjectDetailPage } = await import('@/app/(auth)/projects/[id]/page');
    const jsx = await ProjectDetailPage({ params: Promise.resolve({ id: 'proj_1' }) });
    const { getByText } = render(jsx);
    expect(getByText('Test Project')).toBeDefined();
    expect(getByText('ACTIVE')).toBeDefined();
  });

  it('renders description when present', async () => {
    mockGetProject.mockResolvedValueOnce(projectFixture);
    const { default: ProjectDetailPage } = await import('@/app/(auth)/projects/[id]/page');
    const jsx = await ProjectDetailPage({ params: Promise.resolve({ id: 'proj_1' }) });
    const { getByText } = render(jsx);
    expect(getByText('A test description', { selector: 'p' })).toBeDefined();
  });

  it('renders back link to /projects', async () => {
    mockGetProject.mockResolvedValueOnce(projectFixture);
    const { default: ProjectDetailPage } = await import('@/app/(auth)/projects/[id]/page');
    const jsx = await ProjectDetailPage({ params: Promise.resolve({ id: 'proj_1' }) });
    const { getByRole } = render(jsx);
    const link = getByRole('link', { name: /proyectos/i });
    expect(link).toBeDefined();
  });

  it('calls notFound when project does not exist', async () => {
    mockGetProject.mockResolvedValueOnce(null);
    const { default: ProjectDetailPage } = await import('@/app/(auth)/projects/[id]/page');
    await expect(
      ProjectDetailPage({ params: Promise.resolve({ id: 'nonexistent' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalled();
  });
});
