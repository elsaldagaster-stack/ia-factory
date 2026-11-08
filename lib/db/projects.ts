import { type Project, type ProjectStatus } from '@prisma/client';
import { prisma } from './client';

export type { Project, ProjectStatus };

export interface CreateProjectData {
  name: string;
  ownerId: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export async function getProjectsByOwner(ownerId: string): Promise<Project[]> {
  return prisma.project.findMany({
    where: { ownerId, status: { not: 'DELETED' } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createProject(data: CreateProjectData): Promise<Project> {
  return prisma.project.create({
    data,
  });
}

export async function getProjectById(
  id: string,
  ownerId: string,
): Promise<Project | null> {
  return prisma.project.findFirst({
    where: { id, ownerId, status: { not: 'DELETED' } },
  });
}

export async function deleteProject(
  id: string,
  ownerId: string,
): Promise<Project | null> {
  try {
    return await prisma.project.update({
      where: { id, ownerId },
      data: { status: 'DELETED' },
    });
  } catch (err) {
    if ((err as { code?: string }).code === 'P2025') {
      return null;
    }
    throw err;
  }
}

export async function updateProject(
  id: string,
  ownerId: string,
  data: UpdateProjectData,
): Promise<Project | null> {
  try {
    return await prisma.project.update({
      where: { id, ownerId },
      data,
    });
  } catch (err) {
    if ((err as { code?: string }).code === 'P2025') {
      return null;
    }
    throw err;
  }
}
