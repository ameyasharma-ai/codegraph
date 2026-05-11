/**
 * lib/parser.ts
 * Regex-based import extraction
 */

export interface FileImport {
  raw: string;
  source: string;
}

/**
 * Extracts import paths from a JS/TS code string.
 * Uses regex to find ES imports.
 */
export function extractImports(code: string): string[] {
  // Regex to match: 
  // 1. import ... from "path"
  // 2. import "path"
  // 3. export ... from "path"
  // 4. require("path")
  // 5. import("path")
  const importRegex = /(?:import|export)\s+(?:(?:[\w*\s{},]*)\s+from\s+)?['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\)|import\(['"]([^'"]+)['"]\)/g;
  
  const imports: string[] = [];
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    const path = match[1] || match[2] || match[3];
    if (path) {
      imports.push(path);
    }
  }

  return imports;
}

/**
 * Normalizes an import path relative to the current file path.
 * Example: 
 * currentFile: "src/app.ts"
 * importPath: "./utils"
 * returns: "src/utils"
 */
export function normalizeImportPath(currentFile: string, importPath: string): string {
  // Handle @/ alias mapping to root
  if (importPath.startsWith("@/")) {
    return importPath.replace("@/", "");
  }

  // If it's not a relative path, return as is (could be a library or absolute)
  if (!importPath.startsWith(".")) {
    return importPath;
  }

  const parts = currentFile.split("/");
  parts.pop(); // remove file name

  const importParts = importPath.split("/");

  for (const part of importParts) {
    if (part === "..") {
      parts.pop();
    } else if (part !== ".") {
      parts.push(part);
    }
  }

  return parts.join("/");
}
