import { RouterProvider } from '@tanstack/react-router'
import { router } from './router.tsx'
import { usePokerApi } from '@/hooks/usePokerApi'
import { useEffect, useRef } from 'react'

function App() {
  const socketRef = useRef<WebSocket>(null)
  const pokerApi = usePokerApi(socketRef)

  useEffect(() => {
    console.log(pokerApi.isConnected, Date.now())
  }, [pokerApi.isConnected])

  // Inject the returned value from the hook into the router context
  return <RouterProvider router={router} context={pokerApi} />
}

export default App
