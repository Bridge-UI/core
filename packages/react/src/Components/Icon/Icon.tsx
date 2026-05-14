// ** External Imports
import { get } from "es-toolkit/compat";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import { sizeProps } from "@bridge-ui/core/Components/Icon/Size";

// ** Local Imports
import type { IconProps } from "@/Components/Icon/icon.types";

function Icon({ className, size = "md", icon: IconComponent }: IconProps) {
  return <IconComponent className={cn(get(sizeProps, size), className)} />;
}

export default Icon;
