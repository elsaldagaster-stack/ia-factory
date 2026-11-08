'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { type Project } from '@prisma/client';
import {
  getProjectsByOwner,
  getProjectById,
  createProject as dbCreateProject,
  deleteProject as dbDeleteProject,
  updateProject as dbUpdateProject,
  type ProjectStatus,
} from '@/lib/db/projects';

export type ActionResult<T> =
  | { success: true; project: T }
  | { success: false; error: string };

interface CreateProjectInput {
  name: string;
  description?: string;
}

interface UpdateProjectInput {
  name: string;
  description?: string | null;
}

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  return userId;
}

export async function getProjects(): Promise<Project[]> {
  const userId = await requireUserId();
  return getProjectsByOwner(userId);
}

export async function getProject(projectId: string): Promise<Project | null> {
  const userId = await requireUserId();
  return getProjectById(projectId, userId);
}

export async function changeProjectStatus(
  projectId: string,
  newStatus: ProjectStatus,
): Promise<ActionResult<Project>> {
  try {
    const userId = await requireUserId();
    const project = await dbUpdateProject(projectId, userId, { status: newStatus });
    if (!project) return { success: false, error: 'Proyecto no encontrado' };
    revalidatePath('/projects');
    revalidatePath(`/projects/${projectId}`);
    return { success: true, project };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function deleteProject(projectId: string): Promise<ActionResult<Project>> {
  try {
    const userId = await requireUserId();
    const project = await dbDeleteProject(projectId, userId);
    if (!project) return { success: false, error: 'Proyecto no encontrado' };
    revalidatePath('/projects');
    return { success: true, project };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
): Promise<ActionResult<Project>> {
  try {
    if (!input.name.trim()) {
      return { success: false, error: 'El nombre es requerido' };
    }
    const userId = await requireUserId();
    const project = await dbUpdateProject(projectId, userId, {
      name: input.name,
      description: input.description,
    });
    if (!project) return { success: false, error: 'Proyecto no encontrado' };
    revalidatePath('/projects');
    revalidatePath(`/projects/${projectId}`);
    return { success: true, project };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function createProject(
  input: CreateProjectInput,
): Promise<ActionResult<Project>> {
  try {
    if (!input.name.trim()) {
      return { success: false, error: 'El nombre es requerido' };
    }
    const userId = await requireUserId();
    const project = await dbCreateProject({
      name: input.name,
      ownerId: userId,
      ...(input.description !== undefined && { description: input.description }),
    });
    revalidatePath('/projects');
    return { success: true, project };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
