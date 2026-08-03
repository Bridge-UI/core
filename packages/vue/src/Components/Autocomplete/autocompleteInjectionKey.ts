// ** External Imports
import type { InjectionKey } from "vue";

// ** Local Imports
import type { SelectOption } from "@/Components/Autocomplete/autocomplete.types";

export type AutocompleteOptionRegistration = {
  register: (option: SelectOption) => void;
  unregister: (value: SelectOption["value"]) => void;
};

export const AUTOCOMPLETE_OPTION_KEY = Symbol(
  "AutocompleteOption",
) as InjectionKey<AutocompleteOptionRegistration>;
