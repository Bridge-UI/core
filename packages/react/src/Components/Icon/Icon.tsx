// ** External Imports
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// ** Core Imports
import { sizeProps } from "@core/Components/Icon/Size";

// ** Local Imports
import type { IconProps } from "@/Components/Icon/icon.types";

function Icon({ className, size = "md", icon: IconComponent }: IconProps) {
  return (
    <IconComponent className={twMerge(clsx(sizeProps[size], className))} />
  );
}

export default Icon;
