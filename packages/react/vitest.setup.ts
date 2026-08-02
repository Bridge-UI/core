// ** Local Imports
import { setIconAdapterForTests } from "@/Adapters/Icon/useIconAdapter";
import { createLucideIconAdapter } from "@examples/adapters/react/icon-lucide";

setIconAdapterForTests(createLucideIconAdapter());
