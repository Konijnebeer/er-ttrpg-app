import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function Track({
  maxTrack,
  track,
  onChange,
  className,
  checkboxClassName,
}: {
  maxTrack:          number;
  track:             number;
  onChange:          (newTrack: number) => void;
  className?:        string;
  checkboxClassName?: string;
}) {
  const handleCheckboxChange = (index: number, checked: boolean) => {
    if (checked) {
      // When checking a box, set level to index + 1
      onChange(index + 1);
    } else {
      // When unchecking, set level to the previous box (index)
      onChange(index);
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length: maxTrack }, (_, index) => (
        <Checkbox
          key={index}
          className={checkboxClassName}
          checked={index < track}
          onCheckedChange={(checked) =>
            handleCheckboxChange(index, checked === true)
          }
        />
      ))}
    </div>
  );
}
