import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject } from '@/app/actions/projects';
import ChangeProjectStatusButton from '@/components/ChangeProjectStatusButton';
import DeleteProjectButton from '@/components/DeleteProjectButton';
import EditProjectForm from '@/components/EditProjectForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props): Promise<React.ReactElement> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) return notFound();

  return (
    <div>
      <Link href="/projects">Proyectos</Link>
      <h1>{project.name}</h1>
      <p>{project.status}</p>
      {project.description !== null && <p>{project.description}</p>}
      {(project.status === 'ACTIVE' || project.status === 'ARCHIVED') && (
        <ChangeProjectStatusButton projectId={project.id} currentStatus={project.status} />
      )}
      <DeleteProjectButton projectId={id} />
      <EditProjectForm project={project} />
    </div>
  );
}
