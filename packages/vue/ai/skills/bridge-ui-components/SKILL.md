---
name: bridge-ui-components
description: >-
  Use Bridge UI Vue presentational components — Button, Avatar, Card, Alert,
  Badge, Icon, Link, List, Tabs, Spinner, Skeleton, Progress, classes,
  customProps, slots. Use when building UI outside forms and overlays.
---

# Bridge UI (Vue) — components

Do **not** invent APIs. Copy examples from `.ai/docs/components/{Component}.md` (package: `docs/components/{Component}.md`).

In templates, use kebab-case attrs (`start-icon`, `custom-props`, `error-message`).

## Start here

| Need                          | Doc                                                            |
| ----------------------------- | -------------------------------------------------------------- |
| Actions                       | `.ai/docs/components/Button.md`                                |
| Surfaces / modal body         | `.ai/docs/components/Card.md`                                  |
| Avatar                        | `.ai/docs/components/Avatar.md`                                |
| Badge                         | `.ai/docs/components/Badge.md`                                 |
| Alert                         | `.ai/docs/components/Alert.md`                                 |
| Icon                          | `.ai/docs/components/Icon.md`                                  |
| Lists                         | `.ai/docs/components/List.md`                                  |
| Tabs                          | `.ai/docs/components/Tabs.md`                                  |
| Spinner / skeleton / progress | `.ai/docs/components/Spinner.md`, `Skeleton.md`, `Progress.md` |
| Index                         | `.ai/docs/README.md`                                           |

## Hard rules

1. Import from `@bridge-ui/vue/Components/{Name}`.
2. Prefer Bridge tokens (`color`, `size`, `variant`, `density`) when they exist.
3. `:classes` / `:custom-props` / named slots follow each component doc.
4. Root HTML attributes stay on the component; use `custom-props` for **inner** parts.
5. Modal/Drawer content uses **`Card`** — there is no `ModalCard` export.
6. Do not compare Bridge to other UI libraries in generated docs or comments.
