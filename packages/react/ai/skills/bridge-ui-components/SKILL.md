---
name: bridge-ui-components
description: >-
  Use Bridge UI React components — Button, Avatar, Card, Alert, Badge, Icon,
  Link, List, Tabs, Spinner, Skeleton, Progress, TextField, Select,
  Autocomplete, DateField, DatePicker, DateRangeField, DateRangePicker,
  TimeField, TimePicker, DateTimeField, DateTimePicker, classes, customProps,
  slots. Use when building UI with Bridge components.
---

# Bridge UI (React) — components

Do **not** invent APIs. Copy examples from `.ai/docs/components/{Component}.md` (package: `docs/components/{Component}.md`).

## Start here

| Need                          | Doc                                                                      |
| ----------------------------- | ------------------------------------------------------------------------ |
| Actions                       | `.ai/docs/components/Button.md`                                          |
| Surfaces / modal body         | `.ai/docs/components/Card.md`                                            |
| Avatar                        | `.ai/docs/components/Avatar.md`                                          |
| Badge                         | `.ai/docs/components/Badge.md`                                           |
| Alert                         | `.ai/docs/components/Alert.md`                                           |
| Icon                          | `.ai/docs/components/Icon.md`                                            |
| Lists                         | `.ai/docs/components/List.md`                                            |
| Tabs                          | `.ai/docs/components/Tabs.md`                                            |
| Text input                    | `.ai/docs/components/TextField.md`                                       |
| Select / autocomplete         | `.ai/docs/components/Select.md`, `Autocomplete.md`                       |
| Date                          | `.ai/docs/components/DateField.md`, `DatePicker.md`                      |
| Date range                    | `.ai/docs/components/DateRangeField.md`, `DateRangePicker.md`            |
| Time                          | `.ai/docs/components/TimeField.md`, `TimePicker.md`                      |
| Time range                    | `.ai/docs/components/TimeRangeField.md`, `TimeRangePicker.md`            |
| Date-time                     | `.ai/docs/components/DateTimeField.md`, `DateTimePicker.md`              |
| Date-time range               | `.ai/docs/components/DateTimeRangeField.md`, `DateTimeRangePicker.md`    |
| Spinner / skeleton / progress | `.ai/docs/components/Spinner.md`, `Skeleton.md`, `Progress.md`           |
| Index                         | `.ai/docs/README.md`                                                     |

## Hard rules

1. Import from `@bridge-ui/react/Components/{Name}`.
2. Prefer Bridge tokens (`color`, `size`, `variant`, `density`) when they exist.
3. `classes` / `customProps` / `slots` follow the shapes in each component doc.
4. Root HTML attributes stay on the component; use `customProps` for **inner** parts.
5. Modal/Drawer content uses **`Card`** — there is no `ModalCard` export.
6. Do not compare Bridge to other UI libraries in generated docs or comments.
7. Prefer `*Field` / `*Picker` for date and time. Use `Calendar` / `CalendarRange` / `TimePanel` only for custom composition — see index.
