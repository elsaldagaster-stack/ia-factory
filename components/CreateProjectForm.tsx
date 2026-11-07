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
  return createProject({ name });
}

export default function CreateProjectForm(): React.ReactElement {
  const [state, dispatch, isPending] = useActionState(formAction, null);

  return (
    <form action={dispatch}>
      <input
        name="name"
        type="text"
        placeholder="Nombre del proyecto"
        disabled={isPending}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creando...' : 'Crear proyecto'}
      </button>
      {state?.success === false && <p role="alert">{state.error}</p>}
      {state?.success === true && <p>Proyecto creado exitosamente</p>}
    </form>
  );
}
