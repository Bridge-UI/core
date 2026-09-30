# @bridge-ui/react — docs

Component reference for **React**. This folder ships with the npm package.

## Components

- [Accordion](./components/Accordion.md)
- [ActionFooter](./components/ActionFooter.md)
- [Alert](./components/Alert.md)
- [Autocomplete](./components/Autocomplete.md)
- [Avatar](./components/Avatar.md)
- [Badge](./components/Badge.md)
- [BaseField](./components/BaseField.md)
- [BridgeUIProvider](./components/BridgeUIProvider.md)
- [Breadcrumb](./components/Breadcrumb.md)
- [Button](./components/Button.md)
- [ButtonGroup](./components/ButtonGroup.md)
- [Calendar](./components/Calendar.md)
- [CalendarDate](./components/CalendarDate.md)
- [CalendarMonth](./components/CalendarMonth.md)
- [CalendarRange](./components/CalendarRange.md)
- [CalendarYear](./components/CalendarYear.md)
- [Card](./components/Card.md)
- [Carousel](./components/Carousel.md)
- [Chart](./components/Chart.md)
- [Checkbox](./components/Checkbox.md)
- [ColorField](./components/ColorField.md)
- [ColorPicker](./components/ColorPicker.md)
- [DataTable](./components/DataTable.md)
- [DateField](./components/DateField.md)
- [DatePicker](./components/DatePicker.md)
- [DateRangeField](./components/DateRangeField.md)
- [DateRangePicker](./components/DateRangePicker.md)
- [DateTimeField](./components/DateTimeField.md)
- [DateTimePicker](./components/DateTimePicker.md)
- [DateTimeRangeField](./components/DateTimeRangeField.md)
- [DateTimeRangePicker](./components/DateTimeRangePicker.md)
- [Divider](./components/Divider.md)
- [Drawer](./components/Drawer.md)
- [EmptyState](./components/EmptyState.md)
- [FileUpload](./components/FileUpload.md)
- [FormControl](./components/FormControl.md)
- [FormField](./components/FormField.md)
- [I18n](./components/I18n.md)
- [Icon](./components/Icon.md)
- [Label](./components/Label.md)
- [Link](./components/Link.md)
- [List](./components/List.md)
- [Menu](./components/Menu.md)
- [Modal](./components/Modal.md)
- [NumberField](./components/NumberField.md)
- [OtpField](./components/OtpField.md)
- [Pagination](./components/Pagination.md)
- [PasswordField](./components/PasswordField.md)
- [Progress](./components/Progress.md)
- [Radio](./components/Radio.md)
- [Rating](./components/Rating.md)
- [RichTextEditor](./components/RichTextEditor.md)
- [Select](./components/Select.md)
- [Sidebar](./components/Sidebar.md)
- [Skeleton](./components/Skeleton.md)
- [Slider](./components/Slider.md)
- [Snackbar](./components/Snackbar.md)
- [Spinner](./components/Spinner.md)
- [Stepper](./components/Stepper.md)
- [Switch](./components/Switch.md)
- [Table](./components/Table.md)
- [Tabs](./components/Tabs.md)
- [Textarea](./components/Textarea.md)
- [TextField](./components/TextField.md)
- [TimeField](./components/TimeField.md)
- [TimePanel](./components/TimePanel.md)
- [TimePicker](./components/TimePicker.md)
- [TimeRangeField](./components/TimeRangeField.md)
- [TimeRangePicker](./components/TimeRangePicker.md)
- [ToggleGroup](./components/ToggleGroup.md)
- [Tooltip](./components/Tooltip.md)
- [useBreakpoint](./components/useBreakpoint.md)
- [useDialogAction](./components/useDialogAction.md)
- [useDrawerAction](./components/useDrawerAction.md)
- [useModalAction](./components/useModalAction.md)
- [useSnackbarAction](./components/useSnackbarAction.md)

## Theme CSS

- [Scroll utilities](./ScrollUtilities.md)

## Adapters

Ready-made adapters ship in the separate `@bridge-ui/adapters` package. Install it, import from a subpath, and install the matching optional peer (date lib, icon set, or i18n lib).

```bash
npm install @bridge-ui/adapters
```

- `@bridge-ui/adapters/react/date-date-fns`
- `@bridge-ui/adapters/react/date-dayjs`
- `@bridge-ui/adapters/react/date-luxon`
- `@bridge-ui/adapters/react/date-moment`
- `@bridge-ui/adapters/react/icon-lucide`
- `@bridge-ui/adapters/react/icon-heroicons`
- `@bridge-ui/adapters/react/icon-tabler`
- `@bridge-ui/adapters/react/icon-phosphor`
- `@bridge-ui/adapters/react/icon-fontawesome`
- `@bridge-ui/adapters/react/i18n-dictionary`
- `@bridge-ui/adapters/react/i18n-i18next`

### Migrating from `Adapters/Examples`

`@bridge-ui/react/Adapters/Examples/*` was removed. Swap the import prefix — factory names are unchanged:

| Before                                      | After                              |
| ------------------------------------------- | ---------------------------------- |
| `@bridge-ui/react/Adapters/Examples/<name>` | `@bridge-ui/adapters/react/<name>` |

`@bridge-ui/react` no longer declares the adapter libraries as peers. Keep them in your app dependencies. No extra Tailwind `@source` is needed.
