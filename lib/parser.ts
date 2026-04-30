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
  // Regex to match: import ... from "path" or import "path"
  // Handles single quotes, double quotes, and template literals (though unlikely in imports)
  const importRegex = /import\s+(?:(?:[\w*\s{},]*)\s+from\s+)?['"]([^'"]+)['"]/g;
  
  const imports: string[] = [];
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    if (match[1]) {
      imports.push(match[1]);
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
