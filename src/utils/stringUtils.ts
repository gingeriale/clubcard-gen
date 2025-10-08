export function parseNames(raw: string): string[] {
  return raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
}

export function safeFilename(s: string): string {
  return (s || 'card').replace(/[^\w-]+/g, '_').slice(0, 40);
}