import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useProject } from "../context/ProjectContext";
import type { Page, PageComponent } from "../models/types";

type ComponentKind = PageComponent["kind"];

const COMPONENT_KINDS: ComponentKind[] = [
  "Text",
  "Header",
  "TextBox",
  "TextArea",
  "CheckBox",
  "SelectBox",
  "Button",
];

function createDefaultComponent(kind: ComponentKind): PageComponent {
  const id = uuidv4();
  if (kind === "Text") {
    return { kind, id, content: "New text" };
  } else if (kind === "Header") {
    return { kind, id, content: "New Header", level: 1 };
  } else if (kind === "TextBox") {
    return { kind, id, name: "field_name", defaultValue: "" };
  } else if (kind === "TextArea") {
    return { kind, id, name: "area_name", defaultValue: "" };
  } else if (kind === "CheckBox") {
    return { kind, id, name: "check_name", defaultValue: false };
  } else if (kind === "SelectBox") {
    return {
      kind,
      id,
      name: "select_name",
      options: ["option1", "option2"],
      defaultValue: "option1",
    };
  } else {
    return { kind, id, label: "Click Me", routeId: "" };
  }
}

function ComponentEditor({
  comp,
  onChange,
}: {
  comp: PageComponent;
  onChange: (updated: PageComponent) => void;
}) {
  if (comp.kind === "Text") {
    return (
      <div className="comp-editor">
        <label>Content</label>
        <input
          type="text"
          value={comp.content}
          onChange={(e) => onChange({ ...comp, content: e.target.value })}
          className="form-input"
        />
      </div>
    );
  } else if (comp.kind === "Header") {
    return (
      <div className="comp-editor">
        <label>Content</label>
        <input
          type="text"
          value={comp.content}
          onChange={(e) => onChange({ ...comp, content: e.target.value })}
          className="form-input"
        />
        <label>Level</label>
        <select
          value={comp.level}
          onChange={(e) =>
            onChange({
              ...comp,
              level: parseInt(e.target.value, 10) as 1 | 2 | 3 | 4 | 5 | 6,
            })
          }
          className="form-input"
        >
          {([1, 2, 3, 4, 5, 6] as const).map((l) => (
            <option key={l} value={l}>
              H{l}
            </option>
          ))}
        </select>
      </div>
    );
  } else if (comp.kind === "TextBox") {
    return (
      <div className="comp-editor">
        <label>Name</label>
        <input
          type="text"
          value={comp.name}
          onChange={(e) => onChange({ ...comp, name: e.target.value })}
          className="form-input"
        />
        <label>Default Value</label>
        <input
          type="text"
          value={comp.defaultValue}
          onChange={(e) => onChange({ ...comp, defaultValue: e.target.value })}
          className="form-input"
        />
      </div>
    );
  } else if (comp.kind === "TextArea") {
    return (
      <div className="comp-editor">
        <label>Name</label>
        <input
          type="text"
          value={comp.name}
          onChange={(e) => onChange({ ...comp, name: e.target.value })}
          className="form-input"
        />
        <label>Default Value</label>
        <input
          type="text"
          value={comp.defaultValue}
          onChange={(e) => onChange({ ...comp, defaultValue: e.target.value })}
          className="form-input"
        />
      </div>
    );
  } else if (comp.kind === "CheckBox") {
    return (
      <div className="comp-editor">
        <label>Name</label>
        <input
          type="text"
          value={comp.name}
          onChange={(e) => onChange({ ...comp, name: e.target.value })}
          className="form-input"
        />
        <label>
          <input
            type="checkbox"
            checked={comp.defaultValue}
            onChange={(e) =>
              onChange({ ...comp, defaultValue: e.target.checked })
            }
          />{" "}
          Default Checked
        </label>
      </div>
    );
  } else if (comp.kind === "SelectBox") {
    return (
      <div className="comp-editor">
        <label>Name</label>
        <input
          type="text"
          value={comp.name}
          onChange={(e) => onChange({ ...comp, name: e.target.value })}
          className="form-input"
        />
        <label>Options (comma-separated)</label>
        <input
          type="text"
          value={comp.options.join(", ")}
          onChange={(e) => {
            const opts = e.target.value
              .split(",")
              .map((o) => o.trim())
              .filter((o) => o.length > 0);
            onChange({ ...comp, options: opts, defaultValue: opts[0] ?? "" });
          }}
          className="form-input"
        />
      </div>
    );
  } else {
    return (
      <div className="comp-editor">
        <label>Label</label>
        <input
          type="text"
          value={comp.label}
          onChange={(e) => onChange({ ...comp, label: e.target.value })}
          className="form-input"
        />
        <label>Route ID</label>
        <input
          type="text"
          value={comp.routeId}
          onChange={(e) => onChange({ ...comp, routeId: e.target.value })}
          className="form-input"
        />
      </div>
    );
  }
}

function ComponentPreview({ comp }: { comp: PageComponent }) {
  if (comp.kind === "Text") {
    return <p className="preview-text">{comp.content}</p>;
  } else if (comp.kind === "Header") {
    const tagMap = {
      1: "h1",
      2: "h2",
      3: "h3",
      4: "h4",
      5: "h5",
      6: "h6",
    } as const;
    const Tag = tagMap[comp.level];
    return <Tag className="preview-header">{comp.content}</Tag>;
  } else if (comp.kind === "TextBox") {
    return (
      <div className="preview-field">
        <label>{comp.name}</label>
        <input type="text" placeholder={comp.defaultValue} readOnly />
      </div>
    );
  } else if (comp.kind === "TextArea") {
    return (
      <div className="preview-field">
        <label>{comp.name}</label>
        <textarea placeholder={comp.defaultValue} readOnly />
      </div>
    );
  } else if (comp.kind === "CheckBox") {
    return (
      <div className="preview-field">
        <label>
          <input
            type="checkbox"
            defaultChecked={comp.defaultValue}
            readOnly
          />{" "}
          {comp.name}
        </label>
      </div>
    );
  } else if (comp.kind === "SelectBox") {
    return (
      <div className="preview-field">
        <label>{comp.name}</label>
        <select defaultValue={comp.defaultValue}>
          {comp.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  } else {
    return (
      <button className="preview-button" type="button">
        {comp.label}
      </button>
    );
  }
}

export function PageEditor() {
  const { project, updatePage } = useProject();
  const [selectedPageId, setSelectedPageId] = useState<string>(
    project.pages[0]?.id ?? ""
  );
  const [newKind, setNewKind] = useState<ComponentKind>("Text");

  const selectedPage: Page | undefined = project.pages.find(
    (p) => p.id === selectedPageId
  );

  function handleAddComponent(): void {
    if (!selectedPage) return;
    const newComp = createDefaultComponent(newKind);
    updatePage({
      ...selectedPage,
      components: [...selectedPage.components, newComp],
    });
  }

  function handleDeleteComponent(compId: string): void {
    if (!selectedPage) return;
    updatePage({
      ...selectedPage,
      components: selectedPage.components.filter((c) => c.id !== compId),
    });
  }

  function handleUpdateComponent(updated: PageComponent): void {
    if (!selectedPage) return;
    updatePage({
      ...selectedPage,
      components: selectedPage.components.map((c) =>
        c.id === updated.id ? updated : c
      ),
    });
  }

  function handleStyleChange(
    field: "backgroundColor" | "fontFamily",
    value: string
  ): void {
    if (!selectedPage) return;
    updatePage({ ...selectedPage, [field]: value });
  }

  if (project.pages.length === 0) {
    return (
      <div className="page-editor empty">
        <p>No pages yet. Create pages in the Page Graph tab.</p>
      </div>
    );
  }

  return (
    <div className="page-editor">
      <div className="editor-sidebar">
        <div className="form-group">
          <label htmlFor="page-select">Select Page</label>
          <select
            id="page-select"
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            className="form-input"
          >
            {project.pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {selectedPage && (
          <>
            <div className="form-group">
              <label htmlFor="bg-color">Background Color</label>
              <input
                id="bg-color"
                type="color"
                value={selectedPage.backgroundColor}
                onChange={(e) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
                className="form-input color-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="font-family">Font Family</label>
              <select
                id="font-family"
                value={selectedPage.fontFamily}
                onChange={(e) =>
                  handleStyleChange("fontFamily", e.target.value)
                }
                className="form-input"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="Verdana, sans-serif">Verdana</option>
              </select>
            </div>

            <div className="component-list">
              <h3>Components</h3>
              {selectedPage.components.map((comp) => (
                <div key={comp.id} className="component-item">
                  <div className="component-header">
                    <span className="component-kind">{comp.kind}</span>
                    <button
                      className="btn btn-danger btn-xs"
                      onClick={() => handleDeleteComponent(comp.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <ComponentEditor
                    comp={comp}
                    onChange={handleUpdateComponent}
                  />
                </div>
              ))}
            </div>

            <div className="add-component">
              <select
                value={newKind}
                onChange={(e) => setNewKind(e.target.value as ComponentKind)}
                className="form-input"
              >
                {COMPONENT_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleAddComponent}>
                + Add Component
              </button>
            </div>
          </>
        )}
      </div>

      {selectedPage && (
        <div
          className="editor-preview"
          style={{
            backgroundColor: selectedPage.backgroundColor,
            fontFamily: selectedPage.fontFamily,
          }}
        >
          <div className="preview-label">Preview: {selectedPage.name}</div>
          <div className="preview-content">
            {selectedPage.components.map((comp) => (
              <ComponentPreview key={comp.id} comp={comp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
