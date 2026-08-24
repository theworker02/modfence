import { relative, resolve, sep } from "node:path";

export function matchGlob(file: string, glob: string): boolean {
  const normalized = file.split(sep).join("/");
  const pattern = glob.replace(/\\/g, "/");
  if (pattern.endsWith("/**")) {
    const prefix = pattern.slice(0, -3);
    return normalized === prefix || normalized.startsWith(`${prefix}/`);
  }
  if (pattern.includes("*")) {
    const re = new RegExp(
      `^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*")}$`,
    );
    return re.test(normalized);
  }
  return normalized === pattern;
}

export function layerOf(
  file: string,
  root: string,
  layers: Array<{ name: string; glob: string }>,
): string | null {
  const rel = relative(resolve(root), resolve(file)).split(sep).join("/");
  for (const layer of layers) {
    if (matchGlob(rel, layer.glob)) return layer.name;
  }
  return null;
}

const IMPORT_RE =
  /(?:import\s+(?:type\s+)?(?:[\s\S]*?)\s+from\s+|import\s+|export\s+[\s\S]*?\s+from\s+|require\s*\(\s*)['"]([^'"]+)['"]/g;

export function extractSpecifiers(source: string): string[] {
  const out: string[] = [];
  for (const match of source.matchAll(IMPORT_RE)) {
    if (match[1]) out.push(match[1]);
  }
  return out;
}

export function isRelative(spec: string): boolean {
  return spec.startsWith("./") || spec.startsWith("../");
}
