import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import type { Project } from "../models/types";
import {
  loadProjects,
  saveProjects,
  deleteProject,
} from "../services/storage";
import { demoProjects } from "../services/demoProjects";

export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let loaded = loadProjects();
    if (loaded.length === 0) {
      saveProjects(demoProjects);
      loaded = demoProjects;
    }
    setProjects(loaded);
  }, []);

  function handleNew(): void {
    const newProject: Project = {
      id: uuidv4(),
      name: "New Project",
      description: "A new Drafter project",
      lastModified: new Date().toISOString(),
      pages: [],
      routes: [],
      stateModel: {
        primary: { name: "State", attributes: [] },
        secondary: { name: "Secondary", attributes: [] },
      },
      annotations: [],
    };
    const updated = [...projects, newProject];
    saveProjects(updated);
    setProjects(updated);
    void navigate(`/project/${newProject.id}`);
  }

  function handleDelete(id: string): void {
    deleteProject(id);
    setProjects(loadProjects());
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Drafter Drafter</h1>
        <p className="dashboard-subtitle">
          Visual designer for Python Drafter applications
        </p>
      </header>
      <div className="dashboard-toolbar">
        <button className="btn btn-primary" onClick={handleNew}>
          + New Project
        </button>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => void navigate(`/project/${project.id}`)}
          >
            <div className="project-card-body">
              <h2 className="project-name">{project.name}</h2>
              <p className="project-description">{project.description}</p>
              <p className="project-meta">
                Last modified:{" "}
                {new Date(project.lastModified).toLocaleDateString()}
              </p>
            </div>
            <div className="project-card-footer">
              <button
                className="btn btn-danger btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(project.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && (
        <div className="empty-state">
          <p>No projects yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
