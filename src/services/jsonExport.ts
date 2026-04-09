import type { Project } from "../models/types";

export function exportProject(project: Project): string {
  return JSON.stringify(project, null, 2);
}

export function importProject(json: string): Project {
  return JSON.parse(json) as Project;
}
