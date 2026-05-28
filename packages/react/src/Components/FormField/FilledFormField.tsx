// ** Local Imports
import type { UseFormFieldReturn } from "@/Components/FormField/hooks/useFormField";
import type { ReactNode } from "react";

function FilledFormField({
  api,
  children,
}: {
  children?: ReactNode;
  api: UseFormFieldReturn;
}) {
  return <div>{JSON.stringify(api)}</div>;
}

export default FilledFormField;
