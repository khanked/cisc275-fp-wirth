import type { TextComponent, ButtonComponent } from "../src/models/types";

test("TextComponent has kind Text", () => {
  const c: TextComponent = { kind: "Text", id: "1", content: "hello" };
  expect(c.kind).toBe("Text");
});

test("ButtonComponent has kind Button", () => {
  const c: ButtonComponent = { kind: "Button", id: "1", label: "Go", routeId: "r1" };
  expect(c.kind).toBe("Button");
});
