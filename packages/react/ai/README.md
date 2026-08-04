# AI resources (React)

Consumer guidelines and Agent Skills for `@bridge-ui/react`.

Component **examples live in** [`../docs/components/`](../docs/components/). Adapter samples: [`../docs/examples/`](../docs/examples/). Skills only route agents to those pages.

```bash
npx bridge-ui-react-ai install
```

## What gets installed

| Path                           | Role                                                           |
| ------------------------------ | -------------------------------------------------------------- |
| `AGENTS.md` (root)             | Short stub / inject block — auto-loaded by Cursor, Codex, etc. |
| `CLAUDE.md`                    | Symlink (or copy) to root `AGENTS.md` for Claude Code          |
| `llms.txt`                     | Short package index some tools/LLMs look for                   |
| `.ai/AGENTS.md`                | Full agent guide                                               |
| `.ai/guidelines/`, `.ai/docs/` | Guidelines and component/example docs                          |
| `.cursor/skills/bridge-ui-*`   | On-demand Agent Skills                                         |

## `npx` / bin link

`npx bridge-ui-react-ai` resolves the bin from `node_modules/.bin`. After upgrading Bridge (especially with local `file:` installs), run `npm install` again so the bin link exists.

Fallbacks if `npx` hits the registry (404):

```bash
npx --package=@bridge-ui/react bridge-ui-react-ai install
node node_modules/@bridge-ui/react/bin/ai.mjs install
```

## Dual React + Vue

Install destinations collide (`.ai/`, `llms.txt`, skills, root stub). In apps that use both packages, run the AI install for **one** framework only.
