import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

const mockChangeProjectStatus = vi.hoisted(() => vi.fn());

vi.mock('@/app/actions/projects', () => ({
  changeProjectStatus: mockChangeProjectStatus,
}));

describe('ChangeProjectStatusButton', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders "Archivar" button when status is ACTIVE', async () => {
    const { default: ChangeProjectStatusButton } = await import(
      '@/components/ChangeProjectStatusButton'
    );
    const { getByRole } = render(
      React.createElement(ChangeProjectStatusButton, {
        projectId: 'proj_1',
        currentStatus: 'ACTIVE',
      }),
    );
    expect(getByRole('button', { name: 'Archivar' })).toBeDefined();
  });

  it('renders "Reactivar" button when status is ARCHIVED', async () => {
    const { default: ChangeProjectStatusButton } = await import(
      '@/components/ChangeProjectStatusButton'
    );
    const { getByRole } = render(
      React.createElement(ChangeProjectStatusButton, {
        projectId: 'proj_1',
        currentStatus: 'ARCHIVED',
      }),
    );
    expect(getByRole('button', { name: 'Reactivar' })).toBeDefined();
  });

  it('calls changeProjectStatus with ARCHIVED when ACTIVE project clicked', async () => {
    mockChangeProjectStatus.mockResolvedValueOnce({ success: true });
    const { default: ChangeProjectStatusButton } = await import(
      '@/components/ChangeProjectStatusButton'
    );
    const { getByRole } = render(
      React.createElement(ChangeProjectStatusButton, {
        projectId: 'proj_1',
        currentStatus: 'ACTIVE',
      }),
    );
    fireEvent.click(getByRole('button'));
    expect(mockChangeProjectStatus).toHaveBeenCalledWith('proj_1', 'ARCHIVED');
  });

  it('calls changeProjectStatus with ACTIVE when ARCHIVED project clicked', async () => {
    mockChangeProjectStatus.mockResolvedValueOnce({ success: true });
    const { default: ChangeProjectStatusButton } = await import(
      '@/components/ChangeProjectStatusButton'
    );
    const { getByRole } = render(
      React.createElement(ChangeProjectStatusButton, {
        projectId: 'proj_1',
        currentStatus: 'ARCHIVED',
      }),
    );
    fireEvent.click(getByRole('button'));
    expect(mockChangeProjectStatus).toHaveBeenCalledWith('proj_1', 'ACTIVE');
  });

  it('button is not disabled initially', async () => {
    const { default: ChangeProjectStatusButton } = await import(
      '@/components/ChangeProjectStatusButton'
    );
    const { getByRole } = render(
      React.createElement(ChangeProjectStatusButton, {
        projectId: 'proj_1',
        currentStatus: 'ACTIVE',
      }),
    );
    const button = getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });
});
