/**
 * lib/graph-builder.ts
 * Logic to transform files and imports into graph nodes and edges
 */

import { normalizeImportPath } from "./parser";
import dagre from "dagre";

export interface Node {
  id: string;
  data: { label: string };
  position: { x: number; y: number };
  type?: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface FileData {
  path: string;
  imports: string[];
}

/**
 * Builds a graph from a list of files and their imports using Dagre for layout.
 */
export function buildGraph(files: FileData[]): GraphData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const filePaths = new Set(files.map(f => f.path));

  // 1. Initialize Nodes and Edges
  files.forEach((file) => {
    nodes.push({
      id: file.path,
      data: { label: file.path.split("/").pop() || file.path },
      position: { x: 0, y: 0 }, // Positions will be set by dagre
    });

    file.imports.forEach(impPath => {
      const normalizedTarget = normalizeImportPath(file.path, impPath);
      const targetPath = findMatchingFile(normalizedTarget, filePaths);

      if (targetPath) {
        edges.push({
          id: `e-${file.path}-${targetPath}`,
          source: file.path,
          target: targetPath,
          animated: false,
        });
      }
    });
  });

  // 2. Apply Dagre Layout
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: 70, ranksep: 120 });
  g.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 200;
  const nodeHeight = 60;

  nodes.forEach(node => {
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  // 3. Update node positions from dagre results
  nodes.forEach(node => {
    const dagreNode = g.node(node.id);
    node.position = {
      x: dagreNode.x - nodeWidth / 2,
      y: dagreNode.y - nodeHeight / 2
    };
  });

  return { nodes, edges };
}

/**
 * Tries to find a file in the tree that matches the import path.
 * Handles missing extensions like .ts, .js, etc.
 */
function findMatchingFile(path: string, filePaths: Set<string>): string | null {
  if (filePaths.has(path)) return path;
  
  const extensions = [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss", ".less", "/index.ts", "/index.tsx", "/index.js", "/index.jsx"];
  
  for (const ext of extensions) {
    if (filePaths.has(path + ext)) return path + ext;
  }

  return null;
}
