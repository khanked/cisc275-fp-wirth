import { Document, Paragraph, TextRun, Packer, HeadingLevel } from "docx";
import type { Project } from "../models/types";

export async function exportToDocx(project: Project): Promise<void> {
  const sections: Paragraph[] = [];

  sections.push(
    new Paragraph({
      text: project.name,
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [new TextRun({ text: `Description: ${project.description}` })],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Last Modified: ${project.lastModified}` }),
      ],
    }),
    new Paragraph({ text: "" })
  );

  sections.push(
    new Paragraph({ text: "Pages", heading: HeadingLevel.HEADING_2 })
  );

  for (const page of project.pages) {
    sections.push(
      new Paragraph({ text: page.name, heading: HeadingLevel.HEADING_3 }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Background: ${page.backgroundColor} | Font: ${page.fontFamily}`,
          }),
        ],
      })
    );
    for (const comp of page.components) {
      let compText = "";
      if (comp.kind === "Text") {
        compText = `Text: "${comp.content}"`;
      } else if (comp.kind === "Header") {
        compText = `Header(${comp.level}): "${comp.content}"`;
      } else if (comp.kind === "TextBox") {
        compText = `TextBox: ${comp.name} (default: "${comp.defaultValue}")`;
      } else if (comp.kind === "TextArea") {
        compText = `TextArea: ${comp.name} (default: "${comp.defaultValue}")`;
      } else if (comp.kind === "CheckBox") {
        compText = `CheckBox: ${comp.name} (default: ${String(comp.defaultValue)})`;
      } else if (comp.kind === "SelectBox") {
        compText = `SelectBox: ${comp.name} options: [${comp.options.join(", ")}]`;
      } else {
        compText = `Button: "${comp.label}" -> ${comp.routeId}`;
      }
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: `  • ${compText}` })],
        })
      );
    }
    sections.push(new Paragraph({ text: "" }));
  }

  sections.push(
    new Paragraph({ text: "Routes", heading: HeadingLevel.HEADING_2 })
  );
  if (project.routes.length === 0) {
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "No routes defined." })] })
    );
  }
  for (const route of project.routes) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${route.label}: ${route.fromPageId} -> ${route.toPageId}`,
          }),
        ],
      })
    );
  }
  sections.push(new Paragraph({ text: "" }));

  sections.push(
    new Paragraph({ text: "State Model", heading: HeadingLevel.HEADING_2 })
  );
  sections.push(
    new Paragraph({
      text: `Primary: ${project.stateModel.primary.name}`,
      heading: HeadingLevel.HEADING_3,
    })
  );
  for (const attr of project.stateModel.primary.attributes) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `  ${attr.name}: ${attr.type} — ${attr.description}`,
          }),
        ],
      })
    );
  }
  sections.push(
    new Paragraph({
      text: `Secondary: ${project.stateModel.secondary.name}`,
      heading: HeadingLevel.HEADING_3,
    })
  );
  for (const attr of project.stateModel.secondary.attributes) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `  ${attr.name}: ${attr.type} — ${attr.description}`,
          }),
        ],
      })
    );
  }
  sections.push(new Paragraph({ text: "" }));

  sections.push(
    new Paragraph({ text: "Annotations", heading: HeadingLevel.HEADING_2 })
  );
  if (project.annotations.length === 0) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "No annotations defined." })],
      })
    );
  }
  for (const ann of project.annotations) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `[${ann.type}] on ${ann.targetType} "${ann.targetId}": ${ann.description}`,
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        children: sections,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${project.name.replace(/\s+/g, "_")}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
