import React from 'react';
import { getProjects } from '@/app/actions/projects';
import CreateProjectForm from '@/components/CreateProjectForm';

export default async function ProjectsPage(): Promise<React.ReactElement> {
  const projects = await getProjects();

  return (
    <div>
      <h1>Proyectos</h1>
      <CreateProjectForm />
      {projects.length === 0 ? (
        <p>Aún no tenés proyectos</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
