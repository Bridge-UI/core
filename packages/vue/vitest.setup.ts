// ** Local Imports
import { createLucideIconAdapter } from "@/Adapters/Examples/icon-lucide";
import { setIconAdapterForTests } from "@/Adapters/Icon/useIconAdapter";
import { createMockRichTextAdapter } from "@/Adapters/RichText/mockRichTextAdapter";
import { setRichTextAdapterForTests } from "@/Adapters/RichText/useRichTextAdapter";

setIconAdapterForTests(createLucideIconAdapter());
setRichTextAdapterForTests(createMockRichTextAdapter());
