/**
 * lib/graph-builder.ts
 * Logic to transform files and imports into graph nodes and edges
 */

import { normalizeImportPath } from "./parser";

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
 * Builds a graph from a list of files and their imports.
 */
export function buildGraph(files: FileData[]): GraphData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const filePaths = new Set(files.map(f => f.path));

  // Create nodes with a simple grid layout initially
  files.forEach((file, index) => {
    nodes.push({
      id: file.path,
      data: { label: file.path.split("/").pop() || file.path },
      position: { 
        x: (index % 10) * 250, 
        y: Math.floor(index / 10) * 150 
      },
    });

    // Create edges
    file.imports.forEach(impPath => {
      const normalizedTarget = normalizeImportPath(file.path, impPath);
      
      // We only want to create edges to files that are in our tree
      // We check for extensions because imports often omit them
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
