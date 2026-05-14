# Bridge-UI — Build, Testes e Desenvolvimento Local

## Status dos TODOs

- [ ] Criar `vite.config.ts` do core + atualizar `package.json` (main, types, exports, build script)
- [ ] Migrar todos os `@core/*` no source de vue/react para `@bridge-ui/core/*` + remover alias `@core` dos tsconfigs
- [ ] Criar `vite.config.ts` do vue + plugin vue + dts + atualizar `package.json`
- [ ] Criar `vite.config.ts` do react + dts + atualizar `package.json`
- [ ] Instalar deps de build (vite, plugins) + adicionar scripts de build na raiz
- [ ] Rodar build completo, verificar output em `dist/`
- [ ] `npm link` no projeto Inertia e validar consumo real
- [ ] Setup Vitest + testes unitários para `core/Utils` e `core/Config`
- [ ] Setup Vitest + testes unitários para `vue/Utils`, Provider e composables
- [ ] Setup Cypress Component Testing para componentes Vue
- [ ] Setup Cypress Component Testing para componentes React

---

## Situação Atual

- 3 pacotes (`core`, `vue`, `react`) em npm workspaces
- `vue` e `react` têm script `vite build` mas **nenhum `vite.config.ts` existe**
- `core` não tem build script — é consumido como source TS via path aliases
- **Zero setup de testes** (sem vitest, jest, cypress)
- **Sem `main`/`exports` configurados** nos pacotes vue e react
- `@core/*` alias em vue/react aponta para `../core/src/*` (source direto) — **será migrado para `@bridge-ui/core/*`**

---

## Fase 1: Build Pipeline com Vite

### Estratégia

```
@bridge-ui/core ──dependency──▶ @bridge-ui/vue
                ──dependency──▶ @bridge-ui/react

Projeto Inertia ──instala──▶ @bridge-ui/vue
                ──instala──▶ @bridge-ui/react
```

- **3 pacotes publicados separadamente** no npm
- **ESM-only** (`.js` com `"type": "module"`)
- **`preserveModules`** no Rollup para manter a estrutura de arquivos no dist — necessário porque vue/react fazem deep imports como `@bridge-ui/core/Components/Alert/Padding`
- **`vite-plugin-dts`** para gerar `.d.ts` automaticamente
- **CSS**: copiar `theme.css` para dist; consumidor faz `import "@bridge-ui/vue/theme.css"`

### Dependências a instalar (root devDependencies)

```bash
npm install -D vite vite-plugin-dts @vitejs/plugin-vue
```

### 1.0 Pré-requisito: Migrar `@core/*` → `@bridge-ui/core/*`

Antes de configurar o build, trocar todos os imports `@core/*` nos pacotes vue e react para `@bridge-ui/core/*`. Isso elimina a necessidade de plugins de reescrita durante o build.

**Por quê**: O workspace resolution do npm resolve `@bridge-ui/core/Components/Alert/Padding` para `packages/core/src/Components/Alert/Padding.ts` durante dev (graças ao campo `"exports": { "./*": "./src/*" }` do core). Em produção, resolve para o `dist/` publicado. Mesma sintaxe nos dois ambientes.

**O que fazer**:

1. Trocar todos os `@core/` por `@bridge-ui/core/` nos arquivos `.ts`, `.tsx` e `.vue` de vue e react:

```bash
# Arquivos afetados (vue):
# - src/Utils/index.ts
# - src/Components/Alert/composables/useAlert.ts
# - src/augments.ts
# - src/Components/Icon/Icon.vue (se tiver)

# Arquivos afetados (react):
# - src/Utils/index.ts
# - src/Components/Icon/Icon.tsx
# - src/augments.ts
```

2. Remover `"@core/*"` dos `paths` em `packages/vue/tsconfig.json` e `packages/react/tsconfig.json`

3. Manter `"@core/*"` apenas no `packages/core/tsconfig.json` (auto-referência interna do core)

**Resultado**: Imports no source ficam idênticos ao que o consumidor final usa. Zero transformação de paths no build.

### 1.1 Core — `packages/core/vite.config.ts`

- Usar `readdirSync` recursivo para descobrir todos os `.ts` em `src/` como entries (deep imports precisam existir no dist)
- Alias: `@core` → `src/` (apenas para o build interno do core)
- External: `es-toolkit/*`, `clsx`, `tailwind-merge`
- Output: `preserveModules: true`, `preserveModulesRoot: "src"`
- Plugin: `vite-plugin-dts` para gerar `.d.ts`

```typescript
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const srcDir = resolve(__dirname, "src");

const entries = Object.fromEntries(
  (readdirSync(srcDir, { recursive: true }) as string[])
    .filter((f) => f.endsWith(".ts"))
    .map((f) => [f.replace(/\.ts$/, ""), resolve(srcDir, f)]),
);

export default defineConfig({
  plugins: [dts({ tsconfigPath: "./tsconfig.json" })],
  resolve: {
    alias: { "@core": resolve(__dirname, "src") },
  },
  build: {
    lib: { entry: entries, formats: ["es"] },
    rollupOptions: {
      external: [/^es-toolkit/, "clsx", "tailwind-merge"],
      output: { preserveModules: true, preserveModulesRoot: "src" },
    },
  },
});
```

Atualizar `packages/core/package.json`:

```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./*": {
      "types": "./dist/*.d.ts",
      "import": "./dist/*.js"
    }
  },
  "scripts": {
    "build": "vite build",
    "type-check": "tsc --noEmit"
  }
}
```

### 1.2 Vue — `packages/vue/vite.config.ts`

- Alias: `@` → `src/` (imports internos do pacote vue)
- External: `vue`, `lucide-vue-next`, `@bridge-ui/core/*`, `es-toolkit/*`, `clsx`, `tailwind-merge`
- **Sem plugin de reescrita** — imports `@bridge-ui/core/*` já estão corretos no source após a migração do passo 1.0

```typescript
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: "./tsconfig.json" })],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  build: {
    lib: { entry: resolve(__dirname, "src/index.ts"), formats: ["es"] },
    rollupOptions: {
      external: [
        "vue",
        "lucide-vue-next",
        /^@bridge-ui\/core/,
        /^es-toolkit/,
        "clsx",
        "tailwind-merge",
      ],
      output: { preserveModules: true, preserveModulesRoot: "src" },
    },
  },
});
```

Atualizar `packages/vue/package.json`:

```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./theme.css": "./dist/theme.css"
  },
  "scripts": {
    "build": "vite build && cp src/theme.css dist/theme.css",
    "dev": "vite build --watch",
    "type-check": "vue-tsc --noEmit"
  }
}
```

Mover `@bridge-ui/core` de `dependencies` para `peerDependencies`.

### 1.3 React — `packages/react/vite.config.ts`

Mesma estrutura do Vue, sem `@vitejs/plugin-vue`, com external para `react`, `react-dom`, `lucide-react`.

```typescript
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [dts({ tsconfigPath: "./tsconfig.json" })],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  build: {
    lib: { entry: resolve(__dirname, "src/index.ts"), formats: ["es"] },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "lucide-react",
        /^@bridge-ui\/core/,
        /^es-toolkit/,
        "clsx",
        "tailwind-merge",
      ],
      output: { preserveModules: true, preserveModulesRoot: "src" },
    },
  },
});
```

Atualizar `packages/react/package.json` — mesma estrutura do vue (sem `./theme.css` se não precisar, ou com).

### 1.4 Build order e scripts na raiz

Atualizar `package.json` (raiz):

```json
{
  "scripts": {
    "build": "npm run build -w @bridge-ui/core && npm run build -w @bridge-ui/vue && npm run build -w @bridge-ui/react",
    "build:core": "npm run build -w @bridge-ui/core",
    "build:vue": "npm run build -w @bridge-ui/vue",
    "build:react": "npm run build -w @bridge-ui/react",
    "dev": "npm run dev -w @bridge-ui/vue & npm run dev -w @bridge-ui/react"
  }
}
```

Core **deve** buildar primeiro (vue/react dependem dele).

---

## Fase 2: Testes

### Estratégia

- **Vitest** para unit tests (integra nativamente com Vite, reutiliza config de aliases)
- **Cypress Component Testing** para testes de browser/visual dos componentes Vue e React
- Testes de componentes **co-locados** dentro da pasta de cada componente
- Testes de Provider/Utils/Config em pastas `__tests__` dentro de cada módulo

### Dependências a instalar

```bash
# Root devDeps
npm install -D vitest happy-dom cypress

# Vue devDeps
npm install -D @vue/test-utils -w @bridge-ui/vue

# React devDeps
npm install -D @testing-library/react -w @bridge-ui/react
```

### Estrutura de diretórios

```
packages/core/
  src/
    Utils/__tests__/
      cn.test.ts
      mergeLayeredClasses.test.ts
      mergeStringMap.test.ts
      mergePropsWithDefaults.test.ts
    Config/__tests__/
      merge.test.ts

packages/vue/
  src/
    Components/
      Alert/__tests__/
        useAlert.test.ts          (vitest — lógica do composable)
        Alert.cy.ts               (cypress — render + interação)
      Icon/__tests__/
        Icon.cy.ts
    Provider/__tests__/
      createBridgeUI.test.ts
      createBridgeUIApi.test.ts
    Utils/__tests__/
      useBridgeUIComponent.test.ts

packages/react/
  src/
    Components/
      Icon/__tests__/
        Icon.cy.tsx
    Provider/__tests__/
      BridgeUIProvider.test.tsx
```

### 2.1 Vitest

- Criar `vitest.workspace.ts` na raiz para workspace mode:

```typescript
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "packages/core/vitest.config.ts",
  "packages/vue/vitest.config.ts",
  "packages/react/vitest.config.ts",
]);
```

- Cada pacote tem seu `vitest.config.ts` que reutiliza os aliases do `vite.config.ts`
- Scripts por pacote: `"test": "vitest"`, `"test:run": "vitest run"`
- Script na raiz: `"test": "vitest --workspace vitest.workspace.ts"`

### 2.2 Cypress Component Testing

- `cypress.config.ts` em `packages/vue/` e `packages/react/`
- Configurar `devServer` do Cypress para usar Vite (suportado nativamente)
- Componentes Vue: `cy.mount(Alert, { props: { ... } })`
- Componentes React: `cy.mount(<Alert color="error">...</Alert>)`

### 2.3 Scripts na raiz

```json
{
  "test": "vitest --workspace vitest.workspace.ts",
  "test:run": "vitest run --workspace vitest.workspace.ts",
  "test:cy:vue": "npm run test:cy -w @bridge-ui/vue",
  "test:cy:react": "npm run test:cy -w @bridge-ui/react"
}
```

---

## Fase 3: Consumo Local no Projeto Inertia

### Opção recomendada: `npm link`

```bash
# 1. Build inicial
cd Bridge-UI/core
npm run build

# 2. Linkar cada pacote
cd packages/core && npm link
cd ../vue && npm link

# 3. No projeto Inertia, consumir os links
cd ~/projeto-inertia
npm link @bridge-ui/core @bridge-ui/vue

# 4. Dev com watch (rebuilda automaticamente)
cd Bridge-UI/core
npm run dev   # vite build --watch em vue e react
```

O Inertia (se usa Vite) detecta mudanças no link e faz HMR.

### Alternativa: `file:` protocol

No `package.json` do projeto Inertia:

```json
{
  "dependencies": {
    "@bridge-ui/core": "file:../Bridge-UI/core/packages/core",
    "@bridge-ui/vue": "file:../Bridge-UI/core/packages/vue"
  }
}
```

Mais persistente (sobrevive a `npm install`), mas requer `npm install` para atualizar.

---

## Ordem de execução recomendada

1. **Build** primeiro — sem build não dá para testar nem consumir localmente
2. **Testar localmente** no Inertia — validar que o build funciona antes de investir em testes automatizados
3. **Vitest** nos utilitários do core (funções puras, fácil de testar)
4. **Vitest** nos composables/hooks Vue e React
5. **Cypress** nos componentes visuais (requer componentes funcionais, que você valida no passo 2)
