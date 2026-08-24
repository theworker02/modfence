#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Command } from "commander";
import { defaultConfig, type FenceConfig } from "./config.js";
import { checkLayers, collectEdges, exists, findCycles } from "./graph.js";
import { layerOf } from "./imports.js";

async function loadConfig(cwd: string): Promise<FenceConfig> {
  const path = resolve(cwd, "modfence.json");
  if (!(await exists(path))) {
    return { ...defaultConfig(), root: cwd };
  }
  const raw = JSON.parse(await readFile(path, "utf8")) as Partial<FenceConfig>;
  return { ...defaultConfig(), ...raw, root: raw.root ? resolve(cwd, raw.root) : cwd };
}

const program = new Command();
program
  .name("modfence")
  .description("TypeScript import-boundary linter for layered architectures.")
  .version("1.0.0");

program
  .command("init")
  .description("Write a starter modfence.json")
  .action(async () => {
    const path = resolve(process.cwd(), "modfence.json");
    await writeFile(path, `${JSON.stringify(defaultConfig(), null, 2)}\n`);
    process.stdout.write(`Wrote ${path}\n`);
  });

program
  .command("check")
  .description("Fail if a layer import or cycle violates the fence")
  .option("--json", "print violations as JSON")
  .action(async (opts: { json?: boolean }) => {
    const config = await loadConfig(process.cwd());
    const edges = await collectEdges(config);
    const violations = checkLayers(config, edges);
    if (config.forbidCycles) {
      for (const cycle of findCycles(edges)) {
        violations.push({
          kind: "cycle",
          from: cycle[0],
          message: `cycle: ${cycle.join(" -> ")}`,
        });
      }
    }
    if (opts.json) {
      process.stdout.write(`${JSON.stringify({ ok: violations.length === 0, violations }, null, 2)}\n`);
    } else if (violations.length === 0) {
      process.stdout.write("ok: no fence violations\n");
    } else {
      for (const v of violations) process.stderr.write(`${v.kind}: ${v.message}\n`);
    }
    if (violations.length) process.exitCode = 1;
  });

program
  .command("why")
  .argument("<file>", "source file")
  .description("Show which layer a file belongs to and its outbound imports")
  .action(async (file: string) => {
    const config = await loadConfig(process.cwd());
    const abs = resolve(process.cwd(), file);
    const layer = layerOf(abs, config.root, config.layers);
    const edges = (await collectEdges(config)).filter((e) => e.from === abs);
    process.stdout.write(
      `${JSON.stringify({ file: abs, layer, imports: edges.map((e) => ({ specifier: e.specifier, toLayer: e.toLayer })) }, null, 2)}\n`,
    );
  });

program
  .command("graph")
  .description("Print a mermaid flowchart of layer edges")
  .action(async () => {
    const config = await loadConfig(process.cwd());
    const edges = await collectEdges(config);
    const pairs = new Set<string>();
    process.stdout.write("flowchart LR\n");
    for (const e of edges) {
      if (!e.fromLayer || !e.toLayer || e.fromLayer === e.toLayer) continue;
      const key = `${e.fromLayer}->${e.toLayer}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      process.stdout.write(`  ${e.fromLayer} --> ${e.toLayer}\n`);
    }
  });

await program.parseAsync(process.argv);
