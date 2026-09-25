// ** Local Imports
import { FormControl } from "@/Components/FormControl";
import { Icon } from "@/Components/Icon";
import { useRating } from "@/Components/Rating/hooks/useRating";
import type { RatingProps } from "@/Components/Rating/rating.types";

const ratingLibDefaults = {
  max: 5,
  size: "md",
  icon: "star",
  rounded: "sm",
  color: "primary",
} as const;

function Rating(props: RatingProps) {
  const { icon, items, inputBind, groupBind, setItemRef, formControl } =
    useRating(props, ratingLibDefaults);

  return (
    <FormControl field={formControl}>
      <div {...groupBind}>
        {items.map((item) => (
          <button
            key={item.value}
            {...item.itemBind}
            ref={(node) => {
              setItemRef(item.value, node);
            }}
          >
            <Icon icon={icon} {...item.iconBind} />
          </button>
        ))}

        <input {...inputBind} />
      </div>
    </FormControl>
  );
}

export default Rating;
