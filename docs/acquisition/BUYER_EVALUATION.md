# Buyer evaluation â€” modfence

## Goal

In 15â€“45 minutes, verify the Product builds or runs as documented and that proprietary notices are present.

## Steps

1. Confirm root `LICENSE` is proprietary and `ACQUISITION.md` exists.
2. Skim `README.md` install/run claims.
3. Execute:

```
```bash
npm install -g @magnexis/modfence
npx @magnexis/modfence --help
```
```bash
npx @magnexis/modfence init
npx @magnexis/modfence check
```
```json
{
  "root": ".",
  "forbidCycles": true,
  "layers": [
    { "name": "ui", "glob": "src/ui/**" },
    { "name": "domain", "glob": "src/domain/**" },
    { "name": "infra", "glob": "src/infra/**" }
  ],
  "allow": [
    { "from": "ui", "to": ["domain"] },
    { "from": "domain", "to": [] },
    { "from": "infra", "to": ["domain"] }
  ]
}
```
```text
modfence init              Write starter modfence.json
modfence check [--json]    Exit 1 on layer or cycle violations
modfence why <file>        Layer + outbound relative imports
modfence graph             Mermaid flowchart of layer Ã¢â€ â€™ layer edges
```
```yaml
- run: npx @magnexis/modfence check --json
```
```ts
import { checkLayers, collectEdges, defaultConfig } from "@magnexis/modfence";

const config = defaultConfig();
const edges = await collectEdges({ ...config, root: process.cwd() });
const violations = checkLayers(config, edges);
```
```

4. Run tests if present (`npm test`, `pytest`, `cargo test`, `go test ./...`, etc.).
5. Record README vs observed behavior gaps in workpapers.

## Pass criteria

- [ ] Clone succeeds
- [ ] Documented happy path works **or** failure is explained
- [ ] Minimal path needs no surprise secrets
- [ ] License notices intact

*Updated: 2026-09-22*
