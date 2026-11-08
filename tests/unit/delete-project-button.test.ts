import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

const mockDeleteProject = vi.hoisted(() => vi.fn());

vi.mock('@/app/actions/projects', () => ({
  deleteProject: mockDeleteProject,
}));

describe('DeleteProjectButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('renders delete button', async () => {
    const { default: DeleteProjectButton } = await import('@/components/DeleteProjectButton');
    const { getByRole } = render(React.createElement(DeleteProjectButton, { projectId: 'proj_1' }));

    expect(getByRole('button', { name: /eliminar/i })).toBeDefined();
  });

  it('calls deleteProject when confirmed', async () => {
    mockDeleteProject.mockResolvedValueOnce({ success: true, project: {} });
    const { default: DeleteProjectButton } = await import('@/components/DeleteProjectButton');
    const { getByRole } = render(React.createElement(DeleteProjectButton, { projectId: 'proj_1' }));

    fireEvent.click(getByRole('button', { name: /eliminar/i }));

    await waitFor(() => {
      expect(mockDeleteProject).toHaveBeenCalledWith('proj_1');
    });
  });

  it('does not call deleteProject when cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { default: DeleteProjectButton } = await import('@/components/DeleteProjectButton');
    const { getByRole } = render(React.createElement(DeleteProjectButton, { projectId: 'proj_1' }));

    fireEvent.click(getByRole('button', { name: /eliminar/i }));

    expect(mockDeleteProject).not.toHaveBeenCalled();
  });

  it('button is disabled while pending', async () => {
    let resolveDelete!: (value: unknown) => void;
    mockDeleteProject.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveDelete = resolve;
      }),
    );
    const { default: DeleteProjectButton } = await import('@/components/DeleteProjectButton');
    const { getByRole } = render(React.createElement(DeleteProjectButton, { projectId: 'proj_1' }));

    fireEvent.click(getByRole('button', { name: /eliminar/i }));

    await waitFor(() => {
      expect(getByRole('button', { name: /eliminando/i })).toBeDefined();
    });

    resolveDelete({ success: true, project: {} });
  });
});
