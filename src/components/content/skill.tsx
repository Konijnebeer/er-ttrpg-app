import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import type { EdgeSkill } from "@/types/source";

function SkillCard({ skill }: { skill: EdgeSkill }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>{skill.name}</ItemTitle>
          <ItemActions className="font-semibold">
            {skill.maxTrack && <span>Tracks: {skill.maxTrack}</span>}
          </ItemActions>
        </ItemHeader>
        <ItemDescription>{skill.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
export { SkillCard };
