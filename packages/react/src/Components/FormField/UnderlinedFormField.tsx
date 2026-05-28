// ** Local Imports
import type { UseFormFieldReturn } from "@/Components/FormField/hooks/useFormField";
import type { ReactNode } from "react";

function UnderlinedFormField({
  api,
  children,
}: {
  children?: ReactNode;
  api: UseFormFieldReturn;
}) {
  return <div>{JSON.stringify(api)}</div>;
}

export default UnderlinedFormField;
