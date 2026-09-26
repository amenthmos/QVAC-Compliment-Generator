// QVAC Compliment Generator — core logic.
// completion() writes a genuine, specific compliment that references the
// actual detail the user typed in — never a generic "you're awesome" line.
// A grounding check verifies the detail's own words show up in the output;
// if the model drifts generic, we fall back to a template built from the
// user's literal input so it is never generic no matter what.

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  if (text.length > 500) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able", "language model"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "to", "of", "in", "on", "at", "for",
  "with", "was", "were", "is", "are", "she", "he", "they", "it", "her", "his",
  "their", "my", "your", "me", "you", "i", "that", "this", "when", "so",
  "very", "really", "just", "did", "had", "has", "have", "then",
]);

function keywordsOf(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

function isGrounded(output, detail) {
  const kws = keywordsOf(detail);
  if (kws.length === 0) return true;
  const lowerOut = output.toLowerCase();
  return kws.some((kw) => lowerOut.includes(kw));
}

function fallback(person, detail) {
  return `${person}, the way you ${detail.replace(/\.$/, "")} really stood out — that took real thought and care, and it says a lot about who you are.`;
}

export async function generate(modelId, person, detail) {
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You write short, genuine compliments (1-2 sentences) about a specific person, " +
          "based on something specific they did or said. The compliment MUST reference " +
          "the actual detail given — never write a generic compliment that could apply to " +
          "anyone. Reply with ONLY the compliment, no preamble, no explanation.",
      },
      {
        role: "user",
        content:
          "Person: Marcus, my coworker\nWhat they did/said: stayed late to help me debug my code even though it wasn't his job",
      },
      {
        role: "assistant",
        content:
          "Marcus, staying late to help debug code that wasn't even your responsibility shows a level of generosity most people don't have — you clearly care more about your team succeeding than about clocking out on time.",
      },
      {
        role: "user",
        content: `Person: ${person}\nWhat they did/said: ${detail}`,
      },
    ],
    stream: true,
    completionOpts: { temperature: 0.8, maxTokens: 150 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = text
    .trim()
    .replace(/^here'?s[^:\n]*:\s*/i, "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();

  let compliment;
  if (looksUnusable(text) || !isGrounded(text, detail)) {
    compliment = fallback(person, detail);
  } else {
    compliment = text;
  }

  return { compliment };
}
