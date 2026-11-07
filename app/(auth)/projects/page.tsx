import React from 'react';
import { getProjects } from '@/app/actions/projects';

export default async function ProjectsPage(): Promise<React.ReactElement> {
  const projects = await getProjects();

  return (
    <div>
      <h1>Proyectos</h1>
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
