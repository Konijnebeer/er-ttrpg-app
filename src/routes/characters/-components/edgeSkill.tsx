import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { useCharacterStore } from "@/store/characterStore";
import { useSourceStore } from "@/store/sourceStore";
import type { EdgeSkillReference } from "@/types/character";
import { Track } from "./track";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function EdgeSkillSection({
  edgesSkills,
  type,
}: {
  edgesSkills: EdgeSkillReference[];
  type:        "edges" | "skills";
}) {
  return (
    <Section className="py-2">
      <SectionHeader>
        <SectionTitle>
          <h2>{type}</h2>
        </SectionTitle>
        <SectionDescription>(Add 1d6 if appropriate)</SectionDescription>
      </SectionHeader>
      <SectionContent className="md:columns-2 md:gap-4">
        {edgesSkills.map((edgeSkill, index) => (
          <EdgeSkillCard
            key={edgeSkill.ref}
            edgeSkillIndex={index}
            edgeSkill={edgeSkill}
            type={type}
          />
        ))}
      </SectionContent>
    </Section>
  );
}

function EdgeSkillCard({
  type,
  edgeSkill,
  edgeSkillIndex,
}: {
  type:           "edges" | "skills";
  edgeSkill:      EdgeSkillReference;
  edgeSkillIndex: number;
}) {
  const { error, resolveRefrence } = useSourceStore();
  const { updateCharacter, character } = useCharacterStore();

  const edgeSkillObject = resolveRefrence(edgeSkill.ref, type);

  const handleLevelChange = (newLevel: number) => {
    if (type === "edges") {
      if (!character?.data?.edges) return;

      const updatedEdges = [...character.data.edges];
      updatedEdges[edgeSkillIndex] = {
        ...updatedEdges[edgeSkillIndex],
        level: newLevel,
      };

      updateCharacter({
        data: {
          ...character.data,
          edges: updatedEdges,
        },
      });
    }
    if (type === "skills") {
      if (!character?.data?.skills) return;

      const updatedSkills = [...character.data.skills];
      updatedSkills[edgeSkillIndex] = {
        ...updatedSkills[edgeSkillIndex],
        level: newLevel,
      };

      updateCharacter({
        data: {
          ...character.data,
          skills: updatedSkills,
        },
      });
    }
  };

  const handleFlavourBonusChange = () => {
    if (type === "edges") {
      if (!character?.data?.edges) return;

      const updatedEdges = [...character.data.edges];
      updatedEdges[edgeSkillIndex] = {
        ...updatedEdges[edgeSkillIndex],
        flavourBonus: !updatedEdges[edgeSkillIndex].flavourBonus,
      };

      updateCharacter({
        data: {
          ...character.data,
          edges: updatedEdges,
        },
      });
    }
    if (type === "skills") {
      if (!character?.data?.skills) return;

      const updatedSkills = [...character.data.skills];
      updatedSkills[edgeSkillIndex] = {
        ...updatedSkills[edgeSkillIndex],
        flavourBonus: !updatedSkills[edgeSkillIndex].flavourBonus,
      };

      updateCharacter({
        data: {
          ...character.data,
          skills: updatedSkills,
        },
      });
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!edgeSkillObject) {
    return <div>Edge not found: {edgeSkill.ref}</div>;
  }

  return (
    <div className="grid grid-cols-[1fr_3fr] md:grid-cols-[2fr_3fr] py-1">
      <Popover>
        <PopoverTrigger className="cursor-help" asChild>
          <p>{edgeSkillObject.name}</p>
        </PopoverTrigger>
        <PopoverContent className="max-w-xs text-center">
          {edgeSkillObject.description}
        </PopoverContent>
      </Popover>
      <div className="grow flex justify-center items-center">
        <Track
          maxTrack={edgeSkillObject.maxTrack}
          track={edgeSkill.level}
          onChange={handleLevelChange}
        />
        {edgeSkill.flavourBonus && (
          <Track
            maxTrack={1}
            track={1}
            onChange={handleFlavourBonusChange}
            className="ml-2"
            checkboxClassName="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
        )}
      </div>
    </div>
  );
}

export { EdgeSkillSection };
