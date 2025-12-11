import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sources/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sources/new"!</div>
}
