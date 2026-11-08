'use client';

import React, { useActionState } from 'react';
import { updateProject } from '@/app/actions/projects';
import type { ActionResult } from '@/app/actions/projects';
import type { Project } from '@prisma/client';

type FormState = ActionResult<Project> | null;

export async function formAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = ((formData.get('name') as string | null) ?? '').trim();
  if (!name) return { success: false, error: 'El nombre es requerido' };

  const projectId = formData.get('projectId') as string;
  const descriptionRaw = ((formData.get('description') as string | null) ?? '').trim();
  const description = descriptionRaw === '' ? null : descriptionRaw;

  try {
    return await updateProject(projectId, { name, description });
  } catch {
    return { success: false, error: 'Error inesperado. Intente nuevamente.' };
  }
}

interface Props {
  project: Project;
}

export default function EditProjectForm({ project }: Props): React.ReactElement {
  const [state, dispatch, isPending] = useActionState(formAction, null);

  return (
    <form action={dispatch}>
      <input type="hidden" name="projectId" value={project.id} />
      <label htmlFor="edit-project-name">Nombre del proyecto</label>
      <input
        id="edit-project-name"
        name="name"
        type="text"
        defaultValue={project.name}
        disabled={isPending}
      />
      <label htmlFor="edit-project-description">Descripción</label>
      <textarea
        id="edit-project-description"
        name="description"
        defaultValue={project.description ?? ''}
        disabled={isPending}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Guardando...' : 'Guardar cambios'}
      </button>
      {state !== null && (
        state.success ? (
          <p>Proyecto actualizado exitosamente</p>
        ) : (
          <p role="alert">{state.error}</p>
        )
      )}
    </form>
  );
}
