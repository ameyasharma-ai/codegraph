/**
 * app/api/parse/route.ts
 * Main endpoint to fetch, parse, and build graph
 */

import { NextResponse } from "next/server";
import { parseGithubUrl, fetchRepoTree, filterFiles, fetchFileContent } from "@/lib/github";
import { extractImports } from "@/lib/parser";
import { buildGraph } from "@/lib/graph-builder";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
    }

    const details = parseGithubUrl(repoUrl);
    if (!details) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const { owner, repo } = details;
    const normalizedRepoUrl = `${owner}/${repo}`.toLowerCase();

    // 1. Check Supabase Cache
    const { data: cachedGraph, error: cacheError } = await supabase
      .from("graphs")
      .select("*")
      .eq("repo_url", normalizedRepoUrl)
      .single();

    if (cachedGraph && !cacheError) {
      console.log("Returning cached graph for", normalizedRepoUrl);
      return NextResponse.json({ 
        nodes: cachedGraph.nodes, 
        edges: cachedGraph.edges,
        cached: true 
      });
    }

    // 2. Fetch Tree
    const treeData = await fetchRepoTree(owner, repo, process.env.GITHUB_TOKEN);
    const files = filterFiles(treeData.tree);

    // 3. Parse Files
    const fileData = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await fetchFileContent(owner, repo, file.path, process.env.GITHUB_TOKEN);
          const imports = extractImports(content);
          return { path: file.path, imports };
        } catch (e) {
          console.error(`Failed to parse ${file.path}`, e);
          return { path: file.path, imports: [] };
        }
      })
    );

    // 4. Build Graph
    const graph = buildGraph(fileData);

    // 5. Store in Supabase
    const { error: storeError } = await supabase.from("graphs").upsert({
      repo_url: normalizedRepoUrl,
      nodes: graph.nodes,
      edges: graph.edges,
      created_at: new Date().toISOString(),
    });

    if (storeError) {
      console.error("Supabase store error:", storeError);
    }

    return NextResponse.json(graph);
  } catch (error: any) {
    console.error("Parse API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
