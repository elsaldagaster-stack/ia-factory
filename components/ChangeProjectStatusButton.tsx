'use client';

import React, { useTransition } from 'react';
import { changeProjectStatus } from '@/app/actions/projects';
import type { ProjectStatus } from '@/lib/db/projects';

interface Props {
  projectId: string;
  currentStatus: Extract<ProjectStatus, 'ACTIVE' | 'ARCHIVED'>;
}

export default function ChangeProjectStatusButton({
  projectId,
  currentStatus,
}: Props): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const newStatus: ProjectStatus = currentStatus === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
  const label = currentStatus === 'ACTIVE' ? 'Archivar' : 'Reactivar';

  function handleClick(): void {
    startTransition(async () => {
      await changeProjectStatus(projectId, newStatus);
    });
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? '...' : label}
    </button>
  );
}
