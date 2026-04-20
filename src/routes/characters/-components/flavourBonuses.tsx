import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CookingPot } from "lucide-react";
import { useState } from "react";
import { set } from "zod";

function FlavourBonusesModal() {
  const [pointsToSpend, setPointsToSpend] = useState(0);
  const [flavourBonuses, setFlavourBonuses] = useState<
    { type: "skill" | "edge"; value: string }[]
  >([]);

  // select handler to add to the array of bonuses

  const handleBonusSelect = (type: "skill" | "edge") => {
    // logic to add the selected bonus to the character
    if (type === "skill") {
      setFlavourBonuses((prev) => [...prev, { type, value: "" }]);
      setPointsToSpend(pointsToSpend - 1);
    }
    if (type === "edge") {
      setFlavourBonuses((prev) => [...prev, { type, value: "" }]);
      setPointsToSpend(pointsToSpend - 2);
    }
    console.log(`Selected bonus type: ${type}`);
  };

  // array of bonuses with their options

  // submit handler to add the selected bonus to the character and close the modal

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CookingPot />
          Flavour Bonuses
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Flavour Bonuses</DialogTitle>
          <DialogDescription>
            Here are the flavour bonuses available for your character.
          </DialogDescription>
        </DialogHeader>
        {/* put in how many flavour bonuses are available */}
        <div className="flex flex-row gap-4">
          <Label htmlFor="flavour-bonus-points">Points to spend</Label>
          <Input
            id="flavour-bonus-points"
            placeholder="Points to spent"
            type="number"
            className="[appearance:textfield] flex-1"
            min={0}
            max={10}
            value={pointsToSpend || ""}
            onChange={(e) =>
              setPointsToSpend(Math.min(parseInt(e.target.value) || 0, 10))
            }
          />
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <Label htmlFor="flavour-bonus-type">Bonus Type</Label>
          <Select
            onValueChange={(value) => {
              handleBonusSelect(value as "skill" | "edge");
              value = "";
            }}
          >
            <SelectTrigger
              className="md:w-auto w-full md:flex-1"
              id="flavour-bonus-type"
            >
              <SelectValue placeholder="Bonus Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="skill" disabled={pointsToSpend < 1}>
                  <span>Gain a bonus d6 on a specific skill*</span>
                  <span className="font-bold ml-auto">1</span>
                </SelectItem>
                <SelectItem value="edge" disabled={pointsToSpend < 2}>
                  <span>Gain an edge you do not possess*</span>
                  <span className="font-bold ml-auto">2</span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          {flavourBonuses.map((bonus, i) => (
            <div key={i} className="grid gap-4 grid-cols-[1fr_3fr]">
              <Label htmlFor={`bonus-${i}`}>
                {bonus.type === "skill" ? "Skill" : "Edge"} {i + 1}
              </Label>
              <Select
                onValueChange={(value) => {
                  
                }}
              >
                <SelectTrigger
                  className="md:w-auto w-full md:flex-1"
                  id={`bonus-${i}`}
                >
                  <SelectValue placeholder="Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                   
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* + with a dropdown to select one out of the list gray out to expensive flavour bonuses */}
        {/* list of flavour bonuses with extra options if needed */}
      </DialogContent>
    </Dialog>
  );
}

export { FlavourBonusesModal };
