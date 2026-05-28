// ** Local Imports
import type { UseFormFieldReturn } from "@/Components/FormField/hooks/useFormField";
import type { ReactNode } from "react";

function OutlinedFormField({
  api,
  children,
}: {
  children?: ReactNode;
  api: UseFormFieldReturn;
}) {
  return <div>{JSON.stringify(api)}</div>;
}

export default OutlinedFormField;
