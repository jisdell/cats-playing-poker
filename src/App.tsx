import { RouterProvider } from '@tanstack/react-router'
import { router } from './router.tsx'
import { usePokerApi } from '@/hooks/usePokerApi'
import { useEffect } from 'react'

function App() {
  const pokerApi = usePokerApi()

  useEffect(() => {
    console.log(pokerApi.isConnected, Date.now())
  }, [pokerApi.isConnected])

  // Inject the returned value from the hook into the router context
  return <RouterProvider router={router} context={pokerApi} />
}

export default App
