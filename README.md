<p align="center">
  <img src="logo.png" alt="modfence" width="160" height="160" />
</p>

# modfence

TypeScript import-boundary linter. Declare layers, say which layers may import which, and fail CI when someone reaches across the fence.

[![CI](https://github.com/theworker02/modfence/actions/workflows/ci.yml/badge.svg)](https://github.com/theworker02/modfence/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@magnexis/modfence.svg)](https://www.npmjs.com/package/@magnexis/modfence)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Install

```bash
npm install -g @magnexis/modfence
npx @magnexis/modfence --help
```

Requires Node.js 20+.

## Why

`eslint-plugin-import` can ban paths, but teams usually want a *layer* story: UI may talk to domain, domain must not talk to infra, infra may implement domain. Cycles still sneak in. modfence is a dedicated CLI for that policy — including `why` (explain a file) and `graph` (Mermaid of observed layer edges).

## Quick start

```bash
npx @magnexis/modfence init
npx @magnexis/modfence check
```

`modfence.json`:

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

Same-layer imports are always allowed. External packages (`react`, `node:fs`) are ignored.

## CLI

```text
modfence init              Write starter modfence.json
modfence check [--json]    Exit 1 on layer or cycle violations
modfence why <file>        Layer + outbound relative imports
modfence graph             Mermaid flowchart of layer → layer edges
```

CI:

```yaml
- run: npx @magnexis/modfence check --json
```

## Library

```ts
import { checkLayers, collectEdges, defaultConfig } from "@magnexis/modfence";

const config = defaultConfig();
const edges = await collectEdges({ ...config, root: process.cwd() });
const violations = checkLayers(config, edges);
```

## Development

```bash
git clone https://github.com/theworker02/modfence.git
cd modfence
npm install
npm test
npm run build
```

## License

MIT. Sponsor via [GitHub](https://github.com/sponsors/theworker02) or [thanks.dev](https://thanks.dev/u/gh/theworker02).
