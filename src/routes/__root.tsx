import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from '@/components/theme-provider'
import type { usePokerApi } from '@/hooks/usePokerApi'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext<
  ReturnType<typeof usePokerApi>
>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
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
      <TanStackRouterDevtools />
    </>
  )
}
