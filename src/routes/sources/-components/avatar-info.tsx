import type { Contributor } from "@/types/source";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  IconExternalLink,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandPatreon,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandBluesky,
} from "@tabler/icons-react";

export default function AvatarInfo({
  contributor,
}: {
  contributor: Contributor;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Avatar>
          <AvatarImage src={contributor.image} alt={contributor.name} />
          <AvatarFallback className="select-none">
            {contributor.name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((name) => name.charAt(0))
              .join("")}
          </AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="p-2">
          <p className="font-medium">
            {contributor.name}{" "}
            <span className="text-sm text-muted-foreground">
              {contributor.title}
            </span>
          </p>
          {contributor.contact?.map((contact) => {
            const Icon =
              contact.type === "Github"
                ? IconBrandGithub
                : contact.type === "Youtube"
                  ? IconBrandYoutube
                  : contact.type === "Instagram"
                    ? IconBrandInstagram
                    : contact.type === "Bluesky"
                      ? IconBrandBluesky
                      : contact.type === "Discord"
                        ? IconBrandDiscord
                        : contact.type === "Patreon"
                          ? IconBrandPatreon
                          : IconExternalLink;

            return (
              <div key={contact.type}>
                {contact.url ? (
                  <a
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    <Icon className="inline mr-1 size-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {contact.name}
                    </span>
                  </a>
                ) : (
                  <div>
                    <Icon className="inline mr-1 size-4 text-primary" />
                    <span>{contact.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
