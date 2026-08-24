import { describe, expect, it } from "vitest";
import { checkLayers, findCycles, type Edge } from "../src/graph.js";
import { defaultConfig } from "../src/config.js";
import { extractSpecifiers, matchGlob } from "../src/imports.js";

describe("imports", () => {
  it("extracts from and require specifiers", () => {
    const specs = extractSpecifiers(`
      import { a } from "../domain/foo";
      export { b } from "./bar";
      const x = require("./legacy");
    `);
    expect(specs).toEqual(["../domain/foo", "./bar", "./legacy"]);
  });

  it("matches ** globs", () => {
    expect(matchGlob("src/ui/Button.ts", "src/ui/**")).toBe(true);
    expect(matchGlob("src/domain/x.ts", "src/ui/**")).toBe(false);
  });
});

describe("layers", () => {
  it("flags ui importing infra", () => {
    const edges: Edge[] = [
      {
        from: "src/ui/App.ts",
        to: "src/infra/db.ts",
        fromLayer: "ui",
        toLayer: "infra",
        specifier: "../infra/db",
      },
    ];
    const v = checkLayers(defaultConfig(), edges);
    expect(v).toHaveLength(1);
    expect(v[0].kind).toBe("layer");
  });

  it("allows ui importing domain", () => {
    const edges: Edge[] = [
      {
        from: "src/ui/App.ts",
        to: "src/domain/user.ts",
        fromLayer: "ui",
        toLayer: "domain",
        specifier: "../domain/user",
      },
    ];
    expect(checkLayers(defaultConfig(), edges)).toHaveLength(0);
  });
});

describe("cycles", () => {
  it("detects a two-node cycle", () => {
    const cycles = findCycles([
      {
        from: "a.ts",
        to: "b.ts",
        fromLayer: "x",
        toLayer: "x",
        specifier: "./b",
      },
      {
        from: "b.ts",
        to: "a.ts",
        fromLayer: "x",
        toLayer: "x",
        specifier: "./a",
      },
    ]);
    expect(cycles.length).toBeGreaterThan(0);
  });
});
