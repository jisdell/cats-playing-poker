import { Navbar } from './Navbar'
import { Toaster } from 'sonner'
import { ScrollArea } from './ui/scroll-area'
import type { ReactNode } from 'react'

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="h-screen w-screen flex flex-col bg-background text-foreground">
    <header className="h-[60px] bg-background text-foreground py-2 border-b border-muted">
      <Navbar />
    </header>

    <main className="flex flex-col">
      <ScrollArea className="overflow-x-auto">
        <div className="h-[calc(100vh-60px)] flex">{children}</div>
      </ScrollArea>
      <Toaster position="bottom-left" richColors/>
    </main>
  </div>
)
