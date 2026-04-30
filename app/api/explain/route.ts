/**
 * app/api/explain/route.ts
 * Endpoint to get AI explanation for a file
 */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateFileExplanation } from "@/lib/ai";
import { fetchFileContent, parseGithubUrl } from "@/lib/github";

export async function POST(request: Request) {
  try {
    const { repoUrl, fileName } = await request.json();

    if (!repoUrl || !fileName) {
      return NextResponse.json({ error: "repoUrl and fileName are required" }, { status: 400 });
    }

    const details = parseGithubUrl(repoUrl);
    if (!details) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const { owner, repo } = details;
    const normalizedRepoUrl = `${owner}/${repo}`.toLowerCase();

    // 1. Check Cache
    const { data: cachedExp, error: cacheError } = await supabase
      .from("explanations")
      .select("*")
      .eq("repo_url", normalizedRepoUrl)
      .eq("file_name", fileName)
      .single();

    if (cachedExp && !cacheError) {
      return NextResponse.json({ summary: cachedExp.summary });
    }

    // 2. Fetch Content
    const content = await fetchFileContent(owner, repo, fileName, process.env.GITHUB_TOKEN);

    // 3. Generate Explanation
    const aiResponse = await generateFileExplanation(fileName, content);

    // 4. Cache it
    await supabase.from("explanations").insert({
      repo_url: normalizedRepoUrl,
      file_name: fileName,
      summary: aiResponse.summary,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ summary: aiResponse.summary });
  } catch (error: any) {
    console.error("Explain API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
