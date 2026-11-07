'use client';

import React, { useActionState } from 'react';
import { createProject } from '@/app/actions/projects';
import type { ActionResult } from '@/app/actions/projects';
import type { Project } from '@prisma/client';

type FormState = ActionResult<Project> | null;

export async function formAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = ((formData.get('name') as string | null) ?? '').trim();
  if (!name) {
    return { success: false, error: 'El nombre es requerido' };
  }
  try {
    return await createProject({ name });
  } catch {
    return { success: false, error: 'Error inesperado. Intente nuevamente.' };
  }
}

export default function CreateProjectForm(): React.ReactElement {
  const [state, dispatch, isPending] = useActionState(formAction, null);
  const successKey = state !== null && state.success === true ? state.project.id : '';

  return (
    <form action={dispatch} key={successKey}>
      <label htmlFor="project-name">Nombre del proyecto</label>
      <input
        id="project-name"
        name="name"
        type="text"
        placeholder="Nombre del proyecto"
        disabled={isPending}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creando...' : 'Crear proyecto'}
      </button>
      {state !== null && (
        state.success
          ? <p>Proyecto creado exitosamente</p>
          : <p role="alert">{state.error}</p>
      )}
    </form>
  );
}
