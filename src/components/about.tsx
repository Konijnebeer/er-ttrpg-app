import { InfoIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandKickstarter,
  IconBrandPatreon,
  IconBrandYoutube,
  IconExternalLink,
} from "@tabler/icons-react";
import { ScrollArea } from "./ui/scroll-area";

export default function About() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed right-5 top-5 z-50"
          aria-label="Back to previous page"
        >
          <InfoIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] sm:max-h-[60vh]">
          <DialogDescription className="text-primary text-md gap-2 flex flex-col md:flex-row">
            <span className="space-y-2 flex flex-col">
              <span>
                This website is a <strong>fan-made</strong> project created to
                help players of the Eternal Ruins TTRPG. It is not affiliated
                with Mythworks.
              </span>
              <span>
                The website provides easy to use digital character sheets and
                content references, to make play easier.
              </span>
              <span>
                Please support Sam Carr and Mythworks by backing their
                Kickstarter and following their socials via the links below.
              </span>
            </span>
            <iframe
              src="https://www.kickstarter.com/projects/mythworks/eternal-ruins/widget/card.html?v=2"
              width="220"
              height="420"
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </DialogDescription>
          <DialogFooter className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-start">
              <p className="font-semibold">Links</p>
              <Button variant="link" asChild>
                <a
                  href="https://www.kickstarter.com/projects/mythworks/eternal-ruins"
                  target="_blank"
                >
                  <IconBrandKickstarter />
                  <span>Eternal Ruins RPG Kickstarter</span>
                </a>
              </Button>
              <Button variant="link" asChild>
                <a href="https://www.myth.works/" target="_blank">
                  <IconExternalLink />
                  <span>Mythworks</span>
                </a>
              </Button>
              <Button variant="link" asChild>
                <a href="https://eternalruins.com/" target="_blank">
                  <IconExternalLink />
                  <span>Eternal Ruins Website</span>
                </a>
              </Button>
            </div>
            <div className="flex flex-col items-start">
              <p className="font-semibold">Social Media</p>
              <Button variant="link" asChild>
                <a
                  href="https://www.patreon.com/c/eternalruins/posts"
                  target="_blank"
                >
                  <IconBrandPatreon />
                  <span>Patreon</span>
                </a>
              </Button>
              <Button variant="link" asChild>
                <a href="https://discord.com/invite/PRb4gPSUr6" target="_blank">
                  <IconBrandDiscord />
                  <span>Discord</span>
                </a>
              </Button>
              <Button variant="link" asChild>
                <a
                  href="https://www.youtube.com/@Eternal_ruins"
                  target="_blank"
                >
                  <IconBrandYoutube />
                  <span>Youtube</span>
                </a>
              </Button>
              <Button variant="link" asChild>
                <a href="https://www.instagram.com/samcarr_/" target="_blank">
                  <IconBrandInstagram />
                  <span>Instagram</span>
                </a>
              </Button>
            </div>
            <div className="ml-auto col-span-2">
              <p className="flex items-center text-sm">
                <span>Created by:</span>
                <Button variant="link" asChild>
                  <a href="https://github.com/Konijnebeer" target="_blank">
                    <span>Konijnebeer</span>
                    <IconBrandGithub />
                  </a>
                </Button>
              </p>
            </div>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
