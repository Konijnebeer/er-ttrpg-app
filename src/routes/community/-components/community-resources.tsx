import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileDown, ImageDown, Key } from "lucide-react";
import { useEffect, useState } from "react";
import type { Contributor } from "@/types/source";
import { BASE_PATH } from "@/lib/constants";
import AvatarInfo from "@/routes/sources/-components/avatar-info";

type ManifestResource = {
  id:           string;
  title:        string;
  preview:      string;
  contributors: Contributor[];
  links:        Link[];
};

type Link = {
  name:   string;
  type:   "Website" | "Download-pdf" | "Download-image";
  source: string;
};

function CommunityResources() {
  const [manifest, setManifest] = useState<{
    resources: ManifestResource[];
  } | null>(null);

  useEffect(() => {
    // Fetch manifest from public folder
    fetch(`${BASE_PATH}/community/manifest.json`)
      .then((res) => res.json())
      .then((data) => setManifest(data))
      .catch((err) => console.error("Failed to load manifest:", err));
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {manifest &&
        manifest.resources.map((resource) => (
          <CommunityItem
            key={resource.id}
            id={resource.id}
            contributors={resource.contributors}
            title={resource.title}
            preview={resource.preview}
            links={resource.links}
          />
        ))}
    </section>
  );
}

function CommunityItem({
  id,
  contributors,
  title,
  preview,
  links,
}: {
  id:           string;
  contributors: Contributor[];
  title:        string;
  preview:      string;
  links:        Link[];
}) {
  return (
    <Card className="p-4 gap-2 border-none shadow-none">
      <CardHeader>
        <CardTitle>
          <h2 className="text-center text-2xl">{title}</h2>
        </CardTitle>
        <CardDescription className="pl-6">
          <div className="flex -space-x-2 *:bg-muted-foreground">
            {contributors.map((contributor, i) => (
              <AvatarInfo key={i} contributor={contributor} />
            ))}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <img
          src={`${BASE_PATH}/community/${id}/${preview}`}
          alt={`${title} preview image`}
          className="max-w-full h-auto max-h-80 object-contain border-2 border-border rounded-md"
        />
      </CardContent>
      <CardFooter className="gap-4 pt-2 mt-auto justify-center flex-col sm:flex-row">
        {links.map((link) => {
          let Icon;

          switch (link.type) {
            case "Download-image":
              Icon = ImageDown;
              break;
            case "Download-pdf":
              Icon = FileDown;
              break;
            default:
              Icon = ExternalLink;
          }
          return (
            <Button key={link.name} asChild>
              {link.type === "Website" ? (
                <a href={link.source} target="_blank" rel="noreferrer">
                  {link.name}
                  <Icon />
                </a>
              ) : (
                <a
                  href={`${BASE_PATH}/community/${id}/${link.source}`}
                  download
                >
                  {link.name}
                  <Icon />
                </a>
              )}
            </Button>
          );
        })}
      </CardFooter>
    </Card>
  );
}

export { CommunityResources };
