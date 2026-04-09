import {
  loadProjects,
  saveProject,
  loadProject,
  deleteProject,
} from "../src/services/storage";
import type { Project } from "../src/models/types";
import { importProject } from "../src/services/jsonExport";

const mockProject: Project = {
  id: "test-1",
  name: "Test Project",
  description: "A test",
  lastModified: "2024-01-01",
  pages: [],
  routes: [],
  stateModel: {
    primary: { name: "State", attributes: [] },
    secondary: { name: "Secondary", attributes: [] },
  },
  annotations: [],
};

beforeEach(() => {
  localStorage.clear();
});

test("loadProjects returns empty array when nothing stored", () => {
  expect(loadProjects()).toEqual([]);
});

test("saveProject and loadProject work", () => {
  saveProject(mockProject);
  expect(loadProject("test-1")).toEqual(mockProject);
});

test("deleteProject removes a project", () => {
  saveProject(mockProject);
  deleteProject("test-1");
  expect(loadProject("test-1")).toBeNull();
});

test("loadProjects skips invalid entries in localStorage", () => {
  localStorage.setItem("drafter-drafter-projects", JSON.stringify([{ bad: "data" }]));
  expect(loadProjects()).toEqual([]);
});

test("importProject throws on invalid JSON string", () => {
  expect(() => importProject("not json")).toThrow("Invalid JSON");
});

test("importProject throws on valid JSON but invalid project schema", () => {
  expect(() => importProject(JSON.stringify({ id: "x" }))).toThrow("Invalid project format");
});
