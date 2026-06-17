export function stripJsonFences(text) {
  const trimmed = String(text || "").trim();
  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (match ? match[1] : trimmed).trim();
}

export function safeJsonParse(text) {
  try {
    return JSON.parse(stripJsonFences(text));
  } catch {
    return null;
  }
}