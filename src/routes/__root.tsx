import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { usePokerApi } from '@/hooks/usePokerApi'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Toaster } from 'sonner'

export const Route = createRootRouteWithContext<
  ReturnType<typeof usePokerApi>
>()({
  component: RootComponent,
})

function RootComponent() {
  const {
    isConnected,
    roomState,
    initClientConfig,
    join,
    addTopic,
    removeTopic,
    vote,
    reveal,
    newRound,
    sendNudge,
    nudge,
    hasEveryoneVoted,
    closeSocket,
  } = usePokerApi()

  useEffect(() => {
    console.log(isConnected, Date.now())
  }, [isConnected])
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen w-screen flex flex-col bg-background text-foreground">
        <header className="h-[60px] bg-background text-foreground py-2 border-b border-muted">
          <Navbar />
        </header>

        <main className="flex flex-col">
          <ScrollArea className="overflow-x-auto">
            <div className="h-[calc(100vh-60px)] flex">
              <Outlet />
            </div>
          </ScrollArea>
          <Toaster position="bottom-left" richColors />
        </main>
      </div>
    </ThemeProvider>
  )
}
