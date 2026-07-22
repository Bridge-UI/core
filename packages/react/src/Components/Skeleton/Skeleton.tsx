// ** Local Imports
import type { SkeletonProps } from "@/Components/Skeleton";
import { useSkeleton } from "@/Components/Skeleton";

function Skeleton(props: SkeletonProps) {
  const { rootBind } = useSkeleton(props, {
    rounded: "md",
  });

  return <div {...rootBind} />;
}

export default Skeleton;
