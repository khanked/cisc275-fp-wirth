import { useRef, useState } from "react";
import { useProject } from "../context/ProjectContext";
import { exportToDocx } from "../services/docxExport";
import { exportProject, importProject } from "../services/jsonExport";
import { saveProject } from "../services/storage";

export function ExportPanel() {
  const { project, updateProject } = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  function handleDocx(): void {
    void exportToDocx(project);
  }

  function handleJson(): void {
    const json = exportProject(project);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportSuccess(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== "string") return;
      try {
        const imported = importProject(text);
        saveProject(imported);
        updateProject(imported);
        setImportSuccess(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Import failed.";
        setImportError(message);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="export-panel">
      <h2>Export / Import</h2>
      <div className="export-options">
        <div className="export-card">
          <h3>Export to DOCX</h3>
          <p>
            Download a Word document with full project documentation.
          </p>
          <button className="btn btn-primary" onClick={handleDocx}>
            Download DOCX
          </button>
        </div>
        <div className="export-card">
          <h3>Export to JSON</h3>
          <p>Save the full project as a JSON file for backup or transfer.</p>
          <button className="btn btn-primary" onClick={handleJson}>
            Download JSON
          </button>
        </div>
        <div className="export-card">
          <h3>Import from JSON</h3>
          <p>Load a previously exported project JSON file.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleImport}
          />
          <button
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose JSON File
          </button>
          {importError && (
            <p className="import-error" role="alert">
              ⚠️ {importError}
            </p>
          )}
          {importSuccess && (
            <p className="import-success" role="status">
              ✅ Project imported successfully.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
