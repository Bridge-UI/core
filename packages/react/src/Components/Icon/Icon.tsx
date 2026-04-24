// ** External Imports
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// ** Local Imports
import type { IconProps } from "@/Components/Icon/icon.types";
import { sizeProps } from "@/Components/Icon/props/Size";

function Icon({ className, size = "md", icon: IconComponent }: IconProps) {
  return (
    <IconComponent className={twMerge(clsx(sizeProps[size], className))} />
  );
}

export default Icon;
