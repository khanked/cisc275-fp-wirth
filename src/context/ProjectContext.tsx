import React, { createContext, useContext, useState } from "react";
import type { Project, Page, Route, StateModel, Annotation } from "../models/types";
import { saveProject } from "../services/storage";

interface ProjectContextType {
  project: Project;
  updateProject: (updates: Partial<Project>) => void;
  addPage: (page: Page) => void;
  updatePage: (page: Page) => void;
  deletePage: (pageId: string) => void;
  addRoute: (route: Route) => void;
  deleteRoute: (routeId: string) => void;
  updateStateModel: (model: StateModel) => void;
  addAnnotation: (ann: Annotation) => void;
  updateAnnotation: (ann: Annotation) => void;
  deleteAnnotation: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({
  project: initial,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const [project, setProject] = useState<Project>(initial);

  function update(next: Project): void {
    setProject(next);
    saveProject(next);
  }

  function updateProject(updates: Partial<Project>): void {
    update({ ...project, ...updates, lastModified: new Date().toISOString() });
  }

  function addPage(page: Page): void {
    update({
      ...project,
      pages: [...project.pages, page],
      lastModified: new Date().toISOString(),
    });
  }

  function updatePage(page: Page): void {
    update({
      ...project,
      pages: project.pages.map((p) => (p.id === page.id ? page : p)),
      lastModified: new Date().toISOString(),
    });
  }

  function deletePage(pageId: string): void {
    update({
      ...project,
      pages: project.pages.filter((p) => p.id !== pageId),
      routes: project.routes.filter(
        (r) => r.fromPageId !== pageId && r.toPageId !== pageId
      ),
      lastModified: new Date().toISOString(),
    });
  }

  function addRoute(route: Route): void {
    update({
      ...project,
      routes: [...project.routes, route],
      lastModified: new Date().toISOString(),
    });
  }

  function deleteRoute(routeId: string): void {
    update({
      ...project,
      routes: project.routes.filter((r) => r.id !== routeId),
      lastModified: new Date().toISOString(),
    });
  }

  function updateStateModel(model: StateModel): void {
    update({
      ...project,
      stateModel: model,
      lastModified: new Date().toISOString(),
    });
  }

  function addAnnotation(ann: Annotation): void {
    update({
      ...project,
      annotations: [...project.annotations, ann],
      lastModified: new Date().toISOString(),
    });
  }

  function updateAnnotation(ann: Annotation): void {
    update({
      ...project,
      annotations: project.annotations.map((a) => (a.id === ann.id ? ann : a)),
      lastModified: new Date().toISOString(),
    });
  }

  function deleteAnnotation(id: string): void {
    update({
      ...project,
      annotations: project.annotations.filter((a) => a.id !== id),
      lastModified: new Date().toISOString(),
    });
  }

  const value: ProjectContextType = {
    project,
    updateProject,
    addPage,
    updatePage,
    deletePage,
    addRoute,
    deleteRoute,
    updateStateModel,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProject(): ProjectContextType {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}
