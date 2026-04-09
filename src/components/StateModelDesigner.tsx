import { v4 as uuidv4 } from "uuid";
import { useProject } from "../context/ProjectContext";
import type { Attribute, Dataclass } from "../models/types";

function AttributeForm({
  attributes,
  onChange,
}: {
  attributes: Attribute[];
  onChange: (attrs: Attribute[]) => void;
}) {
  function handleAdd(): void {
    onChange([
      ...attributes,
      { id: uuidv4(), name: "new_attr", type: "str", description: "" },
    ]);
  }

  function handleDelete(id: string): void {
    onChange(attributes.filter((a) => a.id !== id));
  }

  function handleChange(
    id: string,
    field: keyof Attribute,
    value: string
  ): void {
    onChange(
      attributes.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  }

  return (
    <div className="attribute-list">
      {attributes.map((attr) => (
        <div key={attr.id} className="attribute-row">
          <input
            type="text"
            value={attr.name}
            onChange={(e) => handleChange(attr.id, "name", e.target.value)}
            placeholder="name"
            className="form-input attr-name"
          />
          <input
            type="text"
            value={attr.type}
            onChange={(e) => handleChange(attr.id, "type", e.target.value)}
            placeholder="type (e.g. str)"
            className="form-input attr-type"
          />
          <input
            type="text"
            value={attr.description}
            onChange={(e) =>
              handleChange(attr.id, "description", e.target.value)
            }
            placeholder="description"
            className="form-input attr-desc"
          />
          <button
            className="btn btn-danger btn-xs"
            onClick={() => handleDelete(attr.id)}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn btn-secondary" onClick={handleAdd}>
        + Add Attribute
      </button>
    </div>
  );
}

function DataclassEditor({
  dataclass,
  onChange,
}: {
  dataclass: Dataclass;
  onChange: (dc: Dataclass) => void;
}) {
  return (
    <div className="dataclass-editor">
      <div className="form-group">
        <label>Class Name</label>
        <input
          type="text"
          value={dataclass.name}
          onChange={(e) => onChange({ ...dataclass, name: e.target.value })}
          className="form-input"
        />
      </div>
      <AttributeForm
        attributes={dataclass.attributes}
        onChange={(attrs) => onChange({ ...dataclass, attributes: attrs })}
      />
    </div>
  );
}

export function StateModelDesigner() {
  const { project, updateStateModel } = useProject();
  const { stateModel } = project;

  return (
    <div className="state-model-designer">
      <h2>State Model</h2>
      <div className="state-sections">
        <section className="state-section">
          <h3>Primary Dataclass</h3>
          <DataclassEditor
            dataclass={stateModel.primary}
            onChange={(dc) =>
              updateStateModel({ ...stateModel, primary: dc })
            }
          />
        </section>
        <section className="state-section">
          <h3>Secondary Dataclass</h3>
          <DataclassEditor
            dataclass={stateModel.secondary}
            onChange={(dc) =>
              updateStateModel({ ...stateModel, secondary: dc })
            }
          />
        </section>
      </div>
    </div>
  );
}
