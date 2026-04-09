import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useProject } from "../context/ProjectContext";
import type { Annotation } from "../models/types";

const ANNOTATION_TYPES: Annotation["type"][] = ["if", "for", "state-change"];

function AnnotationForm({
  ann,
  onChange,
  onSave,
  onCancel,
}: {
  ann: Annotation;
  onChange: (a: Annotation) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { project } = useProject();

  return (
    <div className="annotation-form">
      <div className="form-group">
        <label>Type</label>
        <select
          value={ann.type}
          onChange={(e) =>
            onChange({ ...ann, type: e.target.value as Annotation["type"] })
          }
          className="form-input"
        >
          {ANNOTATION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Target Type</label>
        <select
          value={ann.targetType}
          onChange={(e) =>
            onChange({
              ...ann,
              targetType: e.target.value as Annotation["targetType"],
              targetId: "",
            })
          }
          className="form-input"
        >
          <option value="page">Page</option>
          <option value="route">Route</option>
        </select>
      </div>
      <div className="form-group">
        <label>Target</label>
        <select
          value={ann.targetId}
          onChange={(e) => onChange({ ...ann, targetId: e.target.value })}
          className="form-input"
        >
          <option value="">-- Select --</option>
          {ann.targetType === "page"
            ? project.pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))
            : project.routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
        </select>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={ann.description}
          onChange={(e) => onChange({ ...ann, description: e.target.value })}
          className="form-input"
          rows={2}
        />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={onSave}>
          Save
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export function AnnotationPanel() {
  const { project, addAnnotation, updateAnnotation, deleteAnnotation } =
    useProject();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Annotation | null>(null);

  function getTargetName(ann: Annotation): string {
    if (ann.targetType === "page") {
      return project.pages.find((p) => p.id === ann.targetId)?.name ?? ann.targetId;
    }
    return project.routes.find((r) => r.id === ann.targetId)?.label ?? ann.targetId;
  }

  function handleNew(): void {
    const newAnn: Annotation = {
      id: uuidv4(),
      type: "if",
      targetId: "",
      targetType: "page",
      description: "",
    };
    setDraft(newAnn);
    setEditingId("new");
  }

  function handleEdit(ann: Annotation): void {
    setDraft({ ...ann });
    setEditingId(ann.id);
  }

  function handleSave(): void {
    if (!draft) return;
    if (editingId === "new") {
      addAnnotation(draft);
    } else {
      updateAnnotation(draft);
    }
    setDraft(null);
    setEditingId(null);
  }

  function handleCancel(): void {
    setDraft(null);
    setEditingId(null);
  }

  return (
    <div className="annotation-panel">
      <div className="panel-header">
        <h2>Annotations</h2>
        <button className="btn btn-primary" onClick={handleNew}>
          + Add Annotation
        </button>
      </div>

      {editingId === "new" && draft && (
        <AnnotationForm
          ann={draft}
          onChange={setDraft}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <div className="annotation-list">
        {project.annotations.map((ann) => (
          <div key={ann.id} className="annotation-item">
            {editingId === ann.id && draft ? (
              <AnnotationForm
                ann={draft}
                onChange={setDraft}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <div className="annotation-view">
                <span className={`ann-badge ann-${ann.type}`}>{ann.type}</span>
                <span className="ann-target">
                  {ann.targetType}: {getTargetName(ann)}
                </span>
                <span className="ann-desc">{ann.description}</span>
                <div className="ann-actions">
                  <button
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleEdit(ann)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-xs"
                    onClick={() => deleteAnnotation(ann.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {project.annotations.length === 0 && editingId !== "new" && (
        <p className="empty-state">No annotations yet.</p>
      )}
    </div>
  );
}
