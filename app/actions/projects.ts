'use server';

import { auth } from '@clerk/nextjs/server';
import { type Project } from '@prisma/client';
import {
  getProjectsByOwner,
  getProjectById,
  createProject as dbCreateProject,
} from '@/lib/db/projects';

export type ActionResult<T> =
  | { success: true; project: T }
  | { success: false; error: string };

interface CreateProjectInput {
  name: string;
  description?: string;
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

export async function createProject(
  input: CreateProjectInput,
): Promise<ActionResult<Project>> {
  try {
    const userId = await requireUserId();
    const project = await dbCreateProject({
      name: input.name,
      ownerId: userId,
      ...(input.description !== undefined && { description: input.description }),
    });
    return { success: true, project };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
