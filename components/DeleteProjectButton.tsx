'use client';

import React, { useTransition } from 'react';
import { deleteProject } from '@/app/actions/projects';

interface Props {
  projectId: string;
}

export default function DeleteProjectButton({ projectId }: Props): React.ReactElement {
  const [isPending, startTransition] = useTransition();

  function handleDelete(): void {
    if (!window.confirm('¿Eliminar proyecto? Esta acción no se puede deshacer desde la aplicación.')) {
      return;
    }
    startTransition(async () => {
      await deleteProject(projectId);
    });
  }

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
