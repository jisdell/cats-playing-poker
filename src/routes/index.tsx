import { JoinCard } from '@/components/JoinCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: ({ context }) => {},
})

function RouteComponent() {
  return <JoinCard />
}
