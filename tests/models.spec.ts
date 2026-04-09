import type { TextComponent, ButtonComponent } from "../src/models/types";
import { isProject } from "../src/models/types";

test("TextComponent has kind Text", () => {
  const c: TextComponent = { kind: "Text", id: "1", content: "hello" };
  expect(c.kind).toBe("Text");
});

test("ButtonComponent has kind Button", () => {
  const c: ButtonComponent = { kind: "Button", id: "1", label: "Go", routeId: "r1" };
  expect(c.kind).toBe("Button");
});

test("isProject returns false for null", () => {
  expect(isProject(null)).toBe(false);
});

test("isProject returns false for object missing required fields", () => {
  expect(isProject({ id: "x" })).toBe(false);
});

test("isProject returns true for valid project", () => {
  const p = {
    id: "1",
    name: "Test",
    description: "",
    lastModified: "2024-01-01",
    pages: [],
    routes: [],
    stateModel: { primary: { name: "State", attributes: [] }, secondary: { name: "S", attributes: [] } },
    annotations: [],
  };
  expect(isProject(p)).toBe(true);
});
