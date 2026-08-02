// ** Exports
export { createI18nAdapter, resolveMessage } from "@/Adapters/i18n";
export type { I18nAdapter, MessageParams, MessageValue } from "@/Adapters/i18n";
export {
  SEMANTIC_ICON_NAMES,
  createIconAdapter,
  isSemanticIconName,
  resolveIconSource,
} from "@/Adapters/icon";
export type {
  IconAdapter,
  IconSource,
  SemanticIconName,
  SemanticIconNameOverrides,
} from "@/Adapters/icon";
