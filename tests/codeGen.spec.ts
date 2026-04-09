import { generateCode } from "../src/services/codeGen";
import type { Project } from "../src/models/types";

const project: Project = {
  id: "p1",
  name: "Test",
  description: "",
  lastModified: "",
  pages: [
    {
      id: "pg1",
      name: "index",
      components: [],
      backgroundColor: "#fff",
      fontFamily: "sans-serif",
    },
  ],
  routes: [],
  stateModel: {
    primary: {
      name: "State",
      attributes: [{ id: "a1", name: "name", type: "str", description: "" }],
    },
    secondary: { name: "Secondary", attributes: [] },
  },
  annotations: [],
};

test("generateCode includes from drafter import", () => {
  const code = generateCode(project);
  expect(code).toContain("from drafter import");
});

test("generateCode includes start_server", () => {
  const code = generateCode(project);
  expect(code).toContain("start_server");
});
