import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/characters/$characterId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { characterId } = Route.useParams();
  // change metadata vallues like dependencies, also where you update a character
  return <div>Hello {characterId} edit</div>;
}
