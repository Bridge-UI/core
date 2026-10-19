// ** Local Imports
import { createMockIconAdapter } from "@/Adapters/Icon/mockIconAdapter";
import { setIconAdapterForTests } from "@/Adapters/Icon/useIconAdapter";

setIconAdapterForTests(createMockIconAdapter());
