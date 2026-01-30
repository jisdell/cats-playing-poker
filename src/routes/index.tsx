import { JoinCard } from '@/components/JoinCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: ({ context }) => {
    return context.join
  },
})

function RouteComponent() {
  const join = Route.useLoaderData()
  return <JoinCard join={join} />
}
