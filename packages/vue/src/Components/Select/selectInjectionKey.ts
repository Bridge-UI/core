// ** External Imports
import type { InjectionKey } from "vue";

// ** Local Imports
import type { SelectOption } from "@/Components/Select/select.types";

export type SelectOptionRegistration = {
  register: (option: SelectOption) => void;
  unregister: (value: SelectOption["value"]) => void;
};

export const SELECT_OPTION_KEY = Symbol(
  "SelectOption",
) as InjectionKey<SelectOptionRegistration>;
