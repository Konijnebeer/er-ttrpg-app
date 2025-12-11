import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/section";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
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
function SkillSection({ skills }: { skills: EdgeSkill[] }) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Skills</SectionTitle>
        <SectionDescription>Skills within the source</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <ScrollArea className="h-[30vh] h-max-[40vh]">
          <div className="space-y-2">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}

export { SkillCard, SkillSection };
