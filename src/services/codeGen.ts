import type { Project, Page, PageComponent } from "../models/types";

function toSnakeCase(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_");
}

function defaultForType(type: string): string {
  const t = type.trim().toLowerCase();
  if (t === "str") return '""';
  if (t === "int") return "0";
  if (t === "float") return "0.0";
  if (t === "bool") return "False";
  if (t.startsWith("list")) return "[]";
  if (t.startsWith("dict")) return "{}";
  return '""';
}

function componentToWidget(comp: PageComponent, stateName: string): string {
  if (comp.kind === "Text") {
    return `Text(${JSON.stringify(comp.content)})`;
  } else if (comp.kind === "TextBox") {
    return `TextBox(${JSON.stringify(comp.name)}, ${stateName}.${comp.name})`;
  } else if (comp.kind === "TextArea") {
    return `TextArea(${JSON.stringify(comp.name)}, ${stateName}.${comp.name})`;
  } else if (comp.kind === "CheckBox") {
    return `CheckBox(${JSON.stringify(comp.name)}, ${stateName}.${comp.name})`;
  } else if (comp.kind === "SelectBox") {
    const opts = comp.options.map((o) => JSON.stringify(o)).join(", ");
    return `SelectBox(${JSON.stringify(comp.name)}, ${stateName}.${comp.name}, [${opts}])`;
  } else if (comp.kind === "Button") {
    return `Button(${JSON.stringify(comp.label)}, ${toSnakeCase(comp.routeId)})`;
  } else {
    return `Header(${comp.level}, ${JSON.stringify(comp.content)})`;
  }
}


function pageToFunction(page: Page, stateName: string): string {
  const funcName = toSnakeCase(page.name);
  const widgets = page.components
    .map((c) => `        ${componentToWidget(c, stateName)},`)
    .join("\n");
  return `@route
def ${funcName}(state: ${stateName}) -> Page:
    return Page(${stateName}, [
${widgets}
    ])`;
}

export function generateCode(project: Project): string {
  const stateName = project.stateModel.primary.name;
  const attrs = project.stateModel.primary.attributes;
  const secName = project.stateModel.secondary.name;
  const secAttrs = project.stateModel.secondary.attributes;

  const primaryFields = attrs
    .map((a) => `    ${a.name}: ${a.type} = field(default_factory=lambda: ${defaultForType(a.type)})`)
    .join("\n");

  const secondaryFields = secAttrs
    .map((a) => `    ${a.name}: ${a.type} = field(default_factory=lambda: ${defaultForType(a.type)})`)
    .join("\n");

  const pageFunctions = project.pages
    .map((p) => pageToFunction(p, stateName))
    .join("\n\n");

  const hasSecondary = secAttrs.length > 0;

  const dataclassSection = hasSecondary
    ? `@dataclass
class ${stateName}:
${primaryFields || "    pass"}


@dataclass
class ${secName}:
${secondaryFields || "    pass"}`
    : `@dataclass
class ${stateName}:
${primaryFields || "    pass"}`;

  return `from drafter import *
from dataclasses import dataclass, field


${dataclassSection}


${pageFunctions}


start_server(${stateName}())
`;
}

function defaultForType(type: string): string {
  const t = type.trim().toLowerCase();
  if (t === "str") return '""';
  if (t === "int") return "0";
  if (t === "float") return "0.0";
  if (t === "bool") return "False";
  if (t.startsWith("list")) return "[]";
  if (t.startsWith("dict")) return "{}";
  return '""';
}
