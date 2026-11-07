import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import type { ActionResult } from '@/app/actions/projects';
import type { Project } from '@prisma/client';

const mockCreateProject = vi.hoisted(() => vi.fn());

vi.mock('@/app/actions/projects', () => ({
  createProject: mockCreateProject,
}));

const projectFixture: Project = {
  id: 'proj_1',
  name: 'Test Project',
  description: null,
  status: 'ACTIVE',
  ownerId: 'user_abc123',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('formAction', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns error without calling createProject when name is empty', async () => {
    const { formAction } = await import('@/components/CreateProjectForm');
    const fd = new FormData();
    fd.set('name', '');
    const result = await formAction(null, fd);
    expect(result).toEqual({ success: false, error: 'El nombre es requerido' });
    expect(mockCreateProject).not.toHaveBeenCalled();
  });

  it('calls createProject with trimmed name', async () => {
    const { formAction } = await import('@/components/CreateProjectForm');
    const fd = new FormData();
    fd.set('name', '  Test Project  ');
    mockCreateProject.mockResolvedValueOnce({ success: true, project: projectFixture });
    await formAction(null, fd);
    expect(mockCreateProject).toHaveBeenCalledWith({ name: 'Test Project' });
  });

  it('returns success result from createProject', async () => {
    const { formAction } = await import('@/components/CreateProjectForm');
    const fd = new FormData();
    fd.set('name', 'Test Project');
    const expected: ActionResult<Project> = { success: true, project: projectFixture };
    mockCreateProject.mockResolvedValueOnce(expected);
    const result = await formAction(null, fd);
    expect(result).toEqual(expected);
  });

  it('returns error result from createProject', async () => {
    const { formAction } = await import('@/components/CreateProjectForm');
    const fd = new FormData();
    fd.set('name', 'Test Project');
    const expected: ActionResult<Project> = { success: false, error: 'DB error' };
    mockCreateProject.mockResolvedValueOnce(expected);
    const result = await formAction(null, fd);
    expect(result).toEqual(expected);
  });
});

describe('CreateProjectForm', () => {
  it('renders name input and submit button', async () => {
    const { default: CreateProjectForm } = await import('@/components/CreateProjectForm');
    const { getByRole } = render(React.createElement(CreateProjectForm));
    expect(getByRole('textbox')).toBeDefined();
    expect(getByRole('button', { name: /crear proyecto/i })).toBeDefined();
  });
});
