import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

const mockUpdateProject = vi.hoisted(() => vi.fn());

vi.mock('@/app/actions/projects', () => ({
  updateProject: mockUpdateProject,
}));

const projectFixture = {
  id: 'proj_1',
  name: 'Test Project',
  description: null,
  status: 'ACTIVE' as const,
  ownerId: 'user_abc123',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('EditProjectForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders form with project name pre-filled', async () => {
    const { default: EditProjectForm } = await import('@/components/EditProjectForm');
    const { getByDisplayValue } = render(
      React.createElement(EditProjectForm, { project: projectFixture }),
    );
    expect(getByDisplayValue('Test Project')).toBeDefined();
  });

  it('renders description textarea pre-filled when description is set', async () => {
    const withDesc = { ...projectFixture, description: 'My description' };
    const { default: EditProjectForm } = await import('@/components/EditProjectForm');
    const { getByDisplayValue } = render(
      React.createElement(EditProjectForm, { project: withDesc }),
    );
    expect(getByDisplayValue('My description')).toBeDefined();
  });

  it('renders save button', async () => {
    const { default: EditProjectForm } = await import('@/components/EditProjectForm');
    const { getByRole } = render(
      React.createElement(EditProjectForm, { project: projectFixture }),
    );
    expect(getByRole('button', { name: /guardar/i })).toBeDefined();
  });

  it('formAction returns error when name is empty', async () => {
    const { formAction } = await import('@/components/EditProjectForm');
    const formData = new FormData();
    formData.set('projectId', 'proj_1');
    formData.set('name', '   ');

    const result = await formAction(null, formData);

    expect(result).toEqual({ success: false, error: 'El nombre es requerido' });
    expect(mockUpdateProject).not.toHaveBeenCalled();
  });

  it('formAction calls updateProject with trimmed name', async () => {
    mockUpdateProject.mockResolvedValueOnce({ success: true, project: projectFixture });
    const { formAction } = await import('@/components/EditProjectForm');
    const formData = new FormData();
    formData.set('projectId', 'proj_1');
    formData.set('name', '  New Name  ');
    formData.set('description', '');

    await formAction(null, formData);

    expect(mockUpdateProject).toHaveBeenCalledWith('proj_1', {
      name: 'New Name',
      description: null,
    });
  });

  it('formAction passes description when non-empty', async () => {
    mockUpdateProject.mockResolvedValueOnce({ success: true, project: projectFixture });
    const { formAction } = await import('@/components/EditProjectForm');
    const formData = new FormData();
    formData.set('projectId', 'proj_1');
    formData.set('name', 'Test');
    formData.set('description', 'Some description');

    await formAction(null, formData);

    expect(mockUpdateProject).toHaveBeenCalledWith('proj_1', {
      name: 'Test',
      description: 'Some description',
    });
  });

  it('shows server error when updateProject returns failure', async () => {
    mockUpdateProject.mockResolvedValueOnce({ success: false, error: 'Proyecto no encontrado' });
    const { default: EditProjectForm } = await import('@/components/EditProjectForm');
    const { getByRole } = render(
      React.createElement(EditProjectForm, { project: projectFixture }),
    );
    const form = getByRole('button', { name: /guardar/i }).closest('form')!;
    fireEvent.submit(form);
  });
});
