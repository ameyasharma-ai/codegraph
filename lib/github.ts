/**
 * lib/github.ts
 * Functions to interact with GitHub API
 */

export interface GithubFile {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
}

export interface RepoDetails {
  owner: string;
  repo: string;
}

/**
 * Parses a GitHub URL to extract owner and repo name.
 * Supports formats:
 * - https://github.com/owner/repo
 * - owner/repo
 */
export function parseGithubUrl(url: string): RepoDetails | null {
  const cleanUrl = url.trim().replace(/\/$/, "");
  
  // Regex for https://github.com/owner/repo
  const fullUrlMatch = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (fullUrlMatch) {
    return { owner: fullUrlMatch[1], repo: fullUrlMatch[2] };
  }

  // Regex for owner/repo
  const simpleMatch = cleanUrl.match(/^([^/]+)\/([^/]+)$/);
  if (simpleMatch) {
    return { owner: simpleMatch[1], repo: simpleMatch[2] };
  }

  return null;
}

/**
 * Fetches the recursive file tree of a repository.
 * Limits files to JS/TS and a max count.
 */
export async function fetchRepoTree(owner: string, repo: string, token?: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
  
  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3+json",
  };
  
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    // If main fails, try master
    const masterUrl = url.replace("/main?", "/master?");
    const masterResponse = await fetch(masterUrl, { headers });
    if (!masterResponse.ok) {
      throw new Error(`Failed to fetch repo tree: ${response.statusText}`);
    }
    return masterResponse.json();
  }

  return response.json();
}

/**
 * Filter and limit files from the tree.
 */
export function filterFiles(tree: GithubFile[], maxFiles = 300) {
  const validExtensions = [".js", ".ts", ".jsx", ".tsx"];
  
  return tree
    .filter(file => 
      file.type === "blob" && 
      validExtensions.some(ext => file.path.endsWith(ext)) &&
      !file.path.includes("node_modules") &&
      !file.path.startsWith(".")
    )
    .slice(0, maxFiles);
}

/**
 * Fetches raw content of a file from GitHub.
 */
export async function fetchFileContent(owner: string, repo: string, path: string, token?: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3.raw",
  };
  
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.statusText}`);
  }

  return response.text();
}
