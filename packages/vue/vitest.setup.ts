// ** Local Imports
import { createMockIconAdapter } from "@/Adapters/Icon/mockIconAdapter";
import { setIconAdapterForTests } from "@/Adapters/Icon/useIconAdapter";
import { createMockRichTextAdapter } from "@/Adapters/RichText/mockRichTextAdapter";
import { setRichTextAdapterForTests } from "@/Adapters/RichText/useRichTextAdapter";

setIconAdapterForTests(createMockIconAdapter());
setRichTextAdapterForTests(createMockRichTextAdapter());
