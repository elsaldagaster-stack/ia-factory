import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import type { getProjects } from '@/app/actions/projects';

const mockGetProjects = vi.hoisted(() => vi.fn());

vi.mock('@/app/actions/projects', () => ({
  getProjects: mockGetProjects,
}));

type Project = Awaited<ReturnType<typeof getProjects>>[number];

const projectFixture: Project = {
  id: 'proj_1',
  name: 'Test Project',
  description: null,
  status: 'ACTIVE',
  ownerId: 'user_abc123',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('ProjectsPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders project list when projects exist', async () => {
    mockGetProjects.mockResolvedValueOnce([projectFixture]);
    const { default: ProjectsPage } = await import('@/app/(auth)/projects/page');
    const jsx = await ProjectsPage();
    const { getByText } = render(jsx);
    expect(getByText('Test Project')).toBeDefined();
  });

  it('renders project names as links to detail page', async () => {
    mockGetProjects.mockResolvedValueOnce([projectFixture]);
    const { default: ProjectsPage } = await import('@/app/(auth)/projects/page');
    const jsx = await ProjectsPage();
    const { getByRole } = render(jsx);
    const link = getByRole('link', { name: 'Test Project' });
    expect(link).toBeDefined();
    expect((link as HTMLAnchorElement).href).toContain('/projects/proj_1');
  });

  it('renders empty state when no projects', async () => {
    mockGetProjects.mockResolvedValueOnce([]);
    const { default: ProjectsPage } = await import('@/app/(auth)/projects/page');
    const jsx = await ProjectsPage();
    const { getByText } = render(jsx);
    expect(getByText('Proyectos')).toBeDefined();
    expect(getByText('Aún no tenés proyectos')).toBeDefined();
  });
});
