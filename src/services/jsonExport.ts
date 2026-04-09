import type { Project } from "../models/types";
import { isProject } from "../models/types";

export function exportProject(project: Project): string {
  return JSON.stringify(project, null, 2);
}

export function importProject(json: string): Project {
  let parsed: object | null;
  try {
    parsed = JSON.parse(json) as object | null;
  } catch {
    throw new Error("Invalid JSON: could not parse file.");
  }
  if (!isProject(parsed)) {
    throw new Error(
      "Invalid project format: file does not contain a valid Drafter Drafter project."
    );
  }
  return parsed;
}
