import { RouterProvider } from '@tanstack/react-router'
import { router } from './router.tsx'
import { usePokerApi } from '@/hooks/usePokerApi'
import { StrictMode, useRef } from 'react'
import { PokerContext } from './context.ts'

function App() {
  const socketRef = useRef<WebSocket>(null)
  const pokerApi = usePokerApi(socketRef)

  // Inject the returned value from the hook into the router context
  return (
    <PokerContext value={pokerApi}>
      <RouterProvider router={router} context={pokerApi} />
    </PokerContext>
  )
}

export default function AppWrapper() {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}
