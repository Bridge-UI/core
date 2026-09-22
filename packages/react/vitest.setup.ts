// ** Local Imports
import { createLucideIconAdapter } from "@/Adapters/Examples/icon-lucide";
import { setIconAdapterForTests } from "@/Adapters/Icon/useIconAdapter";

setIconAdapterForTests(createLucideIconAdapter());
