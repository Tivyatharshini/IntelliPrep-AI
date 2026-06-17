const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "you",
  "your",
  "are",
  "will",
  "have",
  "has",
  "our",
  "not",
  "any",
  "job",
  "role",
  "description",
  "resume",
  "candidate",
  "experience",
  "skills",
  "requiring",
  "required",
  "including",
  "include",
  "includes"
]);

const skillAliases = [
  { name: "JavaScript", patterns: [/javascript/i, /js\b/i] },
  { name: "TypeScript", patterns: [/typescript/i, /ts\b/i] },
  { name: "React", patterns: [/react/i] },
  { name: "Node.js", patterns: [/node\.js/i, /node\b/i] },
  { name: "Express.js", patterns: [/express/i] },
  { name: "Python", patterns: [/python/i] },
  { name: "SQL", patterns: [/sql/i] },
  { name: "MongoDB", patterns: [/mongodb/i, /mongo\b/i] },
  { name: "PostgreSQL", patterns: [/postgres/i, /postgresql/i] },
  { name: "AWS", patterns: [/aws/i, /amazon web services/i] },
  { name: "Docker", patterns: [/docker/i] },
  { name: "Kubernetes", patterns: [/kubernetes/i, /k8s/i] },
  { name: "Git", patterns: [/\bgit\b/i] },
  { name: "REST APIs", patterns: [/rest api/i, /restful/i, /api integrations?/i] },
  { name: "Machine Learning", patterns: [/machine learning/i, /ml\b/i] },
  { name: "Statistics", patterns: [/statistics?/i] },
  { name: "Data Analysis", patterns: [/data analysis/i] },
  { name: "UI/UX", patterns: [/ui\/ux/i, /user experience/i, /\bux\b/i, /\bui\b/i] },
  { name: "Tailwind CSS", patterns: [/tailwind/i] },
  { name: "Testing", patterns: [/jest/i, /testing/i, /unit test/i, /integration test/i] }
];

export function normalizeText(text) {
  return String(text || "").replace(/\r/g, "").trim();
}

export function splitLines(text) {
  return normalizeText(text)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function unique(values) {
  const seen = new Set();

  return values.filter((value) => {
    if (!value) return false;
    const key = String(value).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function extractKnownSkills(text) {
  const source = String(text || "");
  const skills = skillAliases.flatMap((skill) =>
    skill.patterns.some((pattern) => pattern.test(source)) ? [skill.name] : []
  );

  return unique(skills);
}

export function extractKeywords(text, limit = 20) {
  const words = String(text || "")
    .toLowerCase()
    .match(/[a-z][a-z0-9+#.-]{2,}/g) || [];

  const counts = new Map();

  for (const word of words) {
    if (stopWords.has(word)) {
      continue;
    }

    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function chunkText(text, size = 2000) {
  const source = normalizeText(text);
  const chunks = [];

  for (let index = 0; index < source.length; index += size) {
    chunks.push(source.slice(index, index + size));
  }

  return chunks;
}
