import { useEffect, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from "@xyflow/react";
import type { Node, Edge, Connection, NodeChange } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { useProject } from "../context/ProjectContext";
import type { Page } from "../models/types";

type FlowNode = Node<{ label: string; pageId: string }, "default">;

function pageToNode(page: Page, index: number): FlowNode {
  return {
    id: page.id,
    type: "default",
    position: { x: 200 * (index % 4), y: 150 * Math.floor(index / 4) },
    data: { label: page.name, pageId: page.id },
  };
}

export function PageGraph() {
  const { project, addPage, deletePage, addRoute, deleteRoute } = useProject();

  const initialNodes: FlowNode[] = project.pages.map((p, i) =>
    pageToNode(p, i)
  );
  const initialEdges: Edge[] = project.routes.map((r) => ({
    id: r.id,
    source: r.fromPageId,
    target: r.toPageId,
    label: r.label,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(project.pages.map((p, i) => pageToNode(p, i)));
    setEdges(
      project.routes.map((r) => ({
        id: r.id,
        source: r.fromPageId,
        target: r.toPageId,
        label: r.label,
      }))
    );
  }, [project.pages, project.routes, setNodes, setEdges]);

  const handleNodesChange = useCallback(
    (changes: NodeChange<FlowNode>[]) => {
      for (const change of changes) {
        if (change.type === "remove") {
          deletePage(change.id);
        }
      }
      onNodesChange(changes);
    },
    [onNodesChange, deletePage]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newRoute = {
        id: uuidv4(),
        fromPageId: connection.source,
        toPageId: connection.target,
        label: `${connection.source} -> ${connection.target}`,
      };
      addRoute(newRoute);
      setEdges((eds) => addEdge(connection, eds));
    },
    [addRoute, setEdges]
  );

  function handleAddPage(): void {
    const newPage: Page = {
      id: uuidv4(),
      name: `page_${project.pages.length + 1}`,
      components: [],
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
    };
    addPage(newPage);
  }

  function handleDeleteEdge(edgeId: string): void {
    deleteRoute(edgeId);
  }

  return (
    <div className="page-graph">
      <div className="graph-toolbar">
        <button className="btn btn-primary" onClick={handleAddPage}>
          + Add Page
        </button>
        <span className="graph-hint">
          Drag between nodes to create routes. Select a node and press Delete to
          remove.
        </span>
      </div>
      <div style={{ height: 500, border: "1px solid var(--border)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={(_event, edge) => handleDeleteEdge(edge.id)}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
