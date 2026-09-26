// ** Local Imports
import BaseField from "@/Components/BaseField/BaseField";
import { Icon } from "@/Components/Icon";
import { useRating } from "@/Components/Rating/hooks/useRating";
import type { RatingProps } from "@/Components/Rating/rating.types";

function Rating(props: RatingProps) {
  const api = useRating(props);

  const { icon, items, inputBind, groupBind, baseField, setItemRef } = api;

  return (
    <BaseField field={baseField}>
      <div {...groupBind}>
        {items.map((item) => (
          <button
            key={item.value}
            {...item.itemBind}
            ref={(node) => {
              setItemRef(item.value, node);
            }}
          >
            {item.fill > 0 && item.fill < 1 ? (
              <span className="relative inline-flex">
                <Icon icon={icon} {...item.emptyIconBind} />

                <span
                  style={{ width: `${item.fill * 100}%` }}
                  className="absolute inset-y-0 inset-s-0 overflow-hidden"
                >
                  <Icon icon={icon} {...item.filledIconBind} />
                </span>
              </span>
            ) : (
              <Icon icon={icon} {...item.iconBind} />
            )}
          </button>
        ))}

        <input {...inputBind} />
      </div>
    </BaseField>
  );
}

export default Rating;
