import { Checkbox } from "@/components/ui/checkbox";

export function Track({
  maxTrack,
  track,
  onChange,
}: {
  maxTrack: number;
  track:   number;
  onChange: (newTrack: number) => void;
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
    <div className="flex gap-2">
      {Array.from({ length: maxTrack }, (_, index) => (
        <Checkbox
          key={index}
          checked={index < track}
          onCheckedChange={(checked) =>
            handleCheckboxChange(index, checked === true)
          }
        />
      ))}
    </div>
  );
}
