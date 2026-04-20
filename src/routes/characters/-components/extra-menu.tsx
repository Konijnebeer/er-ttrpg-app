import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dices, Sparkles, SquarePlus } from "lucide-react";
import { FlavourBonusesModal } from "./flavourBonuses";

function ExtraMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <SquarePlus />
          Extra's
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem asChild>
          <FlavourBonusesModal />
        </DropdownMenuItem>
        <DropdownMenuItem disabled asChild>
          <Button variant="outline" className="w-full mt-1">
            <Sparkles />
            <span>Learn Relic</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem disabled asChild>
          <Button variant="outline" className="w-full mt-1">
            <Dices />
            <span>Roll Dice</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ExtraMenu };
