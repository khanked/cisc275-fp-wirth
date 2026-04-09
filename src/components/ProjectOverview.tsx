import { useState } from "react";
import { useParams } from "react-router-dom";
import { loadProject } from "../services/storage";
import { ProjectProvider } from "../context/ProjectContext";
import { PageGraph } from "./PageGraph";
import { PageEditor } from "./PageEditor";
import { StateModelDesigner } from "./StateModelDesigner";
import { AnnotationPanel } from "./AnnotationPanel";
import { CodeGeneratorPanel } from "./CodeGeneratorPanel";
import { ExportPanel } from "./ExportPanel";
import { useProject } from "../context/ProjectContext";

type TabId =
  | "overview"
  | "graph"
  | "editor"
  | "state"
  | "annotations"
  | "code"
  | "export";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "graph", label: "Page Graph" },
  { id: "editor", label: "Page Editor" },
  { id: "state", label: "State Model" },
  { id: "annotations", label: "Annotations" },
  { id: "code", label: "Code Generator" },
  { id: "export", label: "Export" },
];

function OverviewTab() {
  const { project, updateProject } = useProject();
  const [name, setName] = useState(project.name);
  const [desc, setDesc] = useState(project.description);

  function handleSave(): void {
    updateProject({ name, description: desc });
  }

  return (
    <div className="overview-tab">
      <h2>Project Overview</h2>
      <div className="form-group">
        <label htmlFor="proj-name">Project Name</label>
        <input
          id="proj-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="proj-desc">Description</label>
        <textarea
          id="proj-desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="form-input"
          rows={3}
        />
      </div>
      <button className="btn btn-primary" onClick={handleSave}>
        Save Changes
      </button>
      <div className="overview-stats">
        <div className="stat-card">
          <span className="stat-value">{project.pages.length}</span>
          <span className="stat-label">Pages</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{project.routes.length}</span>
          <span className="stat-label">Routes</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{project.annotations.length}</span>
          <span className="stat-label">Annotations</span>
        </div>
      </div>
    </div>
  );
}

function ProjectTabs() {
  const { project } = useProject();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="project-overview">
      <header className="project-header">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </header>
      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="tab-content">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "graph" && <PageGraph />}
        {activeTab === "editor" && <PageEditor />}
        {activeTab === "state" && <StateModelDesigner />}
        {activeTab === "annotations" && <AnnotationPanel />}
        {activeTab === "code" && <CodeGeneratorPanel />}
        {activeTab === "export" && <ExportPanel />}
      </div>
    </div>
  );
}

export function ProjectOverview() {
  const { id } = useParams<{ id: string }>();
  const project = id ? loadProject(id) : null;

  if (!project) {
    return (
      <div className="error-page">
        <h1>Project not found</h1>
        <a href="/" className="btn btn-primary">
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <ProjectProvider project={project}>
      <ProjectTabs />
    </ProjectProvider>
  );
}
