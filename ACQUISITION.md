# Acquisition Brief â€” modfence

**Date:** 2026-09-22  
**Repository:** https://github.com/theworker02/modfence  
**Default branch:** `main`  
**Primary language:** TypeScript  
**Status:** Diligence briefing only. **No acquisition has occurred** by virtue of this file.  
**License:** Proprietary â€” sale, written commercial license, or completed asset transfer required (see root `LICENSE`).  
**Valuation:** Not stated.  
**Contact:** GitHub [@theworker02](https://github.com/theworker02) Â· [thanks.dev/u/gh/theworker02](https://thanks.dev/u/gh/theworker02)

> Cloning or forking this repository does **not** grant production, redistribution, SaaS, OEM, or commercial rights.

---

## 1. Executive thesis

<img src="logo.png" alt="modfence" width="160" height="160" /> TypeScript import-boundary linter. Declare layers, say which layers may import which, and fail CI when someone reaches across the fence. `eslint-plugin-import` can ban paths, but teams usually want a *layer* story: UI may talk to domain, domain must not talk to infra, infra may implement domain. Cycles still sneak in. modfence is a dedicated CLI for that policy Ã¢â‚¬â€ including `why` (explain a file) and `graph` (Mermaid of observed layer edges).

**Why a buyer cares:** modfence packages transferable product IP â€” source, docs, in-repo brand assets, and a diligence room under `docs/acquisition/` â€” under a clear proprietary posture so diligence can proceed without mistaking the repo for open source.

---

## 2. Product snapshot

| Item | Detail |
|------|--------|
| Product | modfence |
| Repo | `theworker02/modfence` |
| Language | TypeScript |
| Open source? | **No** â€” proprietary |
| Rightsholder | theworker02 |
| Diligence pack | `docs/acquisition/` |

### Capability highlights (from current materials)

- Core product sources and documentation in this repository
- Proprietary commercial packaging (LICENSE + ACQUISITION.md)
- Buyer diligence materials under docs/acquisition/

---

## 3. Problem / opportunity

Teams evaluating modfence typically need either (a) a commercial right to run or embed it, or (b) outright ownership of the Product IP for strategic build-out. Public GitHub visibility without a proprietary license creates false assumptions about free production use. This brief and the linked data room make the commercial path explicit.

---

## 4. What ships today

Honest maturity: treat repository contents, README claims, tests, and release tags as the source of truth. Do not assume production customers, ARR, filed patents, or SLAs unless separately evidenced in diligence.

Typical transferable surfaces:

- Source tree and build/test scripts present in-repo
- Documentation and design notes
- Acquisition / diligence markdown under `docs/acquisition/`
- Branding assets committed to the repository (if any)

---

## 5. Demo / evaluation path (buyer)

Minimal path (no secrets required unless README says otherwise):

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

Extended evaluation: `docs/acquisition/BUYER_EVALUATION.md`. Written NDA / evaluation grants may be required for private materials.

---

## 6. What a transaction typically includes

Subject to definitive schedules:

| Included (typical) | Excluded (typical) |
|--------------------|--------------------|
| Repo materials + asserted original IP | Seller personal accounts / unrelated repos |
| Docs + diligence room at closing | Third-party dependency source under separate licenses |
| In-repo brand marks as assigned | Secrets without rotation plan |
| Know-how captured in docs | Fabricated revenue, user, or adoption metrics |

---

## 7. Suggested deal structures

| Structure | When it fits |
|-----------|--------------|
| Non-exclusive commercial license | Deploy/run under seat or environment terms |
| Exclusive field-of-use license | Buyer wants exclusivity; seller may retain entity |
| Asset / IP assignment | Buyer wants ownership of Materials outright |
| OEM / redistribution | Separate agreement â€” not implied here |

Commercial terms (price, earnouts, escrow) are negotiated under NDA with counsel.

---

## 8. Buyer diligence checklist

- [ ] Confirm Rightsholder identity and authority to sell/license
- [ ] Inventory Materials (`docs/acquisition/ASSET_INVENTORY.md`)
- [ ] Review IP posture (`IP_PROVENANCE.md`) and dependencies (`DEPENDENCY_INVENTORY.md`)
- [ ] Run evaluation script (`BUYER_EVALUATION.md`)
- [ ] Review risks (`RISK_REGISTER.md`)
- [ ] Agree transfer scope (`TRANSFER_MANIFEST.md`) and handoff (`HANDOFF_CHECKLIST.md`)
- [ ] Supersede root `LICENSE` at closing via definitive agreement

---

## 9. Related documents

| Document | Purpose |
|----------|---------|
| `LICENSE` | Proprietary â€” no default grant |
| `docs/acquisition/README.md` | Data-room index |
| `docs/acquisition/EXECUTIVE_SUMMARY.md` | One-page thesis |
| `README.md` | Product overview |
| `SECURITY.md` | Vulnerability reporting |
| `COMMERCIAL.md` | Licensing contact path |
| `.github/FUNDING.yml` | Sponsors / thanks.dev |

---

## 10. Disclaimer

This package is informational and **does not** create a binding offer, grant of rights, or investment advice. Engage counsel for any transaction.

---

*Document version: 2.0.0 / 2026-09-22 Â· Classification: acquisition briefing*
