export function formatEntityLabel(entityType: string): string {
  return entityType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatEntityCount(count: number): string {
  return `${count} PII entit${count === 1 ? "y" : "ies"}`;
}
