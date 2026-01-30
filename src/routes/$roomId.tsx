import { Poker } from '@/components/Poker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$roomId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Poker />
}
