// Matches task headings like "Tâche 1", "TACHE 2", "**Tâche 3 :**", "Tâche n°1".
const HEADING = /t[âa]che\s*(?:n°\s*)?([123])/giu;

// Heading leftovers around a topic: Markdown markers, colons, dashes,
// and a word-range note such as "(60–120 mots)".
const LEADING_NOISE = /^[\s*#:\-–—.)]*(\([^)]*\))?[\s*#:\-–—.]*/u;
const TRAILING_NOISE = /[\s*#\-–—]+$/u;

/**
 * Splits a block containing all three topics (e.g. copied from ChatGPT)
 * into one topic per task. A task whose heading isn't found is null.
 */
export function parseTopics(text: string): [string | null, string | null, string | null] {
  const matches = [...text.matchAll(HEADING)];

  // For each task, the first heading with that number after the previous task's heading.
  const headings: { task: number; start: number; end: number }[] = [];
  let searchFrom = 0;
  for (const task of [1, 2, 3]) {
    const match = matches.find((m) => Number(m[1]) === task && m.index >= searchFrom);
    if (!match) continue;
    const end = match.index + match[0].length;
    headings.push({ task, start: match.index, end });
    searchFrom = end;
  }

  const topics: [string | null, string | null, string | null] = [null, null, null];
  headings.forEach((heading, i) => {
    const next = headings[i + 1];
    const topic = text
      .slice(heading.end, next ? next.start : text.length)
      .replace(LEADING_NOISE, "")
      .replace(TRAILING_NOISE, "");
    topics[heading.task - 1] = topic || null;
  });
  return topics;
}
