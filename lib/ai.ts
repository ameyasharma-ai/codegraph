/**
 * lib/ai.ts
 * OpenRouter AI interaction
 */

export interface AIResponse {
  summary: string;
  role: string;
}

/**
 * Generates an explanation for a file using OpenRouter.
 */
export async function generateFileExplanation(fileName: string, content: string): Promise<AIResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  // Truncate content if too large (OpenRouter/models have context limits)
  const truncatedContent = content.slice(0, 4000);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://codegraph.vercel.app", // Optional
      "X-Title": "CodeGraph", // Optional
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001", // Fast and capable
      messages: [
        {
          role: "system",
          content: "You are a senior software architect. Analyze the provided code file and explain its purpose and role in the system. Keep it concise."
        },
        {
          role: "user",
          content: `File Name: ${fileName}\n\nContent:\n${truncatedContent}`
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`AI Request failed: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  // Attempt to split or format the response
  return {
    summary: text,
    role: "Core Module" // Defaulting or could be extracted from text
  };
}
