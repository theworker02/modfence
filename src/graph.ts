import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import type { FenceConfig } from "./config.js";
import { extractSpecifiers, isRelative, layerOf } from "./imports.js";

const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"]);

export interface Edge {
  from: string;
  to: string;
  fromLayer: string | null;
  toLayer: string | null;
  specifier: string;
}

export interface Violation {
  kind: "layer" | "cycle";
  message: string;
  from: string;
  to?: string;
}

async function walk(dir: string, files: string[]): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else if (CODE_EXT.has(extname(entry.name))) files.push(full);
  }
}

function resolveSpecifier(fromFile: string, spec: string): string | null {
  if (!isRelative(spec)) return null;
  const base = resolve(dirname(fromFile), spec);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    join(base, "index.ts"),
    join(base, "index.js"),
  ];
  return candidates[1] ?? base;
}

export async function collectEdges(config: FenceConfig): Promise<Edge[]> {
  const root = resolve(config.root);
  const files: string[] = [];
  await walk(root, files);
  const edges: Edge[] = [];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const fromLayer = layerOf(file, root, config.layers);
    for (const spec of extractSpecifiers(source)) {
      if (!isRelative(spec)) continue;
      const target = resolveSpecifier(file, spec);
      if (!target) continue;
      const toLayer = layerOf(target, root, config.layers);
      edges.push({
        from: file,
        to: target,
        fromLayer,
        toLayer,
        specifier: spec,
      });
    }
  }
  return edges;
}

export function checkLayers(config: FenceConfig, edges: Edge[]): Violation[] {
  const allow = new Map(config.allow.map((a) => [a.from, new Set(a.to)]));
  const violations: Violation[] = [];
  for (const edge of edges) {
    if (!edge.fromLayer || !edge.toLayer) continue;
    if (edge.fromLayer === edge.toLayer) continue;
    const allowed = allow.get(edge.fromLayer);
    if (!allowed || !allowed.has(edge.toLayer)) {
      violations.push({
        kind: "layer",
        from: edge.from,
        to: edge.to,
        message: `${edge.fromLayer} may not import ${edge.toLayer} (${edge.specifier})`,
      });
    }
  }
  return violations;
}

export function findCycles(edges: Edge[]): string[][] {
  const graph = new Map<string, string[]>();
  for (const edge of edges) {
    const list = graph.get(edge.from) ?? [];
    list.push(edge.to);
    graph.set(edge.from, list);
  }
  const cycles: string[][] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  const dfs = (node: string) => {
    if (visited.has(node)) return;
    visiting.add(node);
    stack.push(node);
    for (const next of graph.get(node) ?? []) {
      if (visiting.has(next)) {
        const i = stack.indexOf(next);
        if (i >= 0) cycles.push(stack.slice(i).concat(next));
      } else {
        dfs(next);
      }
    }
    stack.pop();
    visiting.delete(node);
    visited.add(node);
  };

  for (const node of graph.keys()) dfs(node);
  return cycles;
}

export async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}
