// ** Local Imports
import { setIconAdapterForTests } from "@/Adapters/Icon/useIconAdapter";
import { createLucideIconAdapter } from "@examples/adapters/vue/icon-lucide";

setIconAdapterForTests(createLucideIconAdapter());
